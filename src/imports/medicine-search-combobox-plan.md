# Medicine Search Combobox — Implementation Plan
### CareNet 2 · `CaregiverMedSchedulePage` · Medicine Field Upgrade

---

## 1. Problem

The **"Medicine"** text input in the caregiver medication schedule setup form
(`src/frontend/pages/caregiver/CaregiverMedSchedulePage.tsx`) is a plain free-text field
with no validation, no suggestions, and no generic name capture.

**Goal:** Replace the text input with a searchable combobox backed by the
**BD Medicine API Service** — a dedicated, standalone Bangladesh medicine data API
that CareNet and any future project can call.

---

## 2. Data Source Decision

| Option | Status | Reason |
|---|---|---|
| Indian dataset | ❌ Rejected | India-specific — wrong country |
| Static bundled JSON | ❌ Superseded | Data now lives in the BD Medicine API Service |
| **BD Medicine API Service** | ✅ **Selected** | Standalone Supabase-hosted API, 21,122 BD medicines, free tier |

The BD Medicine API Service project lives at:
`C:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\BD Medicine API Service`

It is a separate Supabase project — independent from CareNet's Supabase project.

---

## 3. How CareNet Connects

### Environment variables
Add to `CareNet 2/.env`:
```env
VITE_MEDICINE_API_URL=https://<bd-medicine-api-project>.supabase.co
VITE_MEDICINE_API_KEY=<anon-key-from-bd-medicine-api-supabase>
```

> ⚠️ This is the **anon key from the BD Medicine API Supabase project**,
> NOT from CareNet's own Supabase project. They are two separate projects.

The anon key is safe to put in the frontend — the BD Medicine API enforces
read-only Row Level Security, so the key cannot write or delete anything.

### Query pattern
```ts
const query = "napa"; // user's search input

const res = await fetch(
  `${import.meta.env.VITE_MEDICINE_API_URL}/rest/v1/medicines`
  + `?or=(brand_name.ilike.*${encodeURIComponent(query)}*,generic_name.ilike.*${encodeURIComponent(query)}*)`
  + `&limit=10`
  + `&order=brand_name.asc`,
  {
    headers: {
      apikey: import.meta.env.VITE_MEDICINE_API_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_MEDICINE_API_KEY}`,
    },
  }
);

const results: MedicineResult[] = await res.json();
```

### Response shape
```json
[
  {
    "id": 1,
    "brand_name": "Napa 500mg",
    "generic_name": "Paracetamol",
    "strength": "500mg",
    "dosage_form": "Tablet"
  }
]
```

---

## 4. New Component: `MedicineSearchCombobox`

**File:** `src/frontend/components/shared/MedicineSearchCombobox.tsx`

### Behaviour
1. As the caregiver types (≥ 2 characters), fires a debounced API call (300ms)
   to the BD Medicine API Service
2. Shows a dropdown of up to 10 results, each displaying:
   - **Brand name** (primary, e.g. "Napa 500mg")
   - *Generic name* (sub-label, muted, e.g. "Paracetamol")
3. On selection:
   - `medicineName` ← brand name
   - `genericName` ← generic name, shown as italic sub-label below the input
4. ✕ button clears selection and returns to free-text mode
5. If no results: "No match — type to use a custom name" (free-text still accepted)
6. If API is unreachable: silent fallback to plain text input (no crash)

### Props interface
```ts
interface MedicineResult {
  id: number;
  brand_name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
}

interface Props {
  value: string;          // current brand name
  genericLabel: string;   // current generic name (shown below input)
  onChange: (selected: {
    name: string;         // brand name  → medicineName
    generic: string;      // generic name → genericName
  }) => void;
  placeholder?: string;
}
```

### UI States
| State | UI |
|---|---|
| Idle | Placeholder + search icon |
| Typing (< 2 chars) | No dropdown |
| Loading | Spinner in input while fetching |
| Results | Dropdown with brand + generic sub-label |
| Selected | Brand name in input, generic as italic sub-label |
| No results | "No match" message, free-text accepted |
| API error | Silent plain text fallback |

---

## 5. Changes to `CaregiverMedSchedulePage.tsx`

Only the **`showAddForm` block** inside `view === "setup"` changes.

### 1. Add `genericName` to form state
```ts
const [newSched, setNewSched] = useState({
  medicineName: "",
  genericName: "",   // ← add
  ...
});
```

### 2. Replace the medicine `<input>` with `<MedicineSearchCombobox>`
```tsx
// Before
<input
  type="text"
  value={newSched.medicineName}
  onChange={e => setNewSched({ ...newSched, medicineName: e.target.value })}
  placeholder="Medicine name"
  ...
/>

// After
<MedicineSearchCombobox
  value={newSched.medicineName}
  genericLabel={newSched.genericName}
  onChange={({ name, generic }) =>
    setNewSched({ ...newSched, medicineName: name, genericName: generic })
  }
  placeholder="Search BD medicine…"
/>
```

### What does NOT change
- All other form fields (Patient, Dosage, Time, Repeat Days, Reminder, Instructions)
- Today view, Week view, active schedules list
- CareNet's backend service calls or Supabase schema
- No new npm packages needed — existing `ui/command.tsx` + `ui/popover.tsx` cover the dropdown

---

## 6. Files Affected

| File | Change | Notes |
|---|---|---|
| `CareNet 2/.env` | **Edit** | Add `VITE_MEDICINE_API_URL` and `VITE_MEDICINE_API_KEY` |
| `src/frontend/components/shared/MedicineSearchCombobox.tsx` | **New** | The combobox component |
| `src/frontend/pages/caregiver/CaregiverMedSchedulePage.tsx` | **Edit** | Swap input → combobox, add `genericName` to state |

No backend changes. No DB migrations. No new npm packages.
No static JSON file in the CareNet repo — data comes from the API.

---

## 7. Prerequisite: BD Medicine API Service Must Be Live

The combobox cannot be built until the BD Medicine API Service is deployed.
Build order:

1. ✅ `BD Medicine API Service/data/bd-medicines.csv` — already generated
2. ⬜ Create new Supabase project for BD Medicine API
3. ⬜ Run `001_create_medicines.sql`
4. ⬜ Import `bd-medicines.csv` via Supabase Dashboard
5. ⬜ Verify API works: `https://<project>.supabase.co/rest/v1/medicines?brand_name=ilike.*napa*&limit=5`
6. ⬜ Add `VITE_MEDICINE_API_URL` + `VITE_MEDICINE_API_KEY` to CareNet `.env`
7. ⬜ Build `MedicineSearchCombobox.tsx`
8. ⬜ Integrate into `CaregiverMedSchedulePage.tsx`
9. ⬜ Test: search, select, clear, custom name fallback, API-down fallback

---

## 8. Future: Upgrade to Paid Tier Endpoint

Once the BD Medicine API commercial portal is live and the Edge Function proxy is
deployed, CareNet can optionally upgrade to use the paid endpoint which provides
additional data (clinical monographs, drug class, indication):

```ts
// Paid endpoint (future)
const res = await fetch(
  `${import.meta.env.VITE_MEDICINE_API_URL}/functions/v1/medicine-api?q=${query}&limit=10`,
  {
    headers: {
      "X-API-Key": import.meta.env.VITE_MEDICINE_API_KEY,
    },
  }
);
```

This would allow the combobox to also show dosage form and drug class,
and future pages (Prescription, Medical Records) to show full monograph data.

---

## 9. Expanded Use in CareNet (Future)

Once the combobox is working on `CaregiverMedSchedulePage`, the same component
can be dropped into:

| Page | Use case |
|---|---|
| `CaregiverPrescriptionPage.tsx` | Prescription entry |
| `PatientMedicalRecordsPage.tsx` | Recording patient medication history |
| `MedicationRemindersPage.tsx` | Setting up patient reminders |
| `AgencyCarePlanTemplatePage.tsx` | Care plan templates with standard medications |

All reuse the same `MedicineSearchCombobox` component unchanged.

---

*Plan updated: March 2026 — data source changed from static JSON to BD Medicine API Service*
