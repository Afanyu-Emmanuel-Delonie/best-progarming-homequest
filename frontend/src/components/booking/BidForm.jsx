import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, Check, User, Loader2 } from "lucide-react"
import { FUNDING_LABELS } from "../../constants/enums"
import { fmtCurrencyFull } from "../../utils/formatters"
import { agentsApi } from "../../api/agents.api"

const STEPS = ["Select Agent", "Personal Info", "Offer Details", "Review & Submit"]

const field = (label, key, type, form, setForm, extra = {}) => (
  <div key={key}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      value={form[key]}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      style={styles.input}
      {...extra}
    />
  </div>
)

export default function BidForm({ property, onSubmit, loading }) {
  const [step, setStep] = useState(0)
  const [agents, setAgents] = useState([])
  const [agentsLoading, setAgentsLoading] = useState(true)
  const today = new Date().toISOString().split("T")[0]
  const [form, setForm] = useState({
    assignedAgentPublicId: "",
    buyerFullName: "", buyerNationalId: "", buyerPhone: "",
    offerAmount: "", depositAmount: "", fundingSource: "CASH",
    proposedClosingDate: "", offerExpirationDate: "", specialConditions: "",
  })

  useEffect(() => {
    agentsApi.getAllActive()
      .then(data => {
        setAgents(data)
        if (!data || data.length === 0) setForm(f => ({ ...f, assignedAgentPublicId: "homequest" }))
      })
      .catch(() => {
        setAgents([])
        setForm(f => ({ ...f, assignedAgentPublicId: "homequest" }))
      })
      .finally(() => setAgentsLoading(false))
  }, [])

  const canNext = () => {
    if (step === 0) return !!form.assignedAgentPublicId
    if (step === 1) return form.buyerFullName && form.buyerNationalId && form.buyerPhone
    if (step === 2) return form.offerAmount && form.depositAmount && form.proposedClosingDate && form.offerExpirationDate
    return true
  }

  const handleSubmit = () => {
    onSubmit({
      ...form,
      assignedAgentPublicId: form.assignedAgentPublicId === "homequest" ? null : form.assignedAgentPublicId,
      offerAmount: Number(form.offerAmount),
      depositAmount: Number(form.depositAmount),
    })
  }

  const isHomeQuest = form.assignedAgentPublicId === "homequest"
  const selectedAgent = agents.find(a => a.userPublicId === form.assignedAgentPublicId)

  return (
    <div>
      {/* Step indicator */}
      <div style={styles.stepper}>
        {STEPS.map((s, i) => (
          <div key={s} style={styles.stepItem}>
            <div style={{ ...styles.stepDot, ...(i <= step ? styles.stepDotActive : {}) }}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span style={{ ...styles.stepLabel, ...(i === step ? styles.stepLabelActive : {}) }} className="step-label">{s}</span>
            {i < STEPS.length - 1 && <div style={{ ...styles.stepLine, ...(i < step ? styles.stepLineActive : {}) }} />}
          </div>
        ))}
      </div>

      {/* Step 0 — Select Agent */}
      {step === 0 && (
        <div style={styles.fields}>
          <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Choose an agent to manage your application. They will review your offer and guide you through the process.
          </p>
          {agentsLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", padding: "2rem 0" }}>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Loading agents…
            </div>
          ) : agents.length === 0 ? (
            <HomeQuestFallback selected={form.assignedAgentPublicId === "homequest"} onSelect={() => setForm(f => ({ ...f, assignedAgentPublicId: "homequest" }))} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {agents.map(agent => {
                const selected = form.assignedAgentPublicId === agent.userPublicId
                return (
                  <button
                    key={agent.userPublicId}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, assignedAgentPublicId: agent.userPublicId }))}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "0.875rem 1rem", borderRadius: "12px", cursor: "pointer",
                      border: `2px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
                      backgroundColor: selected ? "#FFF5F0" : "#fff",
                      textAlign: "left", fontFamily: "inherit", transition: "all 0.15s",
                    }}
                  >
                    {agent.profileImage ? (
                      <img src={agent.profileImage} alt={agent.firstName} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "var(--color-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <User size={20} color="var(--color-text-muted)" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: selected ? "var(--color-primary)" : "var(--color-text)" }}>
                        {agent.firstName} {agent.lastName}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        License: {agent.licenseNumber}
                      </p>
                    </div>
                    {selected && <Check size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />}
                  </button>
                )
              })}
              <HomeQuestFallback selected={isHomeQuest} onSelect={() => setForm(f => ({ ...f, assignedAgentPublicId: "homequest" }))} />
            </div>
          )}
        </div>
      )}

      {/* Step 1 — Personal Info */}
      {step === 1 && (
        <div style={styles.fields}>
          {field("Full Name *", "buyerFullName", "text", form, setForm, { placeholder: "e.g. Jean Paul Habimana" })}
          {field("National ID / Passport *", "buyerNationalId", "text", form, setForm, { placeholder: "1 1990 8 0123456 7 89" })}
          {field("Phone Number *", "buyerPhone", "tel", form, setForm, { placeholder: "+250 7XX XXX XXX" })}
        </div>
      )}

      {/* Step 2 — Offer Details */}
      {step === 2 && (
        <div style={styles.fields}>
          <div className="bid-grid2" style={styles.grid2}>
            {field("Offer Amount (RWF) *", "offerAmount", "number", form, setForm, { min: 0, placeholder: property?.price })}
            {field("Deposit Amount (RWF) *", "depositAmount", "number", form, setForm, { min: 0 })}
          </div>
          <div>
            <label style={styles.label}>Funding Source *</label>
            <select value={form.fundingSource} onChange={e => setForm(f => ({ ...f, fundingSource: e.target.value }))} style={styles.input}>
              {Object.entries(FUNDING_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="bid-grid2" style={styles.grid2}>
            {field("Proposed Closing Date *", "proposedClosingDate", "date", form, setForm, { min: today })}
            {field("Offer Expiry Date *", "offerExpirationDate", "date", form, setForm, { min: today })}
          </div>
          <div>
            <label style={styles.label}>Special Conditions</label>
            <textarea
              value={form.specialConditions}
              onChange={e => setForm(f => ({ ...f, specialConditions: e.target.value }))}
              rows={3} placeholder="Any conditions or notes…"
              style={{ ...styles.input, resize: "vertical" }}
            />
          </div>
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <div style={styles.review}>
          <Section title="Assigned Agent">
            <Row label="Agent" value={isHomeQuest ? "HomeQuest (assigned by team)" : selectedAgent ? `${selectedAgent.firstName} ${selectedAgent.lastName}` : "—"} />
            {selectedAgent && !isHomeQuest && <Row label="License" value={selectedAgent.licenseNumber} />}
          </Section>
          <Section title="Personal Info">
            <Row label="Full Name"   value={form.buyerFullName} />
            <Row label="National ID" value={form.buyerNationalId} />
            <Row label="Phone"       value={form.buyerPhone} />
          </Section>
          <Section title="Offer Details">
            <Row label="Offer Amount"  value={fmtCurrencyFull(Number(form.offerAmount))} />
            <Row label="Deposit"       value={fmtCurrencyFull(Number(form.depositAmount))} />
            <Row label="Funding"       value={FUNDING_LABELS[form.fundingSource]} />
            <Row label="Closing Date"  value={form.proposedClosingDate} />
            <Row label="Offer Expires" value={form.offerExpirationDate} />
            {form.specialConditions && <Row label="Conditions" value={form.specialConditions} />}
          </Section>
        </div>
      )}

      {/* Navigation */}
      <div style={styles.nav}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={styles.btnSecondary}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <div style={{ flex: 1 }} />
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} style={{ ...styles.btnPrimary, opacity: canNext() ? 1 : 0.45 }}>
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 600px) {
          .bid-grid2  { grid-template-columns: 1fr !important; }
          .step-label { display: none; }
        }
      `}</style>
    </div>
  )
}

function HomeQuestFallback({ selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: "flex", alignItems: "center", gap: "1rem",
        padding: "0.875rem 1rem", borderRadius: "12px", cursor: "pointer",
        border: `2px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
        backgroundColor: selected ? "#FFF5F0" : "#F9F9F9",
        textAlign: "left", fontFamily: "inherit", transition: "all 0.15s", width: "100%",
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <User size={20} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: selected ? "var(--color-primary)" : "var(--color-text)" }}>HomeQuest Team</p>
        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>An agent will be assigned by our team</p>
      </div>
      {selected && <Check size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />}
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p style={{ margin: "0 0 0.6rem", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-primary)" }}>{title}</p>
      <div style={{ backgroundColor: "var(--color-bg-muted, #F9F9F9)", borderRadius: "10px", padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", gap: "1rem" }}>
      <span style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, color: "var(--color-text)", textAlign: "right" }}>{value}</span>
    </div>
  )
}

const styles = {
  stepper: { display: "flex", alignItems: "center", marginBottom: "2rem" },
  stepItem: { display: "flex", alignItems: "center", flex: 1 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", flexShrink: 0, backgroundColor: "#fff", transition: "all 0.2s" },
  stepDotActive: { borderColor: "var(--color-primary)", backgroundColor: "var(--color-primary)", color: "#fff" },
  stepLabel: { fontSize: "0.75rem", fontWeight: 500, color: "var(--color-text-muted)", marginLeft: "0.4rem", whiteSpace: "nowrap" },
  stepLabelActive: { color: "var(--color-text)", fontWeight: 700 },
  stepLine: { flex: 1, height: 2, backgroundColor: "var(--color-border)", margin: "0 0.5rem" },
  stepLineActive: { backgroundColor: "var(--color-primary)" },
  fields: { display: "flex", flexDirection: "column", gap: "1rem", minHeight: 220 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
  label: { display: "block", fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.06em" },
  input: { width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.875rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", backgroundColor: "#fff" },
  review: { minHeight: 220 },
  nav: { display: "flex", alignItems: "center", marginTop: "1.75rem", gap: "0.75rem" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.7rem 1.5rem", borderRadius: "10px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" },
  btnSecondary: { display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.7rem 1.25rem", borderRadius: "10px", border: "1px solid var(--color-border)", backgroundColor: "#fff", color: "var(--color-text)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" },
}
