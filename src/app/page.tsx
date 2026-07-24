"use client";

import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import type { Aspect, Brief, OutputKind, VideoDuration } from "../lib/types";
import { aspectToPixels } from "../lib/aspects";
import { templates } from "../lib/templates";
import { renderBriefToCanvas } from "../lib/renderCanvas";

const Step1Schema = z.object({
  kind: z.enum(["image","video"]),
  idea: z.string().min(5, "Scrivi almeno 5 caratteri"),
  aspect: z.enum(["1:1","4:5","9:16","16:9"]),
  duration: z.enum(["<5","6-30","30-60"]).optional(),
});

function defaultBrief(): Brief {
  const aspect: Aspect = "1:1";
  const px = aspectToPixels[aspect];
  return {
    kind: "image",
    idea: "",
    aspect,
    width: px.w,
    height: px.h,
    duration: "<5",
    includeHeadline: true,
    includeBody: true,
    includeBullets: true,
    includeCTA: true,
    templateId: templates[0].id,
    headline: "Hook qui (max chiaro)",
    body: "Una riga che spiega il beneficio principale senza giri di parole.",
    bullets: ["Benefit #1", "Benefit #2", "Benefit #3"],
    cta: "Scopri di più",
    attachments: [],
  };
}

export default function Page() {
  const [step, setStep] = useState<1|2>(1);
  const [err, setErr] = useState<string | null>(null);
  const [brief, setBrief] = useState<Brief>(() => defaultBrief());
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBusy, setVideoBusy] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const px = useMemo(() => aspectToPixels[brief.aspect], [brief.aspect]);

  function applyAspect(aspect: Aspect) {
    const p = aspectToPixels[aspect];
    setBrief(b => ({ ...b, aspect, width: p.w, height: p.h }));
  }

  function onNext() {
    setErr(null);
    const parsed = Step1Schema.safeParse({
      kind: brief.kind,
      idea: brief.idea,
      aspect: brief.aspect,
      duration: brief.kind === "video" ? brief.duration : undefined,
    });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Dati non validi");
      return;
    }
    setStep(2);
    // refresh preview
    requestAnimationFrame(() => {
      if (canvasRef.current) renderBriefToCanvas(canvasRef.current, brief);
    });
  }

  function onBack() {
    setStep(1);
    setVideoUrl(null);
    setErr(null);
  }

  function updatePreview(next: Partial<Brief>) {
    setBrief(prev => {
      const merged = { ...prev, ...next };
      // re-render canvas (if in step 2)
      requestAnimationFrame(() => {
        if (canvasRef.current && step === 2) renderBriefToCanvas(canvasRef.current, merged);
      });
      return merged;
    });
  }

  function downloadPng() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `creative_${brief.aspect.replace(":","x")}_${uuidv4().slice(0,8)}.png`;
    a.click();
  }

  async function generateVideo() {
    setErr(null);
    setVideoUrl(null);
    setVideoBusy(true);
    try{
      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aspect: brief.aspect,
          duration: brief.duration,
          headline: brief.includeHeadline ? (brief.headline ?? "") : "",
          body: brief.includeBody ? (brief.body ?? "") : "",
          bullets: brief.includeBullets ? (brief.bullets ?? []) : [],
          cta: brief.includeCTA ? (brief.cta ?? "") : "",
          templateId: brief.templateId,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Errore generazione video");
      setVideoUrl(data.url);
    } catch(e:any){
      setErr(e?.message ?? "Errore");
    } finally {
      setVideoBusy(false);
    }
  }

  return (
    <main className="grid" style={{gap:16}}>
      {step === 1 && (
        <div className="grid grid2">
          <div className="card">
            <div style={{fontSize:16, fontWeight:750, marginBottom:8}}>Step 1 — Brief</div>
            <div className="small" style={{marginBottom:14, opacity:0.8}}>
              Inserisci l’idea, scegli output e formato. Gli allegati qui sono solo “contesto” per l’MVP.
            </div>

            {err && <div className="error" style={{marginBottom:12}}>{err}</div>}

            <div className="grid">
              <div className="row">
                <div style={{flex:"1 1 220px"}}>
                  <label>Tipo output</label>
                  <select value={brief.kind} onChange={(e)=> updatePreview({ kind: e.target.value as OutputKind })}>
                    <option value="image">Immagine</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div style={{flex:"1 1 220px"}}>
                  <label>Formato</label>
                  <select value={brief.aspect} onChange={(e)=> applyAspect(e.target.value as Aspect)}>
                    <option value="1:1">1:1</option>
                    <option value="4:5">4:5</option>
                    <option value="9:16">9:16</option>
                    <option value="16:9">16:9</option>
                  </select>
                </div>
                {brief.kind === "video" && (
                  <div style={{flex:"1 1 220px"}}>
                    <label>Durata</label>
                    <select value={brief.duration} onChange={(e)=> updatePreview({ duration: e.target.value as VideoDuration })}>
                      <option value="<5">&lt; 5 secondi</option>
                      <option value="6-30">6–30 secondi</option>
                      <option value="30-60">30–60 secondi</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label>Idea (prompt)</label>
                <textarea value={brief.idea} onChange={(e)=> updatePreview({ idea: e.target.value })} placeholder="Es: promo natalizia su lampade unghie, tono premium, focus spedizione entro 19 dicembre..." />
              </div>

              <div>
                <label>Allegati (MVP)</label>
                <input type="file" multiple onChange={(e)=>{
                  const files = Array.from(e.target.files ?? []);
                  updatePreview({ attachments: files.map(f => ({ name: f.name, size: f.size, type: f.type })) });
                }} />
                {brief.attachments?.length ? (
                  <div className="small" style={{marginTop:8, opacity:0.85}}>
                    Allegati: {brief.attachments.map(a => a.name).join(", ")}
                  </div>
                ) : (
                  <div className="small" style={{marginTop:8, opacity:0.75}}>
                    Nessun allegato.
                  </div>
                )}
              </div>

              <div className="row" style={{justifyContent:"space-between"}}>
                <div className="small">Output px: <b>{px.w}×{px.h}</b></div>
                <button className="btn btnPrimary" onClick={onNext}>Vai a Step 2 →</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{fontSize:16, fontWeight:750, marginBottom:8}}>Suggerimenti rapidi</div>
            <ul className="small" style={{lineHeight:1.55, opacity:0.9, marginTop:8}}>
              <li>Scrivi l’idea come: <b>cosa</b> + <b>per chi</b> + <b>beneficio</b> + <b>prova</b> + <b>CTA</b>.</li>
              <li>Se fai video, pensa a: <b>hook → prova → offerta → CTA</b>.</li>
              <li>In Step 2 puoi “spegnere” blocchi (bullet/CTA ecc.).</li>
            </ul>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid2">
          <div className="card">
            <div className="row" style={{justifyContent:"space-between", alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:16, fontWeight:750}}>Step 2 — Template & overlay</div>
                <div className="small" style={{opacity:0.8}}>Scegli un template e personalizza gli elementi.</div>
              </div>
              <div className="row">
                <button className="btn" onClick={onBack}>← Indietro</button>
                <button className="btn btnPrimary" onClick={downloadPng}>Scarica PNG</button>
              </div>
            </div>

            {err && <div className="error" style={{marginTop:12}}>{err}</div>}

            <div style={{marginTop:14}}>
              <label>Template</label>
              <div className="grid grid2">
                {templates.map(t => (
                  <div
                    key={t.id}
                    className="templateTile"
                    data-active={brief.templateId === t.id}
                    onClick={() => updatePreview({ templateId: t.id })}
                    role="button"
                    tabIndex={0}
                  >
                    <div style={{fontWeight:700}}>{t.name}</div>
                    <div className="small" style={{opacity:0.75}}>{t.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr/>

            <div className="grid">
              <div className="row">
                <label style={{margin:0}}>Elementi</label>
                <span className="small" style={{opacity:0.75}}>disattiva ciò che non vuoi</span>
              </div>

              <div className="grid grid2">
                <div className="card" style={{padding:12}}>
                  <div className="row" style={{justifyContent:"space-between"}}>
                    <b>Intestazione</b>
                    <input type="checkbox" checked={brief.includeHeadline} onChange={(e)=> updatePreview({ includeHeadline: e.target.checked })} />
                  </div>
                  <div style={{marginTop:10}}>
                    <input value={brief.headline ?? ""} onChange={(e)=> updatePreview({ headline: e.target.value })} placeholder="Headline" />
                  </div>
                </div>

                <div className="card" style={{padding:12}}>
                  <div className="row" style={{justifyContent:"space-between"}}>
                    <b>Testo</b>
                    <input type="checkbox" checked={brief.includeBody} onChange={(e)=> updatePreview({ includeBody: e.target.checked })} />
                  </div>
                  <div style={{marginTop:10}}>
                    <textarea value={brief.body ?? ""} onChange={(e)=> updatePreview({ body: e.target.value })} placeholder="Body" />
                  </div>
                </div>

                <div className="card" style={{padding:12}}>
                  <div className="row" style={{justifyContent:"space-between"}}>
                    <b>Bullet Points</b>
                    <input type="checkbox" checked={brief.includeBullets} onChange={(e)=> updatePreview({ includeBullets: e.target.checked })} />
                  </div>
                  <div style={{marginTop:10}} className="grid" >
                    {(brief.bullets ?? []).slice(0,4).map((b,i)=> (
                      <input
                        key={i}
                        value={b}
                        onChange={(e)=>{
                          const next = [...(brief.bullets ?? [])];
                          next[i] = e.target.value;
                          updatePreview({ bullets: next });
                        }}
                        placeholder={`Bullet ${i+1}`}
                      />
                    ))}
                    <button className="btn" onClick={()=>{
                      const next = [...(brief.bullets ?? [])];
                      if (next.length < 4) next.push("Nuovo benefit");
                      updatePreview({ bullets: next });
                    }}>+ Aggiungi bullet</button>
                  </div>
                </div>

                <div className="card" style={{padding:12}}>
                  <div className="row" style={{justifyContent:"space-between"}}>
                    <b>Call To Action</b>
                    <input type="checkbox" checked={brief.includeCTA} onChange={(e)=> updatePreview({ includeCTA: e.target.checked })} />
                  </div>
                  <div style={{marginTop:10}}>
                    <input value={brief.cta ?? ""} onChange={(e)=> updatePreview({ cta: e.target.value })} placeholder="CTA (es: Richiedi info)" />
                  </div>

                  {brief.kind === "video" && (
                    <div style={{marginTop:12}}>
                      <button className="btn btnPrimary" disabled={videoBusy} onClick={generateVideo}>
                        {videoBusy ? "Generazione video..." : "Genera MP4 (ffmpeg)"}
                      </button>
                      <div className="small" style={{marginTop:8, opacity:0.75}}>
                        Se non hai ffmpeg installato, l’API mostrerà un errore.
                      </div>
                    </div>
                  )}

                  {videoUrl && (
                    <div className="success" style={{marginTop:12}}>
                      <div style={{fontWeight:700, marginBottom:8}}>Video pronto</div>
                      <video controls src={videoUrl} style={{width:"100%", borderRadius:12}} />
                      <div className="small" style={{marginTop:8}}>
                        <a href={videoUrl} download>Scarica MP4</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="card">
            <div style={{fontSize:16, fontWeight:750, marginBottom:8}}>Anteprima</div>
            <div className="small" style={{opacity:0.8, marginBottom:12}}>
              Preview renderizzata in Canvas (con safe area). Output PNG: identico.
            </div>
            <div className="previewWrap">
              <canvas ref={canvasRef} />
            </div>

            <div className="row" style={{marginTop:12, justifyContent:"space-between"}}>
              <div className="small">Formato: <b>{brief.aspect}</b> • {brief.width}×{brief.height}</div>
              <button className="btn" onClick={()=>{
                if (canvasRef.current) renderBriefToCanvas(canvasRef.current, brief);
              }}>Aggiorna preview</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
