const selectStyle = {
  padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem", color: "var(--color-text)",
  outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box",
  appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", paddingRight: "2rem",
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: "0.72rem", color: "#B91C1C" }}>{error}</span>}
    </div>
  )
}

function LocationSelect({ label, value, options, onChange, disabled, placeholder, error }) {
  return (
    <Field label={label} error={error}>
      <select
        style={{ ...selectStyle, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{disabled ? "—" : placeholder}</option>
        {options.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
      </select>
    </Field>
  )
}

/**
 * LocationFields — drop-in cascading location picker
 * Props:
 *   location  — { provinceCode, districtCode, sectorCode, cellCode, villageCode }
 *   provinces, districts, sectors, cells, villages — arrays of { code, name }
 *   pick      — (level, code) => void
 *   errors    — { province?, district?, sector?, cell?, village? }
 */
export default function LocationFields({ location, provinces, districts, sectors, cells, villages, pick, errors = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <LocationSelect
          label="Province" placeholder="Select province"
          value={location.provinceCode} options={provinces}
          onChange={v => pick("province", v)} error={errors.province}
        />
        <LocationSelect
          label="District" placeholder="Select district"
          value={location.districtCode} options={districts}
          onChange={v => pick("district", v)} disabled={!location.provinceCode}
          error={errors.district}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <LocationSelect
          label="Sector" placeholder="Select sector"
          value={location.sectorCode} options={sectors}
          onChange={v => pick("sector", v)} disabled={!location.districtCode}
          error={errors.sector}
        />
        <LocationSelect
          label="Cell" placeholder="Select cell"
          value={location.cellCode} options={cells}
          onChange={v => pick("cell", v)} disabled={!location.sectorCode}
          error={errors.cell}
        />
      </div>
      <LocationSelect
        label="Village" placeholder="Select village"
        value={location.villageCode} options={villages}
        onChange={v => pick("village", v)} disabled={!location.cellCode}
        error={errors.village}
      />
    </div>
  )
}
