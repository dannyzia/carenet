import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/frontend/theme/tokens";
import { Search, X, Loader2, Pill } from "lucide-react";

/* ─── Types ─── */
export interface MedicineResult {
  id: number;
  brand_name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
}

interface Props {
  value: string;
  genericLabel: string;
  onChange: (selected: { name: string; generic: string }) => void;
  placeholder?: string;
}

/* ─── API config ─── */
const API_URL = import.meta.env.VITE_MEDICINE_API_URL || "";
const API_KEY = import.meta.env.VITE_MEDICINE_API_KEY || "";
const API_CONFIGURED = !!(API_URL && API_KEY && !API_URL.includes("YOUR_"));

async function searchMedicines(query: string): Promise<MedicineResult[]> {
  if (!API_CONFIGURED) return [];
  const encoded = encodeURIComponent(query);
  const res = await fetch(
    `${API_URL}/rest/v1/medicines` +
      `?or=(brand_name.ilike.*${encoded}*,generic_name.ilike.*${encoded}*)` +
      `&limit=10&order=brand_name.asc`,
    {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

/* ─── Component ─── */
export function MedicineSearchCombobox({ value, genericLabel, onChange, placeholder = "Search medicine…" }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<MedicineResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync external value changes
  useEffect(() => { setQuery(value); }, [value]);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2 || !API_CONFIGURED) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    setApiError(false);
    try {
      const data = await searchMedicines(q);
      setResults(data);
      setIsOpen(true);
      setHighlightIdx(-1);
    } catch {
      setApiError(true);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (val: string) => {
    setQuery(val);
    onChange({ name: val, generic: "" });
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSelect = (item: MedicineResult) => {
    const name = `${item.brand_name}${item.strength ? ` ${item.strength}` : ""}`;
    setQuery(name);
    onChange({ name, generic: item.generic_name });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery("");
    onChange({ name: "", generic: "" });
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const el = listRef.current.children[highlightIdx] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showFallbackHint = !API_CONFIGURED || apiError;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: cn.textSecondary }}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-3 rounded-xl border text-sm"
          style={{ background: cn.bgInput, borderColor: cn.border, color: cn.text }}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="medicine-listbox"
          aria-activedescendant={highlightIdx >= 0 ? `med-option-${highlightIdx}` : undefined}
          aria-label="Search medicine"
        />
        {isLoading && (
          <Loader2
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin"
            style={{ color: cn.pink }}
            aria-hidden="true"
          />
        )}
        {!isLoading && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:opacity-70"
            style={{ color: cn.textSecondary }}
            aria-label="Clear medicine selection"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Generic name sub-label */}
      {genericLabel && (
        <p className="mt-1 text-xs italic flex items-center gap-1" style={{ color: cn.textSecondary }}>
          <Pill className="w-3 h-3" aria-hidden="true" />
          Generic: {genericLabel}
        </p>
      )}

      {/* Fallback hint */}
      {showFallbackHint && query.length >= 2 && (
        <p className="mt-1 text-xs" style={{ color: cn.textSecondary }}>
          Medicine API unavailable — using free text
        </p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <ul
          id="medicine-listbox"
          ref={listRef}
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border shadow-lg"
          style={{ background: cn.bgCard, borderColor: cn.border }}
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm" style={{ color: cn.textSecondary }}>
              No match — type to use a custom name
            </li>
          ) : (
            results.map((item, idx) => (
              <li
                key={item.id}
                id={`med-option-${idx}`}
                role="option"
                aria-selected={highlightIdx === idx}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightIdx(idx)}
                className="px-4 py-2.5 cursor-pointer transition-colors"
                style={{
                  background: highlightIdx === idx ? cn.bgInput : "transparent",
                  color: cn.text,
                }}
              >
                <div className="text-sm">
                  {item.brand_name}
                  {item.strength && (
                    <span className="ml-1 opacity-60">{item.strength}</span>
                  )}
                  {item.dosage_form && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px]"
                      style={{ background: cn.bgInput, color: cn.textSecondary }}>
                      {item.dosage_form}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: cn.textSecondary }}>
                  {item.generic_name}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
