import "./globals.css";

export const metadata = {
  title: "Meta Creative Studio",
  description: "MVP per generare immagini e video animati per inserzioni Meta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <div className="container">
          <header className="row" style={{justifyContent:"space-between", gap:12}}>
            <div>
              <div style={{fontSize:18, fontWeight:700}}>Meta Creative Studio</div>
              <div className="small">Wizard per creare creatività (immagini + video)</div>
            </div>
            <nav className="row top">
              <a className="pill" href="/">Wizard</a>
              <a className="pill" href="/image-prompt">Prompt immagini</a>
              <a className="pill" href="https://www.facebook.com/business/help" target="_blank" rel="noreferrer">
                Specs Meta
              </a>
            </nav>
          </header>
          <hr/>
          {children}
          <hr/>
          <footer className="small" style={{opacity:0.75}}>
            Suggerimento: per testare i video, installa <b>ffmpeg</b> nel tuo ambiente.
          </footer>
        </div>
      </body>
    </html>
  );
}
