import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Home, ArrowLeft, ArrowRight, Check,
  UserCheck, Key, Target, TrendingUp, Layers, Building2,
  DollarSign, MapPin, Zap, Calendar, Clock, Telescope, Eye,
  CreditCard, Search, CalendarCheck, FileText, ShieldCheck, PenLine,
  SlidersHorizontal, BadgeCheck, Rocket, Info,
} from "lucide-react"
import { ROUTES } from "../../constants/routes"

const STEPS = [
  { id: "experience", title: "Let's get to know you",    subtitle: "This helps us tailor the process to your situation." },
  { id: "goal",       title: "What's your goal?",        subtitle: "Tell us what you're looking to do." },
  { id: "budget",     title: "What's your budget?",      subtitle: "We'll show you what's realistic in Rwanda." },
  { id: "location",   title: "Where are you looking?",   subtitle: "Pick one or more provinces." },
  { id: "timeline",   title: "When do you want to move?",subtitle: "This helps agents prioritise your search." },
  { id: "summary",    title: "Your personalised guide",  subtitle: "Based on your answers, here's what to expect." },
]

const PROVINCES = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"]

const FIRST_TIME_GUIDE = [
  { step: "01", Icon: CreditCard,   title: "Get pre-qualified",      desc: "Before you start viewing, understand your budget. Talk to a bank or mortgage broker about what you can borrow. In Rwanda, most banks offer mortgages up to 80% of property value." },
  { step: "02", Icon: Search,       title: "Search & shortlist",     desc: "Browse verified listings on HomeQuest. Filter by province, type and price. Save properties you like and compare them side by side." },
  { step: "03", Icon: CalendarCheck,title: "View properties",        desc: "Book viewings through our platform. Our agents will accompany you and answer all your questions about the property and neighbourhood." },
  { step: "04", Icon: FileText,     title: "Submit your offer",      desc: "Found the one? Submit a formal offer through HomeQuest. Include your offer amount, deposit, funding source and proposed closing date." },
  { step: "05", Icon: ShieldCheck,  title: "Due diligence",          desc: "Once your offer is accepted, our agents verify the title deed, check for encumbrances, and ensure all documents are in order with the Rwanda Land Authority." },
  { step: "06", Icon: Key,          title: "Sign & transfer",        desc: "Sign the sale agreement at a notary. The title deed is transferred at the Rwanda Land Authority. Congratulations — you're a homeowner!" },
]

const EXPERIENCED_GUIDE = [
  { step: "01", Icon: SlidersHorizontal, title: "Define your criteria",       desc: "You know the process. Set your filters — province, type, price range — and let HomeQuest surface the best matches from our verified listings." },
  { step: "02", Icon: BadgeCheck,        title: "Submit a competitive offer",  desc: "Use your experience to craft a strong offer. Include a realistic deposit and closing date to stand out from other buyers." },
  { step: "03", Icon: Rocket,            title: "Fast-track due diligence",    desc: "Our agents can expedite title verification and document checks. If you have a lawyer, they can liaise directly with our team." },
  { step: "04", Icon: PenLine,           title: "Close efficiently",           desc: "With all documents ready, closing can happen in as little as 2 weeks. Our platform tracks every step so nothing falls through the cracks." },
]

const GOAL_LABELS = { buy: "Buy to live in", invest: "Investment / rental", land: "Buy land", commercial: "Commercial" }
const GOAL_ICONS  = { buy: Home, invest: TrendingUp, land: Layers, commercial: Building2 }

const TIMELINE_LABELS = { asap: "As soon as possible", "3months": "Within 3 months", "6months": "Within 6 months", "1year": "Within a year", browsing: "Just browsing" }

const BUDGET_LABELS = {
  under20m: "Under RWF 20M",
  "20_50m": "RWF 20M – 50M",
  "50_100m": "RWF 50M – 100M",
  "100_300m": "RWF 100M – 300M",
  over300m: "Over RWF 300M",
}

const optBtn = (active) => ({
  width: "100%", padding: "1rem 1.25rem", borderRadius: "12px", cursor: "pointer",
  fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 500, textAlign: "left",
  border: `2px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
  backgroundColor: active ? "#FFF5F0" : "#fff",
  color: active ? "var(--color-primary)" : "var(--color-text)",
  transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "space-between",
  gap: "0.75rem",
})

function Option({ active, onClick, icon: Icon, label, sub }) {
  return (
    <button style={optBtn(active)} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flex: 1 }}>
        <div style={{ width: 36, height: 36, borderRadius: "9px", backgroundColor: active ? "var(--color-primary)" : "var(--color-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
          <Icon size={17} color={active ? "#fff" : "var(--color-text-muted)"} />
        </div>
        <div>
          <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
          {sub && <div style={{ fontSize: "0.775rem", color: active ? "var(--color-primary)" : "var(--color-text-muted)", marginTop: "0.1rem", fontWeight: 400 }}>{sub}</div>}
        </div>
      </div>
      {active
        ? <Check size={16} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
        : <div style={{ width: 16, flexShrink: 0 }} />
      }
    </button>
  )
}

export default function BuyingGuidePage() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState({ experience: null, goal: null, budget: null, locations: [], timeline: null })

  const set = (key, val) => setAnswers(a => ({ ...a, [key]: val }))
  const toggleLocation = (loc) => setAnswers(a => ({
    ...a,
    locations: a.locations.includes(loc) ? a.locations.filter(l => l !== loc) : [...a.locations, loc],
  }))

  const isFirstTime = answers.experience === "first"
  const guide       = isFirstTime ? FIRST_TIME_GUIDE : EXPERIENCED_GUIDE

  const canNext = () => {
    if (step === 0) return !!answers.experience
    if (step === 1) return !!answers.goal
    if (step === 2) return !!answers.budget
    if (step === 3) return answers.locations.length > 0
    if (step === 4) return !!answers.timeline
    return true
  }

  const progress = Math.round((step / (STEPS.length - 1)) * 100)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff", borderBottom: "1px solid var(--color-border)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate(ROUTES.HOME)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)", padding: 0 }}>
          <ArrowLeft size={15} /> Back to Home
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: "7px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Home size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-text)" }}>HomeQuest</span>
        </div>
        {step < STEPS.length - 1
          ? <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{step + 1} / {STEPS.length - 1}</span>
          : <span style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600 }}>Complete</span>
        }
      </div>

      {/* Progress bar */}
      {step < STEPS.length - 1 && (
        <div style={{ height: 3, backgroundColor: "var(--color-border)" }}>
          <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "var(--color-primary)", transition: "width 0.4s ease" }} />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>

          {/* Step header */}
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <p style={{ margin: "0 0 0.4rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {step < STEPS.length - 1 ? `Step ${step + 1}` : "Your Guide"}
            </p>
            <h1 style={{ margin: "0 0 0.5rem", fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 1.875rem)", color: "var(--color-text)", letterSpacing: "-0.02em" }}>
              {STEPS[step].title}
            </h1>
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{STEPS[step].subtitle}</p>
          </div>

          {/* Step 0 — Experience */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Option active={answers.experience === "first"}      onClick={() => set("experience", "first")}      icon={UserCheck} label="Yes, this is my first time buying property" />
              <Option active={answers.experience === "experienced"} onClick={() => set("experience", "experienced")} icon={Key}       label="No, I've bought property before" />
              {answers.experience === "first" && (
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem", padding: "1rem 1.25rem", borderRadius: "12px", backgroundColor: "#FFF5F0", border: "1px solid #FFD5C2", fontSize: "0.8375rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                  <Info size={16} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 2 }} />
                  Welcome! We'll walk you through every step of the process — from budgeting to getting your keys.
                </div>
              )}
            </div>
          )}

          {/* Step 1 — Goal */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Option active={answers.goal === "buy"}        onClick={() => set("goal", "buy")}        icon={Home}      label="Buy a home to live in" />
              <Option active={answers.goal === "invest"}     onClick={() => set("goal", "invest")}     icon={TrendingUp} label="Buy as an investment / rental" />
              <Option active={answers.goal === "land"}       onClick={() => set("goal", "land")}       icon={Layers}    label="Buy land to build on" />
              <Option active={answers.goal === "commercial"} onClick={() => set("goal", "commercial")} icon={Building2} label="Buy commercial property" />
            </div>
          )}

          {/* Step 2 — Budget */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Option active={answers.budget === "under20m"}  onClick={() => set("budget", "under20m")}  icon={DollarSign} label="Under RWF 20M"     sub="Starter / land plots" />
              <Option active={answers.budget === "20_50m"}    onClick={() => set("budget", "20_50m")}    icon={DollarSign} label="RWF 20M – 50M"     sub="Affordable homes" />
              <Option active={answers.budget === "50_100m"}   onClick={() => set("budget", "50_100m")}   icon={DollarSign} label="RWF 50M – 100M"    sub="Mid-range apartments & houses" />
              <Option active={answers.budget === "100_300m"}  onClick={() => set("budget", "100_300m")}  icon={DollarSign} label="RWF 100M – 300M"   sub="Premium properties" />
              <Option active={answers.budget === "over300m"}  onClick={() => set("budget", "over300m")}  icon={DollarSign} label="Over RWF 300M"     sub="Luxury villas & commercial" />
            </div>
          )}

          {/* Step 3 — Location */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <p style={{ margin: "0 0 0.25rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Select all that apply</p>
              {PROVINCES.map(loc => (
                <Option key={loc} active={answers.locations.includes(loc)} onClick={() => toggleLocation(loc)} icon={MapPin} label={loc} />
              ))}
            </div>
          )}

          {/* Step 4 — Timeline */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Option active={answers.timeline === "asap"}     onClick={() => set("timeline", "asap")}     icon={Zap}      label="As soon as possible" />
              <Option active={answers.timeline === "3months"}  onClick={() => set("timeline", "3months")}  icon={Calendar} label="Within 3 months" />
              <Option active={answers.timeline === "6months"}  onClick={() => set("timeline", "6months")}  icon={Clock}    label="Within 6 months" />
              <Option active={answers.timeline === "1year"}    onClick={() => set("timeline", "1year")}    icon={Target}   label="Within a year" />
              <Option active={answers.timeline === "browsing"} onClick={() => set("timeline", "browsing")} icon={Eye}      label="Just browsing for now" />
            </div>
          )}

          {/* Step 5 — Summary */}
          {step === 5 && (
            <div>
              {/* Profile card */}
              <div style={{ backgroundColor: "#fff", border: "1px solid var(--color-border)", borderRadius: "14px", padding: "1.25rem", marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {[
                  { label: "Buyer type", value: isFirstTime ? "First-time buyer" : "Experienced buyer",  Icon: isFirstTime ? UserCheck : Key },
                  { label: "Goal",       value: GOAL_LABELS[answers.goal],                                Icon: GOAL_ICONS[answers.goal] || Home },
                  { label: "Budget",     value: BUDGET_LABELS[answers.budget],                            Icon: DollarSign },
                  { label: "Locations",  value: answers.locations.join(", ") || "—",                      Icon: MapPin },
                  { label: "Timeline",   value: TIMELINE_LABELS[answers.timeline],                        Icon: Clock },
                ].map(({ label, value, Icon: I }) => (
                  <div key={label} style={{ flex: "1 1 150px", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: "#FFF5F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <I size={14} style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                      <p style={{ margin: "0.15rem 0 0", fontSize: "0.84rem", fontWeight: 600, color: "var(--color-text)" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guide steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "2rem" }}>
                {guide.map((g, i) => {
                  const GIcon = g.Icon
                  return (
                    <div key={g.step} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: i === 0 ? "var(--color-primary)" : "#F5F5F5", border: `2px solid ${i === 0 ? "var(--color-primary)" : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <GIcon size={16} color={i === 0 ? "#fff" : "var(--color-text-muted)"} />
                      </div>
                      <div style={{ paddingTop: "0.4rem" }}>
                        <p style={{ margin: "0 0 0.3rem", fontWeight: 700, fontSize: "0.9rem", color: "var(--color-text)" }}>{g.title}</p>
                        <p style={{ margin: 0, fontSize: "0.8375rem", color: "var(--color-text-muted)", lineHeight: 1.75 }}>{g.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button onClick={() => navigate(ROUTES.PROPERTY_SEARCH)} style={{ flex: 1, minWidth: 160, padding: "0.8rem 1.5rem", borderRadius: "10px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Browse Properties
                </button>
                <button onClick={() => navigate(ROUTES.REGISTER)} style={{ flex: 1, minWidth: 160, padding: "0.8rem 1.5rem", borderRadius: "10px", border: "1px solid var(--color-border)", backgroundColor: "#fff", color: "var(--color-text)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          {step < STEPS.length - 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", gap: "0.75rem" }}>
              <button
                onClick={() => step > 0 ? setStep(s => s - 1) : navigate(ROUTES.HOME)}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.25rem", borderRadius: "10px", border: "1px solid var(--color-border)", backgroundColor: "#fff", color: "var(--color-text)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}
              >
                <ArrowLeft size={15} /> {step === 0 ? "Home" : "Back"}
              </button>
              <button
                onClick={() => canNext() && setStep(s => s + 1)}
                disabled={!canNext()}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.75rem", borderRadius: "10px", border: "none", backgroundColor: canNext() ? "var(--color-primary)" : "var(--color-border)", color: canNext() ? "#fff" : "var(--color-text-muted)", fontWeight: 700, fontSize: "0.875rem", cursor: canNext() ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "background 0.15s" }}
              >
                {step === STEPS.length - 2 ? "See my guide" : "Continue"} <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
