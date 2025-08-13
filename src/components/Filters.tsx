import { memo, useMemo } from "react";
import type { Filters } from "../types/filters";

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
  countries: string[]; 
};

export const FiltersBar = memo(function FiltersBar({ value, onChange, onReset, countries }: Props) {
  const onText = (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value });

  const onDate = (key: "registeredFrom" | "registeredTo") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: e.target.value || null });

  const onCountryToggle = (c: string) => {
    const set = new Set(value.country);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    set.has(c) ? set.delete(c) : set.add(c);
    onChange({ ...value, country: Array.from(set) });
  };

  const isActive = useMemo(() => {
    const { name, email, country, registeredFrom, registeredTo } = value;
    return !!(name || email || country.length || registeredFrom || registeredTo);
  }, [value]);

  return (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr 1fr auto", alignItems: "end", marginBottom: 12 }}>
      <div>
        <label>Имя</label>
        <input placeholder="поиск по подстроке" value={value.name} onChange={onText("name")} />
      </div>
      <div>
        <label>Email</label>
        <input placeholder="поиск по подстроке" value={value.email} onChange={onText("email")} />
      </div>
      <div>
        <label>Страны</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {countries.map((c) => (
            <label key={c} style={{ border: "1px solid #ccc", padding: "4px 8px", borderRadius: 6, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={value.country.includes(c)}
                onChange={() => onCountryToggle(c)}
                style={{ marginRight: 6 }}
              />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label>Дата регистрации</label>
        <div style={{ display: "flex", gap: 6 }}>
          <input type="date" value={value.registeredFrom ?? ""} onChange={onDate("registeredFrom")} />
          <span>—</span>
          <input type="date" value={value.registeredTo ?? ""} onChange={onDate("registeredTo")} />
        </div>
      </div>
      <div>
        <button onClick={onReset} disabled={!isActive}>Сбросить</button>
      </div>
    </div>
  );
});
