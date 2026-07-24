"use client";

import { useMemo, useState } from "react";
import {
  ARCHETYPES,
  FAMILY_LABELS,
  STYLE_PROFILES,
  generate,
  getStyleProfile,
} from "../../lib/imagePrompt";
import type {
  Creative,
  FormatPrompt,
  GenerateResult,
  StyleProfile,
} from "../../lib/imagePrompt";

const SAMPLE = `Tre ortopedici mi avevano già fissato la data dell'operazione. Non mi sono operato.
Avevo dolore alla spalla da mesi, non riuscivo più a giocare a tennis.
Grazie al percorso del Shoulder Center oggi sono tornato in campo, senza intervento.`;

function CopyButton({ text }: { text: string }) {
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
      {ok ? "Copiato ✓" : "Copia"}
    </button>
  );
}

function FormatBlock({ p }: { p: FormatPrompt }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <b>Formato {p.format}</b>
        <CopyButton text={p.full} />
      </div>
      <pre className="mono" style={{ marginTop: 8 }}>{p.full}</pre>
    </div>
  );
}

function CreativeCard({ c, index }: { c: Creative; index: number }) {
  const a = c.archetype;
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 750 }}>
            Statica {index + 1} — Archetipo {a.code} {a.name}
          </div>
          <div className="small" style={{ opacity: 0.8, marginTop: 2 }}>
            {c.reason}.
          </div>
        </div>
        <span className="tag">
          Fam. {a.family} · {FAMILY_LABELS[a.family]}
        </span>
      </div>

      <div className="kv" style={{ marginTop: 10 }}>
        <b>Overlay dominante:</b> “{c.overlay}”
      </div>

      {Object.values(c.prompts).map((p) => (
        <FormatBlock key={p.format} p={p} />
      ))}
    </div>
  );
}

export default function ImagePromptPage() {
  const [copy, setCopy] = useState(SAMPLE);
  const [profileId, setProfileId] = useState(STYLE_PROFILES[0].id);
  const [profile, setProfile] = useState<StyleProfile>(() => ({ ...STYLE_PROFILES[0] }));
  const [maxVariants, setMaxVariants] = useState(3);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const px = useMemo(() => ({ "1:1": "1080×1080", "9:16": "1080×1920" }), []);

  function applyProfile(id: string) {
    setProfileId(id);
    setProfile({ ...getStyleProfile(id) });
  }

  function updateProfile(patch: Partial<StyleProfile>) {
    setProfile((p) => ({ ...p, ...patch }));
  }

  function onGenerate() {
    setResult(generate({ copy, profile, maxVariants }));
  }

  return (
    <main className="grid" style={{ gap: 16 }}>
      <div className="card">
        <div style={{ fontSize: 16, fontWeight: 750 }}>Image Prompt Generator</div>
        <div className="small" style={{ opacity: 0.8, marginTop: 4 }}>
          Da un <b>copy Meta già scritto</b> + profilo stile cliente → archetipo assegnato e
          prompt a blocchi (Subject / Context / Photo Aesthetics / Text Overlay / Layout /
          Directive) per <b>Gemini (Nano Banana)</b> o ChatGPT, nei formati 1:1 e 9:16.
          <br />
          <span style={{ opacity: 0.8 }}>
            Solo <b>immagini statiche</b> (nessun video): anche da un copy lungo il tool ricava
            più statiche distinte, mai una VSL.
          </span>
        </div>
      </div>

      <div className="grid grid2">
        {/* Colonna input */}
        <div className="card">
          <label>Copy dell'inserzione (già scritto)</label>
          <textarea
            value={copy}
            onChange={(e) => setCopy(e.target.value)}
            style={{ minHeight: 180 }}
            placeholder="Incolla qui il copy Meta già scritto…"
          />

          <div style={{ marginTop: 14 }}>
            <label>Profilo stile cliente (estratto dalla landing)</label>
            <select value={profileId} onChange={(e) => applyProfile(e.target.value)}>
              {STYLE_PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="small" style={{ opacity: 0.7, marginTop: 6 }}>
              Puoi personalizzare i campi qui sotto: sono riusati in ogni prompt.
            </div>
          </div>

          <details style={{ marginTop: 12 }}>
            <summary className="small" style={{ cursor: "pointer" }}>
              Campi profilo stile ▾
            </summary>
            <div className="grid" style={{ marginTop: 10 }}>
              <div>
                <label>Subject (EN)</label>
                <textarea
                  value={profile.subject}
                  onChange={(e) => updateProfile({ subject: e.target.value })}
                  style={{ minHeight: 60 }}
                />
              </div>
              <div>
                <label>Context (EN)</label>
                <textarea
                  value={profile.context}
                  onChange={(e) => updateProfile({ context: e.target.value })}
                  style={{ minHeight: 60 }}
                />
              </div>
              <div>
                <label>Photo Aesthetics (EN)</label>
                <textarea
                  value={profile.photoAesthetics}
                  onChange={(e) => updateProfile({ photoAesthetics: e.target.value })}
                  style={{ minHeight: 70 }}
                />
              </div>
              <div className="row">
                <div style={{ flex: "1 1 120px" }}>
                  <label>Colore testo</label>
                  <input
                    value={profile.palette.text}
                    onChange={(e) =>
                      updateProfile({ palette: { ...profile.palette, text: e.target.value } })
                    }
                  />
                </div>
                <div style={{ flex: "1 1 120px" }}>
                  <label>Colore CTA/badge</label>
                  <input
                    value={profile.palette.cta}
                    onChange={(e) =>
                      updateProfile({ palette: { ...profile.palette, cta: e.target.value } })
                    }
                  />
                </div>
                <div style={{ flex: "1 1 120px" }}>
                  <label>Colore accento</label>
                  <input
                    value={profile.palette.accent}
                    onChange={(e) =>
                      updateProfile({ palette: { ...profile.palette, accent: e.target.value } })
                    }
                  />
                </div>
              </div>
              <div>
                <label>Momento narrativo (EN)</label>
                <textarea
                  value={profile.moment}
                  onChange={(e) => updateProfile({ moment: e.target.value })}
                  style={{ minHeight: 50 }}
                />
              </div>
              <div>
                <label>Vincoli negativi (EN)</label>
                <textarea
                  value={profile.negatives}
                  onChange={(e) => updateProfile({ negatives: e.target.value })}
                  style={{ minHeight: 60 }}
                />
              </div>
            </div>
          </details>

          <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
            <div style={{ flex: "0 0 auto" }}>
              <label style={{ marginBottom: 2 }}>Max varianti (copy lungo)</label>
              <select
                value={maxVariants}
                onChange={(e) => setMaxVariants(Number(e.target.value))}
                style={{ width: 90 }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <button className="btn btnPrimary" onClick={onGenerate}>
              Genera prompt →
            </button>
          </div>
          <div className="small" style={{ opacity: 0.6, marginTop: 10 }}>
            Formati: 1:1 ({px["1:1"]}) · 9:16 ({px["9:16"]}). Tutto calcolato in locale, nessuna
            chiamata esterna.
          </div>
        </div>

        {/* Colonna output */}
        <div className="grid" style={{ alignContent: "start" }}>
          {!result && (
            <div className="card small" style={{ opacity: 0.8 }}>
              Incolla un copy e premi <b>Genera prompt</b>. Il tool estrae i punti d'attacco,
              classifica l'archetipo e compila i prompt a blocchi per i due formati.
            </div>
          )}

          {result && (
            <>
              <div className="card">
                <div style={{ fontWeight: 750, marginBottom: 8 }}>Punti d'attacco estratti</div>
                <div className="kv">
                  <div>
                    <b>Headline:</b> {result.attackPoints.headline || "—"}
                  </div>
                  {result.attackPoints.quote && (
                    <div>
                      <b>Quote:</b> “{result.attackPoints.quote}”
                    </div>
                  )}
                  {result.attackPoints.proof && (
                    <div>
                      <b>Prova/numero:</b> {result.attackPoints.proof}
                    </div>
                  )}
                  {result.attackPoints.benefit && (
                    <div>
                      <b>Beneficio:</b> {result.attackPoints.benefit}
                    </div>
                  )}
                  {result.attackPoints.objection && (
                    <div>
                      <b>Obiezione:</b> {result.attackPoints.objection}
                    </div>
                  )}
                  {result.attackPoints.voice && (
                    <div>
                      <b>Voce narrante:</b> {result.attackPoints.voice}
                    </div>
                  )}
                </div>
              </div>

              {result.creatives.map((c, i) => (
                <CreativeCard key={i} c={c} index={i} />
              ))}

              <div className="warn">
                <b>Nota set.</b> {result.setNote}
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
          {(["A", "B", "C", "D", "E", "F"] as const).map((fam) => (
            <div key={fam} className="card" style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Famiglia {fam} — {FAMILY_LABELS[fam]}
              </div>
              <ul className="small" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                {ARCHETYPES.filter((a) => a.family === fam).map((a) => (
                  <li key={a.code}>
                    <b>
                      {a.code} {a.name}
                    </b>
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
