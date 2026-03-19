-- ═══════════════════════════════════════════════════════════════════════
-- CareNet Migration 02: Views & RPCs for Aggregation-Heavy Methods
-- ═══════════════════════════════════════════════════════════════════════
-- Run AFTER 01_seed_data.sql in Supabase SQL Editor.
--
-- Creates:
--   • Views for admin dashboard, agency performance, earnings charts
--   • RPCs (server-side functions) for complex aggregations
--   • Materialized helpers where appropriate
-- ═══════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────
-- 1. HELPER: get_user_role(uid) — extract role from profiles
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_role(uid uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE id = uid),
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = uid)
  );
$$;


-- ─────────────────────────────────────────────────────────────────────
-- 2. VIEW: admin_platform_stats
--    Live counts for the admin dashboard header cards
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW admin_platform_stats AS
SELECT
  (SELECT count(*) FROM profiles)::int                                       AS total_users,
  (SELECT count(*) FROM profiles WHERE role = 'caregiver')::int              AS total_caregivers,
  (SELECT count(*) FROM profiles WHERE role = 'guardian')::int               AS total_guardians,
  (SELECT count(*) FROM patients WHERE status = 'active')::int               AS total_active_patients,
  (SELECT count(*) FROM agencies)::int                                       AS total_agencies,
  (SELECT count(*) FROM placements WHERE status = 'active')::int             AS active_placements,
  (SELECT count(*) FROM shifts WHERE status = 'scheduled')::int              AS upcoming_shifts,
  (SELECT count(*) FROM shifts WHERE status = 'completed')::int              AS completed_shifts,
  (SELECT count(*) FROM jobs WHERE status IN ('open','applications'))::int   AS open_jobs,
  (SELECT count(*) FROM invoices WHERE status = 'unpaid')::int               AS unpaid_invoices,
  (SELECT count(*) FROM invoices WHERE status = 'proof_submitted')::int      AS pending_verifications,
  (SELECT COALESCE(sum(total), 0) FROM invoices WHERE status = 'paid')       AS total_revenue,
  (SELECT COALESCE(sum(total), 0) FROM invoices WHERE status = 'unpaid')     AS total_outstanding,
  (SELECT count(*) FROM support_tickets WHERE status = 'open')::int          AS open_tickets,
  (SELECT count(*) FROM caregiver_documents WHERE status = 'pending')::int   AS pending_doc_verifications,
  (SELECT count(*) FROM incident_reports WHERE status = 'open')::int         AS open_incidents,
  (SELECT count(*) FROM care_contracts WHERE status = 'published')::int      AS active_marketplace_listings;


-- ─────────────────────────────────────────────────────────────────────
-- 3. VIEW: admin_user_growth_monthly
--    Month-by-month user sign-up counts by role (last 12 months)
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW admin_user_growth_monthly AS
SELECT
  to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
  date_trunc('month', created_at) AS month_start,
  count(*) FILTER (WHERE role = 'caregiver')::int AS caregivers,
  count(*) FILTER (WHERE role = 'guardian')::int  AS guardians,
  count(*) FILTER (WHERE role = 'patient')::int   AS patients,
  count(*)::int AS total
FROM profiles
WHERE created_at >= (now() - interval '12 months')
GROUP BY date_trunc('month', created_at)
ORDER BY month_start;


-- ─────────────────────────────────────────────────────────────────────
-- 4. VIEW: admin_revenue_monthly
--    Monthly platform revenue from paid invoices (last 12 months)
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW admin_revenue_monthly AS
SELECT
  to_char(date_trunc('month', paid_date::date), 'Mon YYYY') AS month,
  date_trunc('month', paid_date::date) AS month_start,
  COALESCE(sum(total), 0)::numeric AS revenue,
  COALESCE(sum(platform_fee), 0)::numeric AS platform_fees,
  count(*)::int AS invoice_count
FROM invoices
WHERE status = 'paid'
  AND paid_date IS NOT NULL
  AND paid_date::date >= (current_date - interval '12 months')
GROUP BY date_trunc('month', paid_date::date)
ORDER BY month_start;


-- ─────────────────────────────────────────────────────────────────────
-- 5. VIEW: admin_payments_monthly
--    Monthly income vs payouts for admin financial chart
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW admin_payments_monthly AS
SELECT
  to_char(m.month_start, 'Mon YYYY') AS month,
  m.month_start,
  COALESCE(inc.income, 0)::numeric  AS income,
  COALESCE(pay.payouts, 0)::numeric AS payouts
FROM generate_series(
  date_trunc('month', current_date - interval '11 months'),
  date_trunc('month', current_date),
  '1 month'
) AS m(month_start)
LEFT JOIN (
  SELECT date_trunc('month', paid_date::date) AS mo, sum(total) AS income
  FROM invoices WHERE status = 'paid' AND paid_date IS NOT NULL
  GROUP BY mo
) inc ON inc.mo = m.month_start
LEFT JOIN (
  SELECT date_trunc('month', created_at) AS mo, sum(amount) AS payouts
  FROM wallet_transactions WHERE type = 'withdrawal' AND status = 'completed'
  GROUP BY mo
) pay ON pay.mo = m.month_start
ORDER BY m.month_start;


-- ─────────────────────────────────────────────────────────────────────
-- 6. VIEW: admin_pending_items
--    Aggregated counts of items needing admin attention
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW admin_pending_items AS
SELECT
  'doc_verifications'  AS item_type,
  count(*)::int        AS count
FROM caregiver_documents WHERE status = 'pending'
UNION ALL
SELECT 'payment_proofs', count(*)::int
FROM payment_proofs WHERE status = 'pending'
UNION ALL
SELECT 'support_tickets', count(*)::int
FROM support_tickets WHERE status = 'open'
UNION ALL
SELECT 'open_incidents', count(*)::int
FROM incident_reports WHERE status = 'open'
UNION ALL
SELECT 'open_jobs', count(*)::int
FROM jobs WHERE status IN ('open', 'applications');


-- ─────────────────────────────────────────────────────────────────────
-- 7. VIEW: agency_performance_summary
--    Per-agency metrics: placements, avg rating, on-time %, incidents
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW agency_performance_summary AS
SELECT
  a.id                                                          AS agency_id,
  a.name                                                        AS agency_name,
  a.rating                                                      AS agency_rating,
  a.verified                                                    AS agency_verified,
  COALESCE(pl.placement_count, 0)::int                          AS total_placements,
  COALESCE(pl.active_placements, 0)::int                        AS active_placements,
  COALESCE(sh.total_shifts, 0)::int                             AS total_shifts,
  COALESCE(sh.completed_shifts, 0)::int                         AS completed_shifts,
  COALESCE(sh.cancelled_shifts, 0)::int                         AS cancelled_shifts,
  CASE WHEN COALESCE(sh.total_shifts, 0) > 0
    THEN round(sh.completed_shifts::numeric / sh.total_shifts * 100, 1)
    ELSE 0 END                                                  AS on_time_rate,
  COALESCE(inc.incident_count, 0)::int                          AS incident_count,
  CASE WHEN COALESCE(sh.total_shifts, 0) > 0
    THEN round(inc.incident_count::numeric / sh.total_shifts * 100, 2)
    ELSE 0 END                                                  AS incident_rate,
  COALESCE(rev.total_revenue, 0)::numeric                       AS total_revenue,
  a.caregiver_count
FROM agencies a
LEFT JOIN (
  SELECT agency_id,
    count(*) AS placement_count,
    count(*) FILTER (WHERE status = 'active') AS active_placements
  FROM placements GROUP BY agency_id
) pl ON pl.agency_id = a.id
LEFT JOIN (
  SELECT p.agency_id,
    count(*) AS total_shifts,
    count(*) FILTER (WHERE s.status = 'completed') AS completed_shifts,
    count(*) FILTER (WHERE s.status = 'cancelled') AS cancelled_shifts
  FROM shifts s
  JOIN placements p ON s.placement_id = p.id
  GROUP BY p.agency_id
) sh ON sh.agency_id = a.id
LEFT JOIN (
  SELECT p.agency_id, count(*) AS incident_count
  FROM incident_reports ir
  JOIN placements p ON ir.patient_id = p.patient_id AND p.agency_id IS NOT NULL
  GROUP BY p.agency_id
) inc ON inc.agency_id = a.id
LEFT JOIN (
  SELECT from_party_id, sum(total) AS total_revenue
  FROM invoices WHERE status = 'paid'
  GROUP BY from_party_id
) rev ON rev.from_party_id = a.id;


-- ─────────────────────────────────────────────────────────────────────
-- 8. VIEW: agency_revenue_monthly
--    Per-agency monthly revenue
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW agency_revenue_monthly AS
SELECT
  from_party_id AS agency_id,
  to_char(date_trunc('month', paid_date::date), 'Mon YYYY') AS month,
  date_trunc('month', paid_date::date) AS month_start,
  sum(total)::numeric AS revenue,
  count(*)::int AS invoice_count
FROM invoices
WHERE status = 'paid' AND paid_date IS NOT NULL
GROUP BY from_party_id, date_trunc('month', paid_date::date)
ORDER BY agency_id, month_start;


-- ─────────────────────────────────────────────────────────────────────
-- 9. VIEW: agency_monthly_overview
--    Per-agency clients / caregivers / revenue by month
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW agency_monthly_overview AS
SELECT
  a.id AS agency_id,
  to_char(m.mo, 'Mon YYYY') AS month,
  m.mo AS month_start,
  COALESCE(cl.client_count, 0)::int    AS clients,
  COALESCE(cg.caregiver_count, 0)::int AS caregivers,
  COALESCE(rv.revenue, 0)::numeric     AS revenue
FROM agencies a
CROSS JOIN generate_series(
  date_trunc('month', current_date - interval '5 months'),
  date_trunc('month', current_date),
  '1 month'
) AS m(mo)
LEFT JOIN (
  SELECT agency_id, date_trunc('month', start_date::date) AS mo,
    count(DISTINCT guardian_id) AS client_count
  FROM placements
  GROUP BY agency_id, mo
) cl ON cl.agency_id = a.id AND cl.mo = m.mo
LEFT JOIN (
  SELECT agency_id, date_trunc('month', created_at) AS mo,
    count(DISTINCT id) AS caregiver_count
  FROM caregiver_profiles WHERE agency_id IS NOT NULL
  GROUP BY agency_id, mo
) cg ON cg.agency_id = a.id AND cg.mo = m.mo
LEFT JOIN (
  SELECT from_party_id, date_trunc('month', paid_date::date) AS mo,
    sum(total) AS revenue
  FROM invoices WHERE status = 'paid' AND paid_date IS NOT NULL
  GROUP BY from_party_id, mo
) rv ON rv.from_party_id = a.id AND rv.mo = m.mo
ORDER BY a.id, m.mo;


-- ─────────────────────────────────────────────────────────────────────
-- 10. VIEW: caregiver_earnings_monthly
--     Per-caregiver monthly earnings from completed shifts/invoices
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW caregiver_earnings_monthly AS
SELECT
  wt.wallet_id AS caregiver_wallet_id,
  to_char(date_trunc('month', wt.created_at), 'Mon YYYY') AS month,
  date_trunc('month', wt.created_at) AS month_start,
  COALESCE(sum(wt.amount) FILTER (WHERE wt.type IN ('earning', 'bonus', 'credit')), 0)::numeric AS earned,
  COALESCE(sum(wt.amount) FILTER (WHERE wt.type = 'withdrawal'), 0)::numeric                    AS withdrawn
FROM wallet_transactions wt
WHERE wt.created_at >= (now() - interval '12 months')
GROUP BY wt.wallet_id, date_trunc('month', wt.created_at)
ORDER BY caregiver_wallet_id, month_start;


-- ─────────────────────────────────────────────────────────────────────
-- 11. VIEW: caregiver_tax_report
--     Per-caregiver monthly income for tax reporting
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW caregiver_tax_report AS
SELECT
  wt.wallet_id AS caregiver_wallet_id,
  to_char(date_trunc('month', wt.created_at), 'Mon YYYY') AS month,
  date_trunc('month', wt.created_at) AS month_start,
  COALESCE(sum(wt.amount), 0)::numeric AS income
FROM wallet_transactions wt
WHERE wt.type IN ('earning', 'bonus', 'credit')
  AND wt.status = 'completed'
  AND wt.created_at >= date_trunc('year', current_date)
GROUP BY wt.wallet_id, date_trunc('month', wt.created_at)
ORDER BY caregiver_wallet_id, month_start;


-- ─────────────────────────────────────────────────────────────────────
-- 12. VIEW: shift_monitoring_live
--     Active shifts with check-in/location data for agency monitoring
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW shift_monitoring_live AS
SELECT
  s.id AS shift_id,
  s.caregiver_id,
  cp.name AS caregiver_name,
  s.patient_id,
  p.name AS patient_name,
  s.date,
  s.start_time,
  s.end_time,
  s.status,
  s.check_in_time,
  s.check_out_time,
  s.check_in_gps_lat,
  s.check_in_gps_lng,
  s.location,
  s.notes,
  pl.agency_id,
  pl.id AS placement_id,
  -- Late flag: shift scheduled but not checked in within 15 min of start
  CASE
    WHEN s.status = 'scheduled'
      AND current_time > (s.start_time::time + interval '15 minutes')
      AND s.date = current_date
    THEN true
    ELSE false
  END AS is_late,
  -- Duration so far (if checked in)
  CASE
    WHEN s.check_in_time IS NOT NULL AND s.check_out_time IS NULL
    THEN extract(epoch FROM (now() - s.check_in_time)) / 3600
    ELSE NULL
  END AS hours_elapsed
FROM shifts s
LEFT JOIN caregiver_profiles cp ON cp.id = s.caregiver_id
LEFT JOIN patients p ON p.id = s.patient_id
LEFT JOIN placements pl ON pl.id = s.placement_id
WHERE s.date = current_date
  AND s.status IN ('scheduled', 'checked-in', 'in-progress')
ORDER BY s.start_time;


-- ─────────────────────────────────────────────────────────────────────
-- 13. RPC: get_admin_dashboard()
--     Returns a JSON blob with all admin dashboard data in one call
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_admin_dashboard()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'stats', (SELECT row_to_json(s) FROM admin_platform_stats s),
    'userGrowth', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'month', month, 'caregivers', caregivers, 'guardians', guardians, 'patients', patients
      ) ORDER BY month_start) FROM admin_user_growth_monthly),
      '[]'::jsonb
    ),
    'revenueData', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'month', month, 'revenue', revenue
      ) ORDER BY month_start) FROM admin_revenue_monthly),
      '[]'::jsonb
    ),
    'pendingItems', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('type', item_type, 'count', count))
       FROM admin_pending_items WHERE count > 0),
      '[]'::jsonb
    ),
    'paymentsChart', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'month', month, 'income', income, 'payouts', payouts
      ) ORDER BY month_start) FROM admin_payments_monthly),
      '[]'::jsonb
    )
  ) INTO result;

  RETURN result;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────
-- 14. RPC: get_agency_dashboard(p_agency_id)
--     Returns agency dashboard data in one call
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_agency_dashboard(p_agency_id uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'performance', (
      SELECT row_to_json(a)
      FROM agency_performance_summary a
      WHERE a.agency_id = p_agency_id
    ),
    'revenueChart', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('month', month, 'amount', revenue)
       ORDER BY month_start)
       FROM agency_revenue_monthly WHERE agency_id = p_agency_id),
      '[]'::jsonb
    ),
    'monthlyOverview', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'month', month, 'clients', clients, 'caregivers', caregivers, 'revenue', revenue
      ) ORDER BY month_start)
       FROM agency_monthly_overview WHERE agency_id = p_agency_id),
      '[]'::jsonb
    ),
    'liveShifts', COALESCE(
      (SELECT jsonb_agg(row_to_json(sm))
       FROM shift_monitoring_live sm
       WHERE sm.agency_id = p_agency_id),
      '[]'::jsonb
    ),
    'lateAlerts', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'type', 'late_checkin',
        'text', caregiver_name || ' has not checked in for ' || patient_name || ' shift (' || start_time || ')',
        'time', start_time
      )) FROM shift_monitoring_live
       WHERE agency_id = p_agency_id AND is_late = true),
      '[]'::jsonb
    )
  ) INTO result;

  RETURN result;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────
-- 15. RPC: get_caregiver_earnings(p_caregiver_id)
--     Returns caregiver earnings chart + tax data in one call
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_caregiver_earnings(p_caregiver_id uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  wallet_id_val text;
BEGIN
  -- Look up the wallet ID for this user
  SELECT user_id INTO wallet_id_val
  FROM wallets WHERE user_id = p_caregiver_id::text;

  -- If no wallet, try user_id directly
  IF wallet_id_val IS NULL THEN
    wallet_id_val := p_caregiver_id::text;
  END IF;

  SELECT jsonb_build_object(
    'earningsChart', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('month', month, 'earned', earned, 'withdrawn', withdrawn)
       ORDER BY month_start)
       FROM caregiver_earnings_monthly
       WHERE caregiver_wallet_id = wallet_id_val),
      '[]'::jsonb
    ),
    'taxReport', COALESCE(
      (SELECT jsonb_agg(jsonb_build_object('month', month, 'income', income)
       ORDER BY month_start)
       FROM caregiver_tax_report
       WHERE caregiver_wallet_id = wallet_id_val),
      '[]'::jsonb
    ),
    'totalEarned', COALESCE(
      (SELECT sum(earned) FROM caregiver_earnings_monthly
       WHERE caregiver_wallet_id = wallet_id_val), 0
    ),
    'totalWithdrawn', COALESCE(
      (SELECT sum(withdrawn) FROM caregiver_earnings_monthly
       WHERE caregiver_wallet_id = wallet_id_val), 0
    )
  ) INTO result;

  RETURN result;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────
-- 16. RPC: get_guardian_spending(p_guardian_id)
--     Returns guardian spending chart data
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_guardian_spending(p_guardian_id uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT jsonb_agg(jsonb_build_object(
      'month', to_char(date_trunc('month', i.issued_date::date), 'Mon'),
      'amount', sum(i.total)
    ) ORDER BY date_trunc('month', i.issued_date::date))
     FROM invoices i
     WHERE i.to_party_id = p_guardian_id::text
       AND i.issued_date::date >= (current_date - interval '6 months')
     GROUP BY date_trunc('month', i.issued_date::date)),
    '[]'::jsonb
  );
END;
$$;


-- ─────────────────────────────────────────────────────────────────────
-- 17. VIEW: admin_recent_activity
--     Union of recent platform activities for admin dashboard feed
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW admin_recent_activity AS
(
  SELECT
    'shift_completed' AS type,
    'Shift completed: ' || cp.name || ' for ' || p.name AS text,
    s.check_out_time::timestamptz AS time
  FROM shifts s
  JOIN caregiver_profiles cp ON cp.id = s.caregiver_id
  JOIN patients p ON p.id = s.patient_id
  WHERE s.status = 'completed' AND s.check_out_time IS NOT NULL
  ORDER BY s.check_out_time DESC
  LIMIT 5
)
UNION ALL
(
  SELECT
    'invoice_paid',
    'Invoice paid: ' || from_party_name || ' → ' || to_party_name || ' (৳' || total || ')',
    (paid_date::date)::timestamptz
  FROM invoices
  WHERE status = 'paid' AND paid_date IS NOT NULL
  ORDER BY paid_date DESC
  LIMIT 5
)
UNION ALL
(
  SELECT
    'user_joined',
    'New user: ' || name || ' (' || role || ')',
    created_at::timestamptz
  FROM profiles
  ORDER BY created_at DESC
  LIMIT 5
)
UNION ALL
(
  SELECT
    'incident_reported',
    'Incident: ' || type || ' (severity: ' || severity || ')',
    created_at::timestamptz
  FROM incident_reports
  ORDER BY created_at DESC
  LIMIT 3
)
ORDER BY time DESC
LIMIT 15;


-- ─────────────────────────────────────────────────────────────────────
-- 18. VIEW: shop_sales_monthly
--     Monthly shop sales aggregation
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW shop_sales_monthly AS
SELECT
  merchant_id,
  to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
  date_trunc('month', created_at) AS month_start,
  count(*)::int AS order_count,
  sum(total)::numeric AS total_sales
FROM shop_orders
WHERE payment_status = 'completed'
GROUP BY merchant_id, date_trunc('month', created_at)
ORDER BY merchant_id, month_start;


-- ─────────────────────────────────────────────────────────────────────
-- 19. VIEW: shop_category_breakdown
--     Sales by product category for shop analytics
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW shop_category_breakdown AS
SELECT
  sp.merchant_id,
  sp.category,
  count(*)::int AS product_count,
  sum(sp.sales)::int AS total_units_sold,
  sum(sp.price * sp.sales)::numeric AS total_revenue
FROM shop_products sp
GROUP BY sp.merchant_id, sp.category
ORDER BY total_revenue DESC;


-- ═══════════════════════════════════════════════════════════════════════
-- DONE! Verify:
--   SELECT * FROM admin_platform_stats;
--   SELECT * FROM agency_performance_summary;
--   SELECT get_admin_dashboard();
--   SELECT get_agency_dashboard('00000000-0000-0000-0000-000000000004');
--   SELECT get_caregiver_earnings('00000000-0000-0000-0000-000000000001');
-- ═══════════════════════════════════════════════════════════════════════