# AI Image Prompt Tool

Repository dati per il tool di generazione prompt immagine AI per creatività Meta Ads.

## Struttura

/clients/{cliente}/{progetto}/
  config.json      -> parametri del progetto (landing, modello, formati)
    style.json        -> stile estratto dalla landing page (palette, mood, tipo visivo)
      prompts/{id}.json -> storico dei prompt generati, con archetipo e performance_note

      /archetypes/library.json -> libreria condivisa delle famiglie/archetipi (Manuale delle Statiche)

      ## Convenzioni

      - Un cliente può avere più progetti (uno per asset/prodotto da promuovere)
      - L'archetipo si seleziona sempre manualmente, non automaticamente
      - Lo style.json si rigenera solo su richiesta esplicita ("aggiorna stile"), non ad ogni sessione
      - performance_note nei prompt va valorizzato a mano dopo aver visto i risultati in campagna

      ## Stato attuale

      - Struttura repo definita
      - Schema config.json / style.json / prompts/*.json
      - /archetypes/library.json popolato con le 6 famiglie / 24 archetipi reali del Manuale delle Statiche v1.03 (22 core + 2 bonus: Founder Note, Flat lay/Unboxing)
      - Connessione GitHub da configurare
      - Costruire l'interfaccia (React) che legge/scrive questi file via GitHub API
      - Prima integrazione con estrazione stile da landing page

      ## Prossimo passo

      Push di questa struttura sul repo GitHub reale, poi via alla prima versione dell'interfaccia.
      
