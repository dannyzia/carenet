-- ═══════════════════════════════════════════════════════════════════════
-- CareNet Migration 04: Row-Level Security (RLS) Policies
-- ═══════════════════════════════════════════════════════════════════════
-- Run AFTER 03_moderation_tables.sql in Supabase SQL Editor.
--
-- Enables RLS on ALL tables and creates policies based on user roles.
-- Role is read from `profiles.role` or `auth.users.raw_user_meta_data->>'role'`.
--
-- Policy naming convention:
--   {table}_{action}_{who}   e.g. patients_select_guardian
--
-- Role hierarchy:
--   admin      → full access to everything
--   moderator  → read most + write moderation tables
--   agency     → manage own caregivers, placements, shifts, jobs, invoices
--   guardian   → manage own patients, placements, view shifts, invoices
--   caregiver  → manage own shifts, notes, documents
--   patient    → view own data
--   shop       → manage own products, orders
-- ═══════════════════════════════════════════════════════════════════════


-- ─── Helper: get role for current user ───
-- (reuse get_user_role from 02_views_and_rpcs.sql, or create if missing)
CREATE OR REPLACE FUNCTION auth_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE id = auth.uid()),
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()),
    'anon'
  );
$$;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT auth_role() = 'admin';
$$;

-- Helper: check if current user is moderator or admin
CREATE OR REPLACE FUNCTION is_mod_or_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT auth_role() IN ('admin', 'moderator');
$$;


-- ═══════════════════════════════════════════════════════════════════════
-- ENABLE RLS ON ALL TABLES
-- ═══════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'profiles', 'wallets', 'wallet_transactions',
    'patients', 'caregiver_profiles', 'guardian_profiles', 'agencies',
    'placements', 'shifts', 'shift_ratings',
    'jobs', 'job_applications',
    'care_contracts', 'care_contract_bids',
    'conversations', 'chat_messages',
    'care_notes',
    'invoices', 'invoice_line_items', 'payment_proofs',
    'shop_products', 'shop_orders',
    'daily_tasks', 'prescriptions', 'patient_vitals',
    'incident_reports', 'notifications', 'support_tickets',
    'blog_posts', 'caregiver_reviews', 'caregiver_documents',
    'moderation_queue', 'flagged_content', 'moderator_sanctions',
    'moderator_escalations', 'contract_disputes', 'dispute_messages'
  ]
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    ELSE
      RAISE NOTICE 'Skipping RLS for missing table: %', tbl;
    END IF;
  END LOOP;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════════════════════════════════════
-- Everyone can read profiles (needed for names, roles in UI)
CREATE POLICY profiles_select_all ON profiles
  FOR SELECT USING (true);

-- Users can update only their own profile
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Admin can update any profile
CREATE POLICY profiles_update_admin ON profiles
  FOR UPDATE USING (is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- WALLETS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY wallets_select_own ON wallets
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY wallets_update_admin ON wallets
  FOR UPDATE USING (is_admin());

-- WALLET_TRANSACTIONS
CREATE POLICY wtx_select_own ON wallet_transactions
  FOR SELECT USING (wallet_id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- PATIENTS
-- ═══════════════════════════════════════════════════════════════════════
-- Guardian sees their own patients
CREATE POLICY patients_select_guardian ON patients
  FOR SELECT USING (
    guardian_id = auth.uid()
    OR id = auth.uid()   -- patient sees self
    OR is_admin()
  );

-- Caregiver sees patients they're assigned to
CREATE POLICY patients_select_caregiver ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM placements
      WHERE placements.patient_id = patients.id
        AND placements.caregiver_id = auth.uid()
        AND placements.status = 'active'
    )
  );

-- Agency sees patients in their placements
CREATE POLICY patients_select_agency ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM placements
      WHERE placements.patient_id = patients.id
        AND placements.agency_id = auth.uid()
    )
  );

-- Guardian can insert/update their own patients
CREATE POLICY patients_insert_guardian ON patients
  FOR INSERT WITH CHECK (guardian_id = auth.uid());

CREATE POLICY patients_update_guardian ON patients
  FOR UPDATE USING (guardian_id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- CAREGIVER_PROFILES
-- ═══════════════════════════════════════════════════════════════════════
-- Public read (marketplace, search)
CREATE POLICY cgp_select_all ON caregiver_profiles
  FOR SELECT USING (true);

-- Caregiver can update own profile
CREATE POLICY cgp_update_own ON caregiver_profiles
  FOR UPDATE USING (id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- GUARDIAN_PROFILES
-- ══════════════════════════════════════════════════════════════════════
CREATE POLICY gp_select_own ON guardian_profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY gp_update_own ON guardian_profiles
  FOR UPDATE USING (id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- AGENCIES
-- ═══════════════════════════════════════════════════════════════════════
-- Public read (directory, marketplace)
CREATE POLICY agencies_select_all ON agencies
  FOR SELECT USING (true);

-- Agency can update own record
CREATE POLICY agencies_update_own ON agencies
  FOR UPDATE USING (id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- PLACEMENTS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY placements_select ON placements
  FOR SELECT USING (
    guardian_id = auth.uid()
    OR caregiver_id = auth.uid()
    OR agency_id = auth.uid()
    OR is_admin()
  );

CREATE POLICY placements_insert_agency ON placements
  FOR INSERT WITH CHECK (agency_id = auth.uid() OR is_admin());

CREATE POLICY placements_update ON placements
  FOR UPDATE USING (agency_id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- SHIFTS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY shifts_select ON shifts
  FOR SELECT USING (
    caregiver_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM placements p
      WHERE p.id = shifts.placement_id
        AND (p.guardian_id = auth.uid() OR p.agency_id = auth.uid())
    )
    OR is_admin()
  );

-- Caregiver can update own shifts (check-in/out)
CREATE POLICY shifts_update_caregiver ON shifts
  FOR UPDATE USING (caregiver_id = auth.uid());

-- Agency can insert/update shifts
CREATE POLICY shifts_manage_agency ON shifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM placements p
      WHERE p.id = shifts.placement_id AND p.agency_id = auth.uid()
    )
    OR is_admin()
  );

-- SHIFT_RATINGS
CREATE POLICY sr_select ON shift_ratings
  FOR SELECT USING (
    rated_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM shifts s WHERE s.id = shift_ratings.shift_id AND s.caregiver_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY sr_insert ON shift_ratings
  FOR INSERT WITH CHECK (rated_by = auth.uid());


-- ═══════════════════════════════════════════════════════════════════════
-- JOBS & JOB_APPLICATIONS
-- ═══════════════════════════════════════════════════════════════════════
-- Jobs are public read (marketplace)
CREATE POLICY jobs_select_all ON jobs
  FOR SELECT USING (true);

CREATE POLICY jobs_manage ON jobs
  FOR ALL USING (posted_by = auth.uid() OR is_admin());

-- Applications
CREATE POLICY ja_select ON job_applications
  FOR SELECT USING (
    applicant_id = auth.uid()
    OR EXISTS (SELECT 1 FROM jobs j WHERE j.id = job_applications.job_id AND j.posted_by = auth.uid())
    OR is_admin()
  );

CREATE POLICY ja_insert ON job_applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY ja_update ON job_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM jobs j WHERE j.id = job_applications.job_id AND j.posted_by = auth.uid())
    OR is_admin()
  );


-- ═══════════════════════════════════════════════════════════════════════
-- CARE_CONTRACTS & CARE_CONTRACT_BIDS
-- ═══════════════════════════════════════════════════════════════════════
-- Contracts: published ones are public; otherwise only owner
CREATE POLICY cc_select ON care_contracts
  FOR SELECT USING (
    status IN ('published', 'bidding')
    OR owner_id = auth.uid()
    OR agency_id = auth.uid()
    OR is_admin()
  );

CREATE POLICY cc_manage ON care_contracts
  FOR ALL USING (owner_id = auth.uid() OR is_admin());

-- Bids
CREATE POLICY ccb_select ON care_contract_bids
  FOR SELECT USING (
    agency_id = auth.uid()
    OR EXISTS (SELECT 1 FROM care_contracts cc WHERE cc.id = care_contract_bids.contract_id AND cc.owner_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY ccb_insert ON care_contract_bids
  FOR INSERT WITH CHECK (agency_id = auth.uid());

CREATE POLICY ccb_update ON care_contract_bids
  FOR UPDATE USING (
    agency_id = auth.uid()
    OR EXISTS (SELECT 1 FROM care_contracts cc WHERE cc.id = care_contract_bids.contract_id AND cc.owner_id = auth.uid())
    OR is_admin()
  );


-- ═══════════════════════════════════════════════════════════════════════
-- CONVERSATIONS & CHAT_MESSAGES
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY conv_select ON conversations
  FOR SELECT USING (
    participant_a = auth.uid()
    OR participant_b = auth.uid()
    OR is_mod_or_admin()
  );

CREATE POLICY conv_update ON conversations
  FOR UPDATE USING (
    participant_a = auth.uid() OR participant_b = auth.uid()
  );

CREATE POLICY msg_select ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = chat_messages.conversation_id
        AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())
    )
    OR is_mod_or_admin()
  );

CREATE POLICY msg_insert ON chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());


-- ═══════════════════════════════════════════════════════════════════════
-- CARE_NOTES
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY cn_select ON care_notes
  FOR SELECT USING (
    caregiver_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM patients p WHERE p.id = care_notes.patient_id AND p.guardian_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM placements pl WHERE pl.patient_id = care_notes.patient_id AND pl.agency_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY cn_insert ON care_notes
  FOR INSERT WITH CHECK (caregiver_id = auth.uid());

CREATE POLICY cn_update ON care_notes
  FOR UPDATE USING (caregiver_id = auth.uid());


-- ═══════════════════════════════════════════════════════════════════════
-- INVOICES, LINE ITEMS, PAYMENT PROOFS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY inv_select ON invoices
  FOR SELECT USING (
    from_party_id = auth.uid()
    OR to_party_id = auth.uid()
    OR is_admin()
  );

CREATE POLICY inv_manage ON invoices
  FOR ALL USING (from_party_id = auth.uid() OR is_admin());

CREATE POLICY ili_select ON invoice_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices i
      WHERE i.id = invoice_line_items.invoice_id
        AND (i.from_party_id = auth.uid() OR i.to_party_id = auth.uid())
    )
    OR is_admin()
  );

CREATE POLICY pp_select ON payment_proofs
  FOR SELECT USING (
    submitted_by_id = auth.uid()
    OR received_by_id = auth.uid()
    OR is_admin()
  );

CREATE POLICY pp_insert ON payment_proofs
  FOR INSERT WITH CHECK (submitted_by_id = auth.uid());

CREATE POLICY pp_update ON payment_proofs
  FOR UPDATE USING (received_by_id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- SHOP_PRODUCTS & SHOP_ORDERS
-- ═══════════════════════════════════════════════════════════════════════
-- Products: public read
CREATE POLICY sp_select_all ON shop_products
  FOR SELECT USING (true);

-- Merchant manages own products
CREATE POLICY sp_manage ON shop_products
  FOR ALL USING (merchant_id = auth.uid() OR is_admin());

-- Orders: customer or merchant can see
CREATE POLICY so_select ON shop_orders
  FOR SELECT USING (
    customer_id = auth.uid()
    OR merchant_id = auth.uid()
    OR is_admin()
  );

CREATE POLICY so_insert ON shop_orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY so_update ON shop_orders
  FOR UPDATE USING (merchant_id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- DAILY_TASKS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY dt_select ON daily_tasks
  FOR SELECT USING (
    caregiver_id = auth.uid()
    OR guardian_id = auth.uid()
    OR agency_id = auth.uid()
    OR is_admin()
  );

CREATE POLICY dt_insert ON daily_tasks
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
  );

CREATE POLICY dt_update ON daily_tasks
  FOR UPDATE USING (
    caregiver_id = auth.uid()
    OR guardian_id = auth.uid()
    OR agency_id = auth.uid()
    OR is_admin()
  );


-- ═══════════════════════════════════════════════════════════════════════
-- PRESCRIPTIONS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY rx_select ON prescriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM patients p WHERE p.id = prescriptions.patient_id AND p.guardian_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM placements pl WHERE pl.patient_id = prescriptions.patient_id
        AND (pl.caregiver_id = auth.uid() OR pl.agency_id = auth.uid())
    )
    OR patient_id = auth.uid()
    OR is_admin()
  );


-- ═══════════════════════════════════════════════════════════════════════
-- PATIENT_VITALS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY pv_select ON patient_vitals
  FOR SELECT USING (
    recorded_by = auth.uid()
    OR patient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM patients p WHERE p.id = patient_vitals.patient_id AND p.guardian_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM placements pl WHERE pl.patient_id = patient_vitals.patient_id AND pl.agency_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY pv_insert ON patient_vitals
  FOR INSERT WITH CHECK (recorded_by = auth.uid());


-- ═══════════════════════════════════════════════════════════════════════
-- INCIDENT_REPORTS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY ir_select ON incident_reports
  FOR SELECT USING (
    reported_by = auth.uid()
    OR EXISTS (SELECT 1 FROM patients p WHERE p.id = incident_reports.patient_id AND p.guardian_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM placements pl WHERE pl.patient_id = incident_reports.patient_id AND pl.agency_id = auth.uid()
    )
    OR is_mod_or_admin()
  );

CREATE POLICY ir_insert ON incident_reports
  FOR INSERT WITH CHECK (reported_by = auth.uid());

CREATE POLICY ir_update ON incident_reports
  FOR UPDATE USING (reported_by = auth.uid() OR is_mod_or_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY notif_select ON notifications
  FOR SELECT USING (receiver_id = auth.uid() OR is_admin());

CREATE POLICY notif_update ON notifications
  FOR UPDATE USING (receiver_id = auth.uid());

CREATE POLICY notif_delete ON notifications
  FOR DELETE USING (receiver_id = auth.uid() OR is_admin());

CREATE POLICY notif_insert ON notifications
  FOR INSERT WITH CHECK (true);  -- System/edge functions insert


-- ═══════════════════════════════════════════════════════════════════════
-- SUPPORT_TICKETS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY st_select ON support_tickets
  FOR SELECT USING (user_id = auth.uid() OR is_mod_or_admin());

CREATE POLICY st_insert ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY st_update ON support_tickets
  FOR UPDATE USING (user_id = auth.uid() OR is_mod_or_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- BLOG_POSTS
-- ═══════════════════════════════════════════════════════════════════════
-- Published posts are public
CREATE POLICY bp_select_public ON blog_posts
  FOR SELECT USING (published = true OR author_id = auth.uid() OR is_admin());

CREATE POLICY bp_manage ON blog_posts
  FOR ALL USING (author_id = auth.uid() OR is_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- CAREGIVER_REVIEWS
-- ═══════════════════════════════════════════════════════════════════════
-- Public read (shown on profiles)
CREATE POLICY cr_select_all ON caregiver_reviews
  FOR SELECT USING (true);

CREATE POLICY cr_insert ON caregiver_reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY cr_update ON caregiver_reviews
  FOR UPDATE USING (reviewer_id = auth.uid() OR is_mod_or_admin());

CREATE POLICY cr_delete ON caregiver_reviews
  FOR DELETE USING (reviewer_id = auth.uid() OR is_mod_or_admin());


-- ═══════════════════════════════════════════════════════════════════════
-- CAREGIVER_DOCUMENTS
-- ═══════════════════════════════════════════════════════════════════════
CREATE POLICY cd_select ON caregiver_documents
  FOR SELECT USING (
    caregiver_id = auth.uid()
    -- Agency that manages this caregiver
    OR EXISTS (
      SELECT 1 FROM caregiver_profiles cp
      WHERE cp.id = caregiver_documents.caregiver_id AND cp.agency_id = auth.uid()
    )
    OR is_mod_or_admin()
  );

CREATE POLICY cd_insert ON caregiver_documents
  FOR INSERT WITH CHECK (caregiver_id = auth.uid());

CREATE POLICY cd_update ON caregiver_documents
  FOR UPDATE USING (
    caregiver_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM caregiver_profiles cp
      WHERE cp.id = caregiver_documents.caregiver_id AND cp.agency_id = auth.uid()
    )
    OR is_mod_or_admin()
  );


-- ═══════════════════════════════════════════════════════════════════════
-- MODERATION TABLES (moderator + admin only)
-- ═══════════════════════════════════════════════════════════════════════

DO $$
BEGIN
-- Only create moderation policies if the tables exist (i.e., 03_moderation_tables.sql was run)
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'moderation_queue') THEN

-- MODERATION_QUEUE
DROP POLICY IF EXISTS mq_select ON moderation_queue;
CREATE POLICY mq_select ON moderation_queue
  FOR SELECT USING (is_mod_or_admin());

DROP POLICY IF EXISTS mq_insert ON moderation_queue;
CREATE POLICY mq_insert ON moderation_queue
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS mq_update ON moderation_queue;
CREATE POLICY mq_update ON moderation_queue
  FOR UPDATE USING (is_mod_or_admin());

-- FLAGGED_CONTENT
DROP POLICY IF EXISTS fc_select ON flagged_content;
CREATE POLICY fc_select ON flagged_content
  FOR SELECT USING (is_mod_or_admin() OR reporter_id = auth.uid());

DROP POLICY IF EXISTS fc_insert ON flagged_content;
CREATE POLICY fc_insert ON flagged_content
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS fc_update ON flagged_content;
CREATE POLICY fc_update ON flagged_content
  FOR UPDATE USING (is_mod_or_admin());

-- MODERATOR_SANCTIONS
DROP POLICY IF EXISTS ms_select ON moderator_sanctions;
CREATE POLICY ms_select ON moderator_sanctions
  FOR SELECT USING (
    user_id = auth.uid()
    OR is_mod_or_admin()
  );

DROP POLICY IF EXISTS ms_insert ON moderator_sanctions;
CREATE POLICY ms_insert ON moderator_sanctions
  FOR INSERT WITH CHECK (is_mod_or_admin());

DROP POLICY IF EXISTS ms_update ON moderator_sanctions;
CREATE POLICY ms_update ON moderator_sanctions
  FOR UPDATE USING (is_mod_or_admin());

-- MODERATOR_ESCALATIONS
DROP POLICY IF EXISTS me_select ON moderator_escalations;
CREATE POLICY me_select ON moderator_escalations
  FOR SELECT USING (is_mod_or_admin());

DROP POLICY IF EXISTS me_insert ON moderator_escalations;
CREATE POLICY me_insert ON moderator_escalations
  FOR INSERT WITH CHECK (is_mod_or_admin());

DROP POLICY IF EXISTS me_update ON moderator_escalations;
CREATE POLICY me_update ON moderator_escalations
  FOR UPDATE USING (is_mod_or_admin());

-- CONTRACT_DISPUTES
DROP POLICY IF EXISTS cd_disp_select ON contract_disputes;
CREATE POLICY cd_disp_select ON contract_disputes
  FOR SELECT USING (
    filed_by = auth.uid()
    OR against_party_id = auth.uid()
    OR assigned_mediator = auth.uid()
    OR is_mod_or_admin()
  );

DROP POLICY IF EXISTS cd_disp_insert ON contract_disputes;
CREATE POLICY cd_disp_insert ON contract_disputes
  FOR INSERT WITH CHECK (filed_by = auth.uid());

DROP POLICY IF EXISTS cd_disp_update ON contract_disputes;
CREATE POLICY cd_disp_update ON contract_disputes
  FOR UPDATE USING (
    assigned_mediator = auth.uid()
    OR is_mod_or_admin()
  );

-- DISPUTE_MESSAGES
DROP POLICY IF EXISTS dm_select ON dispute_messages;
CREATE POLICY dm_select ON dispute_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contract_disputes d
      WHERE d.id = dispute_messages.dispute_id
        AND (d.filed_by = auth.uid() OR d.against_party_id = auth.uid()
             OR d.assigned_mediator = auth.uid())
    )
    OR is_mod_or_admin()
  );

DROP POLICY IF EXISTS dm_insert ON dispute_messages;
CREATE POLICY dm_insert ON dispute_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid() OR is_mod_or_admin());

ELSE
  RAISE NOTICE 'Moderation tables not found — skipping moderation RLS policies. Run 03_moderation_tables.sql first.';
END IF;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════
-- GRANT USAGE ON VIEWS (views inherit table RLS)
-- Service role bypasses RLS; anon role gets nothing.
-- ═══════════════════════════════════════════════════════════════════════

-- Revoke anon access (defense in depth)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
-- Re-grant for public-facing reads that need anon (e.g., blog, products)
GRANT SELECT ON blog_posts TO anon;
GRANT SELECT ON shop_products TO anon;
GRANT SELECT ON agencies TO anon;
GRANT SELECT ON caregiver_profiles TO anon;
GRANT SELECT ON caregiver_reviews TO anon;
GRANT SELECT ON jobs TO anon;

-- Grant authenticated users basic access
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════
-- DONE! Verify RLS is enabled:
--   SELECT tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public'
--   ORDER BY tablename;
--
-- Test as specific user:
--   SET LOCAL role TO authenticated;
--   SET LOCAL request.jwt.claims TO '{"sub":"00000000-0000-0000-0000-000000000002"}';
--   SELECT * FROM patients;  -- Should only see guardian's patients
-- ═══════════════════════════════════════════════════════════════════════