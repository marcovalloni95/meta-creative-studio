"use client";

import { useMemo, useState } from "react";
import {
  ARCHETYPES,
  FAMILY_DESC,
  FAMILY_LABELS,
  FORMAT_SPECS,
  GOAL_LABELS,
  MODEL_HINT,
  MODEL_LABELS,
  archetypesByFamily,
  generate,
} from "../../lib/imagePrompt";
import type {
  ContentType,
  Family,
  Goal,
  GenerateResult,
  Logo,
  Model,
  Palette,
  PromptFormat,
  PromptUnit,
} from "../../lib/imagePrompt";

const FORMATS: PromptFormat[] = ["1:1", "4:5", "9:16"];
const FAMILIES: Family[] = ["A", "B", "C", "D", "E", "F"];
const GOALS: Goal[] = ["leads", "sales", "awareness"];
const MODELS: Model[] = ["nano-banana", "chatgpt", "midjourney", "higgsfield"];

const SAMPLE = `Se hai la spalla congelata, sai bene che non è "un dolore come gli altri".
Non passa magicamente da sola come spesso ti raccontano: aspettare peggiora il recupero.
Sono il dott. [nome] di Shoulder Center: dal 2018 ci occupiamo solo di fisioterapia della spalla.
Oltre 1200 pazienti seguiti da remoto e più di 130 video-testimonianze.
Richiedi ora la prima consulenza gratuita: ti diciamo subito se sei idoneo.`;

function CopyButton({ text, label = "Copia" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className="btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1200);
        } catch {
          /* clipboard non disponibile */
        }
      }}
    >
      {ok ? "Copiato ✓" : label}
    </button>
  );
}

const SCHEMA_LABEL: Record<PromptUnit["schema"], string> = {
  PHOTO: "Foto",
  TYPO: "Tipografica",
  HYBRID: "Ibrida (foto + testo)",
  UI_MOCK: "Mockup UI",
};

const PREVIEW_SCALE = 0.2;

function TypoPreview({ t }: { t: NonNullable<PromptUnit["typographic"]>[number] }) {
  const w = Math.round(t.spec.width * PREVIEW_SCALE);
  const h = Math.round(t.spec.height * PREVIEW_SCALE);
  return (
    <div style={{ marginTop: 10 }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
        <b>
          Formato {t.format} · <span style={{ opacity: 0.7 }}>render tipografico</span>
        </b>
        <CopyButton text={t.html} label="Copia HTML" />
      </div>
      <div className="row" style={{ alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: w, height: h, flex: "0 0 auto", overflow: "hidden",
            borderRadius: 8, border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <iframe
            title={`preview-${t.format}`}
            srcDoc={t.html}
            sandbox=""
            scrolling="no"
            style={{
              width: t.spec.width, height: t.spec.height, border: 0,
              transform: `scale(${PREVIEW_SCALE})`, transformOrigin: "top left",
            }}
          />
        </div>
        <div className="small" style={{ opacity: 0.75, flex: 1 }}>
          Testo <b>renderizzato esatto</b> dalla palette: nessun modello immagine, nessun
          errore di ortografia. Salva l'HTML ed esportalo in PNG {t.spec.width}×{t.spec.height}.
        </div>
      </div>
    </div>
  );
}

function UnitCard({ u }: { u: PromptUnit }) {
  const a = u.archetype;
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 750 }}>
            {u.slide ? `Slide ${u.slide} · ` : ""}
            {u.role} — {a.code} {a.name}
          </div>
          <div className="small" style={{ opacity: 0.8, marginTop: 2 }}>
            {a.angle} · {a.copyRequired}
          </div>
        </div>
        <div className="row" style={{ gap: 6, flex: "0 0 auto" }}>
          <span className="tag" data-schema={u.schema}>Schema {u.schema} · {SCHEMA_LABEL[u.schema]}</span>
          <span className="tag">Fam. {a.family}</span>
        </div>
      </div>

      {Object.keys(u.onImage).length > 0 && (
        <div className="kv" style={{ marginTop: 10 }}>
          <b>Testo on-image:</b>{" "}
          {Object.entries(u.onImage)
            .filter(([, v]) => v && v.trim())
            .map(([k, v]) => `${k}: "${v}"`)
            .join(" · ")}
        </div>
      )}

      {u.prompts.map((p) => (
        <div key={p.format} style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <b>
              Formato {p.format}
              {p.backgroundOnly && (
                <span style={{ opacity: 0.7, fontWeight: 500 }}> · sfondo + layer testo</span>
              )}
            </b>
            <CopyButton text={p.text} />
          </div>
          <pre className="mono" style={{ marginTop: 8 }}>{p.text}</pre>
        </div>
      ))}

      {u.typographic?.map((t) => (
        <TypoPreview key={`typo-${t.format}`} t={t} />
      ))}

      {u.checklist.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="small" style={{ opacity: 0.7, marginBottom: 4 }}>Validazione</div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            {u.checklist.map((ci, i) => (
              <li key={i} className="small" style={{ color: ci.ok ? "var(--muted)" : "#ffb4b4" }}>
                {ci.ok ? "✓" : "✗"} {ci.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ImagePromptPage() {
  const [copy, setCopy] = useState(SAMPLE);
  const [formats, setFormats] = useState<PromptFormat[]>(["1:1"]);
  const [family, setFamily] = useState<Family>("B");
  const [archetypeCode, setArchetypeCode] = useState<string>(""); // "" = auto
  const [goal, setGoal] = useState<Goal>("leads");
  const [contentType, setContentType] = useState<ContentType>("static");
  const [slides, setSlides] = useState(3);
  const [model, setModel] = useState<Model>("nano-banana");
  const [palette, setPalette] = useState<Palette>({
    text: "#0B2545",
    cta: "#2E7D32",
    background: "#F2F4F8",
    accent: "#E8871E",
  });
  const [logo, setLogo] = useState<Logo | undefined>(undefined);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const familyArchetypes = useMemo(() => archetypesByFamily(family), [family]);

  function toggleFormat(f: PromptFormat) {
    setFormats((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
  }

  function onLogo(file?: File) {
    if (!file) {
      setLogo(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo({ name: file.name, dataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  function onGenerate() {
    setErr(null);
    if (copy.trim().length < 5) {
      setErr("Incolla prima il copy dell'inserzione.");
      return;
    }
    if (formats.length === 0) {
      setErr("Seleziona almeno un formato.");
      return;
    }
    setResult(
      generate({
        copy,
        formats,
        family,
        archetypeCode: archetypeCode || undefined,
        goal,
        contentType,
        slides,
        model,
        palette,
        logo,
      })
    );
  }

  return (
    <main className="grid" style={{ gap: 16 }}>
      <div className="card">
        <div style={{ fontSize: 16, fontWeight: 750 }}>Image Prompt Generator</div>
        <div className="small" style={{ opacity: 0.8, marginTop: 4 }}>
          Dato un <b>copy</b>, imposti i parametri e ottieni il/i <b>prompt</b>. L'archetipo
          seleziona lo <b>schema</b> (PHOTO / TYPO / HYBRID / UI_MOCK) — prompt con campi diversi —
          con <b>layoutSpec</b> a zone riflowata per formato, stringhe on-image letterali e
          validazione. Solo statiche (immagine singola o carosello). Basato sul Manuale delle
          Statiche (6 famiglie, 24 archetipi).
        </div>
      </div>

      <div className="grid grid2">
        {/* ---------------- INPUT ---------------- */}
        <div className="card">
          <label>Copy dell'inserzione</label>
          <textarea value={copy} onChange={(e) => setCopy(e.target.value)} style={{ minHeight: 150 }} />

          {err && <div className="error" style={{ marginTop: 12 }}>{err}</div>}

          {/* Formato */}
          <div style={{ marginTop: 14 }}>
            <label>Formato</label>
            <div className="row">
              {FORMATS.map((f) => (
                <label
                  key={f}
                  className="pill"
                  data-active={formats.includes(f)}
                  style={{ cursor: "pointer", display: "flex", gap: 6, alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={formats.includes(f)}
                    onChange={() => toggleFormat(f)}
                    style={{ width: "auto" }}
                  />
                  {f} <span className="small" style={{ opacity: 0.6 }}>({FORMAT_SPECS[f].px})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Famiglia + Archetipo */}
          <div className="row" style={{ marginTop: 14, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label>Famiglia (Manuale)</label>
              <select
                value={family}
                onChange={(e) => {
                  setFamily(e.target.value as Family);
                  setArchetypeCode("");
                }}
              >
                {FAMILIES.map((f) => (
                  <option key={f} value={f}>
                    {f} — {FAMILY_LABELS[f]}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label>Archetipo</label>
              <select value={archetypeCode} onChange={(e) => setArchetypeCode(e.target.value)}>
                <option value="">Auto (dal copy)</option>
                {familyArchetypes.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="small" style={{ opacity: 0.65, marginTop: 6 }}>
            {FAMILY_DESC[family]}
          </div>

          {/* Scopo */}
          <div style={{ marginTop: 14 }}>
            <label>Scopo</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {GOAL_LABELS[g]}
                </option>
              ))}
            </select>
          </div>

          {/* Tipologia */}
          <div className="row" style={{ marginTop: 14, alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label>Tipologia</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
              >
                <option value="static">Immagine statica</option>
                <option value="carousel">Carosello</option>
              </select>
            </div>
            {contentType === "carousel" && (
              <div style={{ flex: "0 0 120px" }}>
                <label>N° slide</label>
                <select value={slides} onChange={(e) => setSlides(Number(e.target.value))}>
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Modello */}
          <div style={{ marginTop: 14 }}>
            <label>Modello di generazione</label>
            <select value={model} onChange={(e) => setModel(e.target.value as Model)}>
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {MODEL_LABELS[m]}
                </option>
              ))}
            </select>
            <div className="small" style={{ opacity: 0.7, marginTop: 6 }}>
              {MODEL_HINT[model]}
            </div>
          </div>

          {/* Palette */}
          <div style={{ marginTop: 14 }}>
            <label>Palette colori</label>
            <div className="row">
              {([
                ["text", "Testo"],
                ["cta", "CTA/accento"],
                ["background", "Sfondo"],
                ["accent", "Secondario"],
              ] as const).map(([key, lbl]) => (
                <div key={key} style={{ flex: "1 1 90px" }}>
                  <div className="small" style={{ opacity: 0.7, marginBottom: 4 }}>{lbl}</div>
                  <input
                    type="color"
                    value={(palette[key] as string) || "#000000"}
                    onChange={(e) => setPalette((p) => ({ ...p, [key]: e.target.value }))}
                    style={{ height: 38, padding: 2 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div style={{ marginTop: 14 }}>
            <label>Logo da allegare</label>
            <input type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0])} />
            {logo && (
              <div className="row" style={{ marginTop: 8, gap: 8 }}>
                {logo.dataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo.dataUrl} alt="logo" style={{ height: 28, borderRadius: 6 }} />
                )}
                <span className="small">{logo.name}</span>
                <button className="btn" onClick={() => setLogo(undefined)} style={{ padding: "4px 10px" }}>
                  Rimuovi
                </button>
              </div>
            )}
          </div>

          <div className="row" style={{ marginTop: 16, justifyContent: "flex-end" }}>
            <button className="btn btnPrimary" onClick={onGenerate}>
              Genera prompt →
            </button>
          </div>
          <div className="small" style={{ opacity: 0.6, marginTop: 10 }}>
            Tutto calcolato in locale, nessuna chiamata esterna. Il logo resta nel browser: nel
            prompt viene indicato dove posizionarlo.
          </div>
        </div>

        {/* ---------------- OUTPUT ---------------- */}
        <div className="grid" style={{ alignContent: "start" }}>
          {!result && (
            <div className="card small" style={{ opacity: 0.8 }}>
              Imposta i parametri e premi <b>Genera prompt</b>. Per una statica ottieni un prompt per
              formato; per un carosello, un prompt per ogni slide.
            </div>
          )}

          {result && (
            <>
              {result.units.map((u, i) => (
                <UnitCard key={i} u={u} />
              ))}
              <div className="warn">
                <b>Nota.</b> {result.note}
              </div>
            </>
          )}
        </div>
      </div>

      <details className="card">
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>
          Catalogo archetipi ({ARCHETYPES.length}) ▾
        </summary>
        <div className="grid grid2" style={{ marginTop: 12 }}>
          {FAMILIES.map((fam) => (
            <div key={fam} className="card" style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Famiglia {fam} — {FAMILY_LABELS[fam]}
              </div>
              <ul className="small" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                {archetypesByFamily(fam).map((a) => (
                  <li key={a.code}>
                    <b>{a.code} {a.name}</b> <span style={{ opacity: 0.7 }}>— {a.copyRequired}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </main>
  );
}
