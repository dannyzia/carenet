-- ═══════════════════════════════════════════════════════════════════════
-- CareNet Seed: All Domain Data
-- ═══════════════════════════════════════════════════════════════════════
-- Run this AFTER 00_seed_auth_users.sql in Supabase SQL Editor.
-- This replaces all 28 CSV files — CSV import can't handle PostgreSQL
-- array literals or JSON columns reliably.
-- ═══════════════════════════════════════════════════════════════════════

-- ─── 01: Patients ───
INSERT INTO patients (id, guardian_id, name, age, gender, relation, blood_group, dob, location, phone, conditions, status, avatar, color, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Amina Begum', 72, 'Female', 'Mother', 'B+', '1954-03-15', 'Dhanmondi Dhaka', '01912345678', '{diabetes,hypertension}', 'active', NULL, '#E8D5E0', '2024-03-10T00:00:00Z', '2024-03-10T00:00:00Z'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Rafiq Ahmed', 68, 'Male', 'Father', 'O+', '1958-07-22', 'Dhanmondi Dhaka', '01912345679', '{arthritis,heart_disease}', 'active', NULL, '#D5E0E8', '2024-04-01T00:00:00Z', '2024-04-01T00:00:00Z'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'Fatima Khatun', 80, 'Female', 'Mother', 'A+', '1946-11-03', 'Gulshan Dhaka', '01911111111', '{dementia,diabetes,hypertension}', 'active', NULL, '#E0E8D5', '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Noor Jahan', 45, 'Female', 'Wife', 'AB+', '1981-01-20', 'Dhanmondi Dhaka', NULL, '{post_surgery}', 'inactive', NULL, '#D5D5E8', '2024-06-01T00:00:00Z', '2024-09-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 02: Caregiver Profiles ───
INSERT INTO caregiver_profiles (id, name, type, title, bio, rating, reviews, location, experience, rate, verified, specialties, skills, languages, agency_id, image, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Karim Uddin', 'Elderly Care', 'Senior Caregiver', 'Experienced caregiver specializing in elderly and post-surgical care with 5 years of dedicated service in Dhaka.', 4.80, 47, 'Dhaka', '5 years', '800/day', true, '{elderly_care,post_surgery,chronic_care}', '{vital_monitoring,medication_management,physiotherapy_assist,wound_care}', '{Bengali,English,Hindi}', '00000000-0000-0000-0000-000000000004', NULL, '2024-06-15T00:00:00Z', '2024-06-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 03: Guardian Profiles ───
INSERT INTO guardian_profiles (id, name, phone, email, location, relation, bio, emergency_contact, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000002', 'Rashed Hossain', '01812345678', 'rashed@carenet.demo', 'Dhanmondi Dhaka', 'Son', 'Managing care for my elderly parents. Looking for reliable and compassionate caregivers.', 'Fahima Hossain - 01899999999', '2024-03-10T00:00:00Z', '2024-03-10T00:00:00Z'),
('00000000-0000-0000-0000-000000000008', 'Multi-Role Demo', '01011111111', 'multi@carenet.demo', 'Gulshan Dhaka', 'Daughter', 'Demo user with multiple roles for testing.', 'Emergency - 01000000000', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 04: Agencies ───
INSERT INTO agencies (id, name, tagline, rating, reviews, location, service_areas, specialties, caregiver_count, verified, response_time, image, license, established, commission_rate, payout_schedule, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'Trusted care for your loved ones', 4.70, 128, 'Dhaka', '{Dhanmondi,Gulshan,Banani,Uttara,Mirpur}', '{elderly_care,post_surgery,chronic_care,baby_care}', 45, true, 'Under 2 hours', NULL, 'BD-AGN-2024-001', '2020', 25.00, 'monthly', '2024-01-05T00:00:00Z', '2024-01-05T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 05: Placements ───
INSERT INTO placements (id, guardian_id, agency_id, caregiver_id, patient_id, patient_name, agency_name, guardian_name, caregiver_name, care_type, start_date, end_date, duration, schedule, shifts_completed, shifts_total, status, compliance, rating, missed_shifts, created_at, updated_at) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Amina Begum', 'CareFirst Agency', 'Rashed Hossain', 'Karim Uddin', 'elderly_care', '2024-07-01', NULL, '3 months', '8am-5pm daily', 87, 90, 'active', 96.67, 4.80, 3, '2024-07-01T00:00:00Z', '2024-07-01T00:00:00Z'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Fatima Khatun', 'CareFirst Agency', 'Multi-Role Demo', 'Karim Uddin', 'chronic_care', '2024-09-01', NULL, 'Ongoing', '12-hour rotational', 62, 65, 'active', 95.38, 4.50, 3, '2024-09-01T00:00:00Z', '2024-09-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 06: Shifts ───
INSERT INTO shifts (id, caregiver_id, patient_id, placement_id, date, start_time, end_time, status, location, check_in_time, check_out_time, check_in_gps_lat, check_in_gps_lng, check_in_selfie_url, check_out_gps_lat, check_out_gps_lng, check_out_selfie_url, notes, created_at, updated_at) VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-03-18', '08:00', '17:00', 'scheduled', 'Dhanmondi Dhaka', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Morning shift - medication and vitals', '2026-03-17T00:00:00Z', '2026-03-17T00:00:00Z'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-03-17', '08:00', '17:00', 'completed', 'Dhanmondi Dhaka', '2026-03-17T07:58:00Z', '2026-03-17T17:05:00Z', 23.7461, 90.3742, NULL, 23.7461, 90.3742, NULL, 'Routine day. BP stable. Medication given on time.', '2026-03-16T00:00:00Z', '2026-03-17T17:05:00Z'),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-03-16', '08:00', '17:00', 'completed', 'Dhanmondi Dhaka', '2026-03-16T08:02:00Z', '2026-03-16T17:00:00Z', 23.7461, 90.3742, NULL, 23.7461, 90.3742, NULL, 'Patient reported mild dizziness in the morning. Resolved after rest.', '2026-03-15T00:00:00Z', '2026-03-16T17:00:00Z'),
('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '2026-03-18', '20:00', '08:00', 'scheduled', 'Gulshan Dhaka', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Night shift - monitoring and companionship', '2026-03-17T00:00:00Z', '2026-03-17T00:00:00Z'),
('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '2026-03-17', '20:00', '08:00', 'completed', 'Gulshan Dhaka', '2026-03-17T19:55:00Z', '2026-03-18T08:03:00Z', 23.7925, 90.4078, NULL, 23.7925, 90.4078, NULL, 'Peaceful night. Patient slept well.', '2026-03-16T00:00:00Z', '2026-03-18T08:03:00Z'),
('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-03-19', '08:00', '17:00', 'scheduled', 'Dhanmondi Dhaka', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Regular morning shift', '2026-03-17T00:00:00Z', '2026-03-17T00:00:00Z'),
('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-03-15', '08:00', '17:00', 'completed', 'Dhanmondi Dhaka', '2026-03-15T08:00:00Z', '2026-03-15T17:02:00Z', 23.7461, 90.3742, NULL, 23.7461, 90.3742, NULL, 'Accompanied patient to Dr. Rahman appointment. All good.', '2026-03-14T00:00:00Z', '2026-03-15T17:02:00Z'),
('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-03-14', '08:00', '17:00', 'cancelled', 'Dhanmondi Dhaka', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Cancelled - caregiver sick. Backup assigned.', '2026-03-13T00:00:00Z', '2026-03-14T06:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 07: Shift Ratings ───
INSERT INTO shift_ratings (id, shift_id, rated_by, rated_by_role, rating, comment, created_at) VALUES
('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'guardian', 5, 'Excellent care as always. Karim is very attentive and professional.', '2026-03-17T18:00:00Z'),
('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'guardian', 4, 'Good shift. Handled the dizziness situation well.', '2026-03-16T18:00:00Z'),
('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008', 'guardian', 5, 'Patient slept peacefully. Very reliable night care.', '2026-03-18T09:00:00Z'),
('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'guardian', 5, 'Great job managing the doctor visit. Karim explained everything clearly.', '2026-03-15T18:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 08: Jobs ───
INSERT INTO jobs (id, posted_by, title, patient_name, patient_age, patient_gender, location, description, salary, type, budget, budget_breakdown, duration, experience, skills, requirements, care_type, shift_type, agency_name, agency_rating, agency_verified, posted, urgent, applicants, status, created_at, updated_at) VALUES
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Elderly Care - Dhanmondi', 'Amina Begum', 72, 'Female', 'Dhanmondi Dhaka', 'Looking for an experienced caregiver for my elderly mother with diabetes and hypertension. Must be comfortable with medication management and vital monitoring.', '25000/month', 'Full-time', 25000, 'Base: 20000 + Medication bonus: 5000', '3 months', '2+ years', '{vital_monitoring,medication_management,elderly_care}', '{female_preferred,non_smoker,references_required}', 'elderly_care', 'day', NULL, NULL, NULL, '2026-03-01T00:00:00Z', false, 12, 'applications', '2026-03-01T00:00:00Z', '2026-03-01T00:00:00Z'),
('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Night Nurse - Critical Care', 'Rafiq Ahmed', 68, 'Male', 'Dhanmondi Dhaka', 'Agency seeking experienced night nurse for post-cardiac surgery patient. Must have cardiac care experience.', '35000/month', 'Full-time', 35000, 'Base: 30000 + Night premium: 5000', '6 months', '3+ years', '{cardiac_care,vital_monitoring,emergency_response}', '{nursing_certification,night_shift_experience}', 'critical_care', 'night', 'CareFirst Agency', 4.70, true, '2026-03-10T00:00:00Z', true, 5, 'open', '2026-03-10T00:00:00Z', '2026-03-10T00:00:00Z'),
('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'Dementia Care Specialist', 'Fatima Khatun', 80, 'Female', 'Gulshan Dhaka', 'Specialized caregiver needed for elderly patient with dementia. Must have patience and experience with cognitive decline patients.', '30000/month', 'Full-time', 30000, 'Base: 25000 + Specialty: 5000', 'Ongoing', '3+ years', '{dementia_care,elderly_care,companionship}', '{dementia_certification,female_preferred}', 'chronic_care', 'rotational', NULL, NULL, NULL, '2026-02-15T00:00:00Z', false, 8, 'interview', '2026-02-15T00:00:00Z', '2026-02-15T00:00:00Z'),
('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Baby Care Assistant - Uttara', NULL, 0, 'Female', 'Uttara Dhaka', 'Part-time baby care helper for new mother. Light duties including feeding support and basic infant care.', '15000/month', 'Part-time', 15000, NULL, '3 months', '1+ year', '{baby_care,infant_feeding}', '{female_only,clean_background}', 'baby_care', 'day', 'CareFirst Agency', 4.70, true, '2026-03-15T00:00:00Z', false, 3, 'open', '2026-03-15T00:00:00Z', '2026-03-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 09: Job Applications ───
INSERT INTO job_applications (id, job_id, applicant_id, name, rating, experience, specialties, skills, gender, location, match_score, applied_date, last_activity, status, certifications, previous_jobs, completion_rate, created_at) VALUES
('41000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', 4.80, '5 years', '{elderly_care,chronic_care}', '{vital_monitoring,medication_management}', 'Male', 'Dhaka', 92, '2026-03-02T00:00:00Z', '2026-03-05T00:00:00Z', 'interview', '{First_Aid,CNA}', 23, 98.50, '2026-03-02T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 10: Care Contracts ───
INSERT INTO care_contracts (id, owner_id, type, status, title, categories, city, area, address, start_date, duration_type, party_role, party_name, party_phone, subject_age, subject_gender, condition_summary, mobility, cognitive, risk_level, diagnosis, medication_complexity, required_level, gender_preference, experience_years, hours_per_day, shift_type, staff_pattern, location_type, budget_min, budget_max, preferred_pricing_model, base_price, pricing_model, reporting_frequency, background_verified, trial_available, agency_id, agency_name, agency_rating, agency_verified, bid_count, published_at, expires_at, created_at, updated_at) VALUES
('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'request', 'published', 'Elderly Care for Mother - Dhanmondi', '{elderly,chronic}', 'Dhaka', 'Dhanmondi', NULL, '2026-04-01', 'monthly', 'patient', 'Rashed Hossain', '01812345678', 72, 'female', 'Diabetes and hypertension management', 'assisted', 'normal', 'medium', 'Type 2 Diabetes + Hypertension', 'medium', 'L2', 'female', 2, 8, 'day', 'single', 'home', 20000, 30000, 'monthly', NULL, NULL, 'daily', true, true, NULL, NULL, NULL, NULL, 3, '2026-03-10T00:00:00Z', '2026-03-25T00:00:00Z', '2026-03-10T00:00:00Z', '2026-03-10T00:00:00Z'),
('70000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'offer', 'published', 'Premium Elderly Care Package', '{elderly,chronic}', 'Dhaka', NULL, NULL, NULL, 'long_term', 'agency', 'CareFirst Agency', '01612345678', NULL, NULL, 'Comprehensive elderly care with medication management', NULL, NULL, NULL, NULL, NULL, 'L2', NULL, 2, NULL, 'day', 'single', 'home', NULL, NULL, NULL, 25000, 'monthly', 'daily', true, true, '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 4.70, true, 0, '2026-03-05T00:00:00Z', '2026-03-20T00:00:00Z', '2026-03-05T00:00:00Z', '2026-03-05T00:00:00Z'),
('70000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'request', 'bidding', 'Night Care for Dementia Patient', '{elderly,critical}', 'Dhaka', 'Gulshan', NULL, '2026-04-15', 'long_term', 'patient', 'Multi-Role Demo', '01011111111', 80, 'female', 'Advanced dementia requiring continuous supervision', 'bedridden', 'impaired', 'high', 'Alzheimers Stage 5', 'high', 'L3', 'female', 3, 12, 'night', 'double', 'home', 35000, 50000, 'monthly', NULL, NULL, 'daily', true, false, NULL, NULL, NULL, NULL, 2, '2026-03-12T00:00:00Z', '2026-03-27T00:00:00Z', '2026-03-12T00:00:00Z', '2026-03-12T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 11: Care Contract Bids ───
INSERT INTO care_contract_bids (id, contract_id, agency_id, agency_name, agency_rating, agency_verified, proposed_pricing, proposed_staffing, proposed_schedule, proposed_services, proposed_sla, compliance, status, message, remarks, counter_offer, created_at, expires_at) VALUES
('71000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 4.70, true,
  '{"base_price": 42000, "pricing_model": "monthly", "included_hours": 360, "overtime_rate": 250}'::jsonb,
  '{"required_level": "L3", "caregiver_count": 2, "gender_preference": "female", "experience_years": 4}'::jsonb,
  '{"hours_per_day": 12, "shift_type": "night", "staff_pattern": "double"}'::jsonb,
  '{"personal_care": ["bathing", "feeding", "toileting"], "medical_support": ["vital_monitoring", "medication"], "advanced_care": ["dementia_protocols"]}'::jsonb,
  '{"replacement_time_hours": 4, "emergency_response_minutes": 15, "attendance_guarantee_percent": 95, "reporting_frequency": "daily"}'::jsonb,
  '{"overall_score": 88, "met_count": 12, "partial_count": 2, "unmet_count": 1, "total_count": 15}'::jsonb,
  'pending', 'We have extensive experience with dementia patients. Our team includes two L3-certified caregivers who specialize in Alzheimer''s care.',
  'Budget slightly above requested range but includes premium dementia care protocols and 24/7 emergency hotline.', NULL,
  '2026-03-14T00:00:00Z', '2026-03-28T00:00:00Z'),
('71000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 4.70, true,
  '{"base_price": 38000, "pricing_model": "monthly", "included_hours": 360, "overtime_rate": 200}'::jsonb,
  '{"required_level": "L2", "caregiver_count": 2, "gender_preference": "female", "experience_years": 3}'::jsonb,
  '{"hours_per_day": 12, "shift_type": "night", "staff_pattern": "double"}'::jsonb,
  '{}'::jsonb,
  '{"replacement_time_hours": 6, "emergency_response_minutes": 30, "attendance_guarantee_percent": 90, "reporting_frequency": "daily"}'::jsonb,
  '{"overall_score": 72, "met_count": 9, "partial_count": 4, "unmet_count": 2, "total_count": 15}'::jsonb,
  'countered', 'Budget-friendly option with experienced L2 caregivers.',
  'L2 staff instead of L3 to keep costs within budget. Can upgrade if needed.',
  '{"from": "patient", "message": "Can you provide L3 staff at this price?", "created_at": "2026-03-16T00:00:00Z"}'::jsonb,
  '2026-03-15T00:00:00Z', '2026-03-29T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 12: Conversations ───
INSERT INTO conversations (id, participant_a, participant_b, last_message, last_time, pinned_by_a, pinned_by_b, created_at, updated_at) VALUES
('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Amina''s BP was 130/85 today - stable', '2026-03-17T17:30:00Z', true, false, '2024-07-01T00:00:00Z', '2026-03-17T17:30:00Z'),
('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Invoice for March has been sent', '2026-03-15T10:00:00Z', false, false, '2024-07-01T00:00:00Z', '2026-03-15T10:00:00Z'),
('80000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Shift schedule confirmed for next week', '2026-03-16T14:00:00Z', false, true, '2024-06-15T00:00:00Z', '2026-03-16T14:00:00Z'),
('80000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'How is Fatima doing tonight?', '2026-03-17T21:00:00Z', false, false, '2024-09-01T00:00:00Z', '2026-03-17T21:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 13: Chat Messages ───
INSERT INTO chat_messages (id, conversation_id, sender_id, sender_name, text, read, attachment_type, attachment_url, attachment_name, created_at) VALUES
('81000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', 'Good morning! Starting my shift now. Amina is in good spirits today.', true, NULL, NULL, NULL, '2026-03-17T08:05:00Z'),
('81000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Rashed Hossain', 'Great to hear. Please make sure she takes her morning medication with food.', true, NULL, NULL, NULL, '2026-03-17T08:10:00Z'),
('81000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', 'Of course. I gave her Metformin with breakfast at 8:30am. All good.', true, NULL, NULL, NULL, '2026-03-17T08:35:00Z'),
('81000000-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', 'Amina''s BP was 130/85 today - stable', true, NULL, NULL, NULL, '2026-03-17T17:30:00Z'),
('81000000-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'Hi Rashed. The March invoice is ready for your review.', true, NULL, NULL, NULL, '2026-03-15T09:45:00Z'),
('81000000-0000-0000-0000-000000000006', '80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Rashed Hossain', 'Thank you. I''ll review and send payment proof by end of day.', true, NULL, NULL, NULL, '2026-03-15T09:50:00Z'),
('81000000-0000-0000-0000-000000000007', '80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'Invoice for March has been sent', false, NULL, NULL, NULL, '2026-03-15T10:00:00Z'),
('81000000-0000-0000-0000-000000000008', '80000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008', 'Multi-Role Demo', 'How is Fatima doing tonight?', false, NULL, NULL, NULL, '2026-03-17T21:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 14: Care Notes ───
INSERT INTO care_notes (id, caregiver_id, patient_id, patient_name, date, time, category, title, content, mood, pinned, tags, attachments, created_at) VALUES
('C0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '2026-03-17', '08:30', 'medication', 'Morning Medication Given', 'Administered Metformin 500mg with breakfast. Patient took it without issue. Also gave Amlodipine 5mg for BP.', 'happy', false, '{medication,morning_routine}', 0, '2026-03-17T08:30:00Z'),
('C0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '2026-03-17', '10:00', 'vitals', 'Mid-Morning Vitals Check', 'BP: 130/85, Pulse: 72, Glucose: 145mg/dL (post-breakfast). All within acceptable range.', 'calm', true, '{vitals,routine_check}', 0, '2026-03-17T10:00:00Z'),
('C0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '2026-03-17', '14:00', 'activity', 'Afternoon Walk', 'Took patient for 20-minute walk in the garden. She enjoyed the fresh air and was in good spirits. No fatigue reported.', 'happy', false, '{exercise,outdoor}', 0, '2026-03-17T14:00:00Z'),
('C0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Fatima Khatun', '2026-03-17', '21:30', 'observation', 'Evening Observation', 'Patient settled for the night. Showed some mild confusion about the day of the week but calmed down after gentle reassurance. Sleep medication given as prescribed.', 'confused', false, '{dementia,evening_routine,sleep}', 0, '2026-03-17T21:30:00Z'),
('C0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '2026-03-16', '09:00', 'incident', 'Mild Dizziness Episode', 'Patient reported dizziness upon standing. Checked BP immediately - 110/70 (slightly low). Had her sit down and hydrate. BP returned to 125/80 within 30 minutes. Notified guardian.', 'concerned', true, '{incident,bp,dizziness}', 0, '2026-03-16T09:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 15: Invoices ───
INSERT INTO invoices (id, from_party_id, from_party_name, from_party_role, to_party_id, to_party_name, to_party_role, placement_id, type, description, period_from, period_to, subtotal, platform_fee, platform_fee_rate, vat, vat_rate, early_discount, total, status, issued_date, due_date, paid_date, paid_via, created_at, updated_at) VALUES
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'agency', '00000000-0000-0000-0000-000000000002', 'Rashed Hossain', 'guardian', '20000000-0000-0000-0000-000000000001', 'service', 'Elderly care services for Amina Begum - March 2026', '2026-03-01', '2026-03-31', 25000, 625, 2.50, 0, 0.00, 0, 25625, 'unpaid', '2026-03-01', '2026-03-15', NULL, NULL, '2026-03-01T00:00:00Z', '2026-03-01T00:00:00Z'),
('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'agency', '00000000-0000-0000-0000-000000000002', 'Rashed Hossain', 'guardian', '20000000-0000-0000-0000-000000000001', 'service', 'Elderly care services for Amina Begum - February 2026', '2026-02-01', '2026-02-28', 25000, 625, 2.50, 0, 0.00, 500, 25125, 'paid', '2026-02-01', '2026-02-15', '2026-02-10', 'bkash', '2026-02-01T00:00:00Z', '2026-02-10T00:00:00Z'),
('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'agency', '00000000-0000-0000-0000-000000000008', 'Multi-Role Demo', 'guardian', '20000000-0000-0000-0000-000000000002', 'service', 'Chronic care services for Fatima Khatun - March 2026', '2026-03-01', '2026-03-31', 35000, 875, 2.50, 0, 0.00, 0, 35875, 'proof_submitted', '2026-03-01', '2026-03-15', NULL, NULL, '2026-03-01T00:00:00Z', '2026-03-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 16: Invoice Line Items ───
INSERT INTO invoice_line_items (id, invoice_id, description, qty, rate, total) VALUES
('61000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'Day shift care (8hrs) x 26 days', 26, 800, 20800),
('61000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', 'Medication management fee', 1, 2200, 2200),
('61000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', 'Vitals monitoring equipment', 1, 2000, 2000),
('61000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000002', 'Day shift care (8hrs) x 24 days', 24, 800, 19200),
('61000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000002', 'Medication management fee', 1, 2200, 2200),
('61000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000002', 'Vitals monitoring equipment', 1, 2000, 2000),
('61000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000002', 'Weekend premium (4 weekends)', 4, 400, 1600),
('61000000-0000-0000-0000-000000000008', '60000000-0000-0000-0000-000000000003', 'Night shift care (12hrs) x 30 days', 30, 1000, 30000),
('61000000-0000-0000-0000-000000000009', '60000000-0000-0000-0000-000000000003', 'Dementia care specialist fee', 1, 3000, 3000),
('61000000-0000-0000-0000-000000000010', '60000000-0000-0000-0000-000000000003', 'Emergency response readiness', 1, 2000, 2000)
ON CONFLICT (id) DO NOTHING;

-- ─── 17: Payment Proofs ───
INSERT INTO payment_proofs (id, invoice_id, submitted_by_id, submitted_by_name, submitted_by_role, received_by_id, received_by_name, received_by_role, amount, method, reference_number, screenshot_url, notes, status, submitted_at, verified_at, verified_by_name, rejection_reason) VALUES
('62000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Rashed Hossain', 'guardian', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'agency', 25125, 'bkash', 'TXN2026021012345', NULL, 'Paid via bKash. February invoice for Amina''s care.', 'verified', '2026-02-10T09:30:00Z', '2026-02-10T14:00:00Z', 'CareFirst Agency', NULL),
('62000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'Multi-Role Demo', 'guardian', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'agency', 35875, 'nagad', 'NGD2026031567890', NULL, 'March payment for Fatima''s night care.', 'pending', '2026-03-14T11:00:00Z', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ─── 18: Shop Products ───
INSERT INTO shop_products (id, merchant_id, name, category, description, price, old_price, stock, sales, rating, reviews, image, in_stock, sku, threshold, created_at, updated_at) VALUES
('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'Digital Blood Pressure Monitor', 'Medical Devices', 'Automatic upper arm blood pressure monitor with large LCD display. Memory for 120 readings.', 2500, NULL, 45, 312, 4.60, 89, NULL, true, 'MED-BP-001', 10, '2024-04-15T00:00:00Z', '2024-04-15T00:00:00Z'),
('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', 'Pulse Oximeter', 'Medical Devices', 'Fingertip pulse oximeter with OLED display. Measures SpO2 and pulse rate.', 1200, 1500, 80, 245, 4.50, 67, NULL, true, 'MED-PO-001', 15, '2024-04-15T00:00:00Z', '2024-04-15T00:00:00Z'),
('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'Glucometer Kit', 'Medical Devices', 'Blood glucose monitoring system with 50 test strips and lancets included.', 1800, NULL, 30, 198, 4.40, 54, NULL, true, 'MED-GL-001', 10, '2024-04-15T00:00:00Z', '2024-04-15T00:00:00Z'),
('50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', 'Adult Diapers (Pack of 30)', 'Daily Care', 'Premium adult diapers with super absorbent core. Size M/L.', 850, 950, 120, 567, 4.30, 123, NULL, true, 'DC-AD-001', 20, '2024-04-15T00:00:00Z', '2024-04-15T00:00:00Z'),
('50000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007', 'Wheelchair - Standard', 'Mobility Aids', 'Foldable standard wheelchair with padded armrests. Weight capacity 120kg.', 12000, 14000, 8, 34, 4.70, 21, NULL, true, 'MOB-WC-001', 3, '2024-04-15T00:00:00Z', '2024-04-15T00:00:00Z'),
('50000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000007', 'Walking Stick - Adjustable', 'Mobility Aids', 'Height-adjustable aluminum walking stick with ergonomic handle.', 450, NULL, 55, 189, 4.20, 45, NULL, true, 'MOB-WS-001', 10, '2024-04-15T00:00:00Z', '2024-04-15T00:00:00Z'),
('50000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 'First Aid Kit - Comprehensive', 'Medical Supplies', 'Complete first aid kit with 150+ items. Includes bandages antiseptic and emergency supplies.', 1500, NULL, 35, 156, 4.50, 38, NULL, true, 'MS-FA-001', 8, '2024-04-15T00:00:00Z', '2024-04-15T00:00:00Z'),
('50000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000007', 'Bed Pan - Stainless Steel', 'Daily Care', 'Hospital-grade stainless steel bed pan. Easy to clean and sterilize.', 350, NULL, 40, 89, 4.10, 19, NULL, true, 'DC-BP-001', 10, '2024-04-15T00:00:00Z', '2024-04-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 19: Shop Orders ───
INSERT INTO shop_orders (id, customer_id, customer_name, merchant_id, items_count, total, status, payment_method, payment_status, tracking, courier, created_at, updated_at) VALUES
('51000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Rashed Hossain', '00000000-0000-0000-0000-000000000007', 3, 4550, 'delivered', 'bkash', 'completed', 'BD-TRK-20260301', 'Pathao Courier', '2026-03-01T00:00:00Z', '2026-03-04T00:00:00Z'),
('51000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Rashed Hossain', '00000000-0000-0000-0000-000000000007', 1, 850, 'shipped', 'nagad', 'completed', 'BD-TRK-20260315', 'Sundorban Courier', '2026-03-15T00:00:00Z', '2026-03-16T00:00:00Z'),
('51000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'Multi-Role Demo', '00000000-0000-0000-0000-000000000007', 2, 13500, 'confirmed', 'bkash', 'completed', NULL, NULL, '2026-03-17T00:00:00Z', '2026-03-17T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 20: Daily Tasks ───
INSERT INTO daily_tasks (id, type, title, details, time, date, patient_id, patient_name, caregiver_id, caregiver_name, guardian_id, agency_id, status, completed_at, completion_note, completion_photo_url, created_by, created_by_role, created_at) VALUES
('D0000000-0000-0000-0000-000000000001', 'task', 'Morning Medication - Amina', 'Administer Metformin 500mg and Amlodipine 5mg with breakfast', '08:30', '2026-03-18', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', '00000000-0000-0000-0000-000000000002', NULL, 'pending', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000004', 'agency', '2026-03-17T00:00:00Z'),
('D0000000-0000-0000-0000-000000000002', 'task', 'Check Vitals - Amina', 'Record BP glucose and pulse. Report if BP > 140/90', '10:00', '2026-03-18', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', '00000000-0000-0000-0000-000000000002', NULL, 'pending', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000004', 'agency', '2026-03-17T00:00:00Z'),
('D0000000-0000-0000-0000-000000000003', 'task', 'Afternoon Walk', 'Take patient for 20-minute garden walk if weather permits', '14:00', '2026-03-18', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', '00000000-0000-0000-0000-000000000002', NULL, 'pending', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000002', 'guardian', '2026-03-17T00:00:00Z'),
('D0000000-0000-0000-0000-000000000004', 'event', 'Dr. Rahman Checkup', 'Monthly checkup at United Hospital. Bring previous vitals report.', '11:00', '2026-03-20', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', '00000000-0000-0000-0000-000000000002', NULL, 'pending', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000002', 'guardian', '2026-03-17T00:00:00Z'),
('D0000000-0000-0000-0000-000000000005', 'task', 'Evening Medication - Fatima', 'Administer Donepezil 10mg and Amlodipine 5mg before dinner', '18:00', '2026-03-18', '10000000-0000-0000-0000-000000000003', 'Fatima Khatun', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', '00000000-0000-0000-0000-000000000008', NULL, 'pending', NULL, NULL, NULL, '00000000-0000-0000-0000-000000000004', 'agency', '2026-03-17T00:00:00Z'),
('D0000000-0000-0000-0000-000000000006', 'task', 'Morning Medication - Amina (yesterday)', 'Metformin 500mg and Amlodipine 5mg with breakfast', '08:30', '2026-03-17', '10000000-0000-0000-0000-000000000001', 'Amina Begum', '00000000-0000-0000-0000-000000000001', 'Karim Uddin', '00000000-0000-0000-0000-000000000002', NULL, 'completed', '2026-03-17T08:35:00Z', 'Given with rice and dal breakfast.', NULL, '00000000-0000-0000-0000-000000000004', 'agency', '2026-03-16T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 21: Prescriptions ───
INSERT INTO prescriptions (id, patient_id, patient_name, medicine_name, dosage, frequency, timing, duration, prescribed_by, start_date, end_date, instructions, status, refill_date, created_at) VALUES
('E0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Amina Begum', 'Metformin', '500mg', 'Twice daily', '{morning,evening}', 'Ongoing', 'Dr. Rahman', '2024-06-01', NULL, 'Take with food. Monitor blood glucose before meals.', 'active', '2026-04-01', '2024-06-01T00:00:00Z'),
('E0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Amina Begum', 'Amlodipine', '5mg', 'Once daily', '{morning}', 'Ongoing', 'Dr. Rahman', '2024-06-01', NULL, 'Take at the same time each day. Report dizziness immediately.', 'active', '2026-04-01', '2024-06-01T00:00:00Z'),
('E0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Amina Begum', 'Aspirin', '75mg', 'Once daily', '{morning}', 'Ongoing', 'Dr. Rahman', '2024-08-15', NULL, 'Take after food. Stop if unusual bleeding occurs.', 'active', NULL, '2024-08-15T00:00:00Z'),
('E0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Rafiq Ahmed', 'Atorvastatin', '20mg', 'Once daily', '{night}', 'Ongoing', 'Dr. Chowdhury', '2024-04-01', NULL, 'Take at bedtime. Avoid grapefruit.', 'active', '2026-04-15', '2024-04-01T00:00:00Z'),
('E0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Rafiq Ahmed', 'Losartan', '50mg', 'Once daily', '{morning}', 'Ongoing', 'Dr. Chowdhury', '2024-04-01', NULL, 'Monitor BP weekly. Report persistent cough.', 'active', NULL, '2024-04-01T00:00:00Z'),
('E0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'Fatima Khatun', 'Donepezil', '10mg', 'Once daily', '{evening}', 'Ongoing', 'Dr. Haque', '2024-01-15', NULL, 'For dementia management. Give before dinner. Watch for nausea.', 'active', '2026-04-15', '2024-01-15T00:00:00Z'),
('E0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 'Fatima Khatun', 'Amlodipine', '5mg', 'Once daily', '{morning}', 'Ongoing', 'Dr. Haque', '2024-01-15', NULL, 'Blood pressure management.', 'active', NULL, '2024-01-15T00:00:00Z'),
('E0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004', 'Noor Jahan', 'Paracetamol', '500mg', 'As needed', '{morning,afternoon,evening}', '2 weeks', 'Dr. Islam', '2024-06-01', '2024-06-15', 'Post-surgery pain management. Max 4 tablets per day.', 'completed', NULL, '2024-06-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 22: Patient Vitals ───
INSERT INTO patient_vitals (id, patient_id, recorded_by, bp, glucose, pulse, weight, temperature, heart_rate, recorded_at) VALUES
('F0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '130/85', '145', '72', '65kg', '98.2F', '72', '2026-03-17T10:00:00Z'),
('F0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '110/70', '138', '68', '65kg', '98.4F', '68', '2026-03-16T09:00:00Z'),
('F0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '125/80', '142', '70', '65kg', '98.1F', '70', '2026-03-16T14:00:00Z'),
('F0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '128/82', '135', '71', '65kg', '98.3F', '71', '2026-03-15T10:00:00Z'),
('F0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '132/86', '148', '74', '65kg', '98.5F', '74', '2026-03-14T10:00:00Z'),
('F0000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '126/84', '140', '70', '65kg', '98.2F', '70', '2026-03-13T10:00:00Z'),
('F0000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '140/90', '155', '78', '58kg', '98.6F', '78', '2026-03-17T21:00:00Z'),
('F0000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '138/88', '150', '76', '58kg', '98.4F', '76', '2026-03-16T21:00:00Z'),
('F0000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '135/88', '120', '80', '75kg', '98.3F', '80', '2026-03-17T10:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 23: Incident Reports ───
INSERT INTO incident_reports (id, reported_by, reporter_role, type, severity, patient_id, shift_id, description, immediate_action, photos, gps_lat, gps_lng, status, escalated_to, created_at, updated_at) VALUES
('B0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'caregiver', 'fall', 'medium', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'Patient experienced mild dizziness and nearly lost balance while getting up from bed. Caught her before any fall occurred.', 'Assisted patient to sit down immediately. Checked vitals - BP was low at 110/70. Hydrated with water and electrolytes. BP normalized within 30 minutes. Notified guardian.', '{}', 23.7461, 90.3742, 'resolved', NULL, '2026-03-16T09:15:00Z', '2026-03-16T14:00:00Z'),
('B0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'caregiver', 'medication_error', 'low', '10000000-0000-0000-0000-000000000003', NULL, 'Evening medication was given 30 minutes late due to patient refusing food initially. Donepezil should be given with dinner.', 'Waited patiently. Offered alternative lighter meal. Patient agreed to eat soup. Medication given at 18:30 instead of 18:00.', '{}', 23.7925, 90.4078, 'closed', NULL, '2026-03-10T19:00:00Z', '2026-03-11T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 24: Notifications ───
INSERT INTO notifications (id, type, channel, title_en, title_bn, message_en, message_bn, sender_id, receiver_id, action_url, metadata, read, created_at) VALUES
('A1000000-0000-0000-0000-000000000001', 'shift_reminder', 'shift-reminders', 'Shift Starting Soon', 'শিফট শীঘ্রই শুরু হচ্ছে', 'Your shift at Dhanmondi for Amina Begum starts in 30 minutes.', 'ধানমন্ডিতে আমিনা বেগমের জন্য আপনার শিফট ৩০ মিনিটের মধ্যে শুরু হচ্ছে।', NULL, '00000000-0000-0000-0000-000000000001', '/caregiver/shifts', '{}'::jsonb, false, '2026-03-18T07:30:00Z'),
('A1000000-0000-0000-0000-000000000002', 'billing_invoice_issued', 'billing', 'New Invoice', 'নতুন চালান', 'CareFirst Agency has issued invoice for March 2026 - BDT 25625.', 'কেয়ারফার্স্ট এজেন্সি মার্চ ২০২৬ এর চালান পাঠিয়েছে - ২৫৬২৫ টাকা।', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '/guardian/payments', '{}'::jsonb, false, '2026-03-01T10:00:00Z'),
('A1000000-0000-0000-0000-000000000003', 'billing_proof_submitted', 'billing', 'Payment Proof Received', 'পেমেন্ট প্রমাণ পাওয়া গেছে', 'Multi-Role Demo has submitted payment proof for Invoice #60000000-3 via Nagad.', 'মাল্টি-রোল ডেমো নাগাদের মাধ্যমে চালান #৬০০০০০০০-৩ এর পেমেন্ট প্রমাণ জমা দিয়েছে।', '00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', '/agency/billing', '{}'::jsonb, false, '2026-03-14T11:05:00Z'),
('A1000000-0000-0000-0000-000000000004', 'care_update', 'care-updates', 'Vitals Update', 'ভাইটাল আপডেট', 'Amina Begum''s vitals recorded: BP 130/85, Glucose 145, Pulse 72. All stable.', 'আমিনা বেগমের ভাইটাল রেকর্ড করা হয়েছে: বিপি ১৩০/৮৫। সব স্থিতিশীল।', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '/guardian/patients/10000000-0000-0000-0000-000000000001', '{}'::jsonb, true, '2026-03-17T10:05:00Z'),
('A1000000-0000-0000-0000-000000000005', 'new_message', 'messages', 'New Message from Karim', 'করিমের নতুন বার্তা', 'Karim Uddin sent you a message about Amina''s care.', 'করিম উদ্দিন আমিনার যত্ন সম্পর্কে একটি বার্তা পাঠিয়েছে।', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '/guardian/messages', '{}'::jsonb, true, '2026-03-17T17:31:00Z'),
('A1000000-0000-0000-0000-000000000006', 'new_bid', 'platform', 'New Bid Received', 'নতুন বিড পাওয়া গেছে', 'CareFirst Agency has placed a bid on your care request for Night Care for Dementia Patient.', 'কেয়ারফার্স্ট এজেন্সি আপনার ডিমেনশিয়া রোগীর নাইট কেয়ার অনুরোধে বিড দিয়েছে।', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008', '/guardian/marketplace', '{}'::jsonb, false, '2026-03-14T00:05:00Z'),
('A1000000-0000-0000-0000-000000000007', 'shift_completed', 'shift-reminders', 'Shift Completed', 'শিফট সম্পন্ন', 'Karim Uddin has completed the shift for Amina Begum. Please rate the service.', 'করিম উদ্দিন আমিনা বেগমের শিফট সম্পন্ন করেছে। অনুগ্রহ করে সেবার রেটিং দিন।', NULL, '00000000-0000-0000-0000-000000000002', '/guardian/placements/20000000-0000-0000-0000-000000000001', '{}'::jsonb, false, '2026-03-17T17:10:00Z'),
('A1000000-0000-0000-0000-000000000008', 'incident_report', 'care-safety', 'Incident Report Filed', 'ঘটনা রিপোর্ট দাখিল', 'A mild dizziness incident has been reported for Amina Begum. No injury. Vitals normalized.', 'আমিনা বেগমের মৃদু মাথা ঘোরার ঘটনা রিপোর্ট করা হয়েছে। কোন আঘাত নেই।', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '/guardian/patients/10000000-0000-0000-0000-000000000001', '{}'::jsonb, true, '2026-03-16T09:20:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 25: Support Tickets ───
INSERT INTO support_tickets (id, user_id, subject, category, priority, status, created_at, updated_at) VALUES
('90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Invoice amount seems incorrect for February', 'billing', 'medium', 'resolved', '2026-02-12T00:00:00Z', '2026-02-14T00:00:00Z'),
('90000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Unable to upload NID document', 'documents', 'high', 'open', '2026-03-16T00:00:00Z', '2026-03-16T00:00:00Z'),
('90000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'Product listing not showing image', 'shop', 'low', 'in_progress', '2026-03-15T00:00:00Z', '2026-03-17T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 26: Blog Posts ───
INSERT INTO blog_posts (id, author_id, title, excerpt, content, author_name, category, image, published, created_at, updated_at) VALUES
('A0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'How to Choose the Right Caregiver for Your Elderly Parent', 'Selecting a caregiver is one of the most important decisions you''ll make for your family. Here''s a comprehensive guide.', NULL, 'Admin User', 'Guides', NULL, true, '2026-02-01T00:00:00Z', '2026-02-01T00:00:00Z'),
('A0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'Understanding Dementia Care in Bangladesh', 'Dementia affects thousands of elderly Bangladeshis. Learn about the signs symptoms and care options available.', NULL, 'Admin User', 'Health', NULL, true, '2026-02-15T00:00:00Z', '2026-02-15T00:00:00Z'),
('A0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'CareNet Caregiver Spotlight: Karim Uddin', 'Meet Karim Uddin a top-rated caregiver from Dhaka with 5 years of experience in elderly care.', NULL, 'Admin User', 'Community', NULL, true, '2026-03-01T00:00:00Z', '2026-03-01T00:00:00Z'),
('A0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'New Feature: GPS-Verified Shift Check-In', 'We''re excited to announce GPS-verified check-in for all caregiver shifts. Enhanced accountability and peace of mind.', NULL, 'Admin User', 'Product Updates', NULL, true, '2026-03-10T00:00:00Z', '2026-03-10T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 27: Caregiver Reviews ───
INSERT INTO caregiver_reviews (id, caregiver_id, reviewer_id, reviewer_name, reviewer_role, rating, text, created_at) VALUES
('CA000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Rashed Hossain', 'guardian', 5, 'Karim has been caring for my mother for months now. He is punctual professional and genuinely caring. My mother loves him. Highly recommended!', '2026-03-01T00:00:00Z'),
('CA000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', 'Multi-Role Demo', 'guardian', 5, 'Excellent night care for my mother with dementia. Karim is patient and handles her confusion episodes very well.', '2026-02-15T00:00:00Z'),
('CA000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'CareFirst Agency', 'agency', 4, 'Karim is one of our best caregivers. Reliable consistent and clients always praise his work.', '2026-01-20T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ─── 28: Caregiver Documents ───
INSERT INTO caregiver_documents (id, caregiver_id, name, type, category, status, uploaded, expiry, file_url, file_size, thumbnail_url, capture_method, review_note, reviewed_by, reviewed_at, created_at) VALUES
('CB000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'National ID Card (Front)', 'identification', 'nid', 'approved', '2024-06-15T00:00:00Z', NULL, NULL, NULL, NULL, NULL, 'Verified against government database.', '00000000-0000-0000-0000-000000000004', '2024-06-16T00:00:00Z', '2024-06-15T00:00:00Z'),
('CB000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'National ID Card (Back)', 'identification', 'nid', 'approved', '2024-06-15T00:00:00Z', NULL, NULL, NULL, NULL, NULL, 'Verified.', '00000000-0000-0000-0000-000000000004', '2024-06-16T00:00:00Z', '2024-06-15T00:00:00Z'),
('CB000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'First Aid Certification', 'certification', 'training', 'approved', '2024-06-15T00:00:00Z', '2027-06-15', NULL, NULL, NULL, NULL, 'Valid certification from Red Crescent Society.', '00000000-0000-0000-0000-000000000004', '2024-06-16T00:00:00Z', '2024-06-15T00:00:00Z'),
('CB000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'CNA Certificate', 'certification', 'education', 'approved', '2024-06-15T00:00:00Z', NULL, NULL, NULL, NULL, NULL, 'Certified Nursing Assistant - Dhaka Nursing Institute.', '00000000-0000-0000-0000-000000000004', '2024-06-16T00:00:00Z', '2024-06-15T00:00:00Z'),
('CB000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Police Verification Certificate', 'clearance', 'police_verification', 'approved', '2024-06-15T00:00:00Z', '2026-06-15', NULL, NULL, NULL, NULL, 'Clean record confirmed.', '00000000-0000-0000-0000-000000000005', '2024-06-17T00:00:00Z', '2024-06-15T00:00:00Z'),
('CB000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Profile Selfie', 'photo', 'profile_selfie', 'approved', '2024-06-15T00:00:00Z', NULL, NULL, NULL, NULL, NULL, 'Photo matches NID.', '00000000-0000-0000-0000-000000000004', '2024-06-16T00:00:00Z', '2024-06-15T00:00:00Z'),
('CB000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Medical Fitness Certificate', 'medical', 'medical_license', 'pending', '2026-03-16T00:00:00Z', '2027-03-16', NULL, '2.1MB', NULL, 'file', NULL, NULL, NULL, '2026-03-16T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- DONE! Verify row counts:
--   SELECT 'patients' as t, count(*) FROM patients
--   UNION ALL SELECT 'caregiver_profiles', count(*) FROM caregiver_profiles
--   UNION ALL SELECT 'guardian_profiles', count(*) FROM guardian_profiles
--   UNION ALL SELECT 'agencies', count(*) FROM agencies
--   UNION ALL SELECT 'placements', count(*) FROM placements
--   UNION ALL SELECT 'shifts', count(*) FROM shifts
--   UNION ALL SELECT 'jobs', count(*) FROM jobs
--   UNION ALL SELECT 'care_contracts', count(*) FROM care_contracts
--   UNION ALL SELECT 'invoices', count(*) FROM invoices
--   UNION ALL SELECT 'shop_products', count(*) FROM shop_products
--   UNION ALL SELECT 'notifications', count(*) FROM notifications;
-- ═══════════════════════════════════════════════════════════════════════
