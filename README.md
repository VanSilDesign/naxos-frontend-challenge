# Naxos Frontend Challenge

Applicazione React + Vite per esplorare i post recuperati da JSONPlaceholder, filtrarli in tempo reale e creare nuovi post tramite finestra modale con validazione dei campi.

## Prima di iniziare

1. **Cosa farei per primo:** Imposterei il flusso dati base — recupero dei post da `/posts` con gestione esplicita degli stati di `loading`, `error` e `success`, seguito da un form controllato con validazione immediata.
2. **Cosa ritengo più importante:** La chiarezza dell'esperienza utente: feedback visivi puntuali (errori leggibili, stato di invio, conferma di aggiunta) e un'interfaccia ordinata dove la ricerca/filtro si integri senza appesantire il flusso.
3. **Dubbi e assunzioni:** Poiché JSONPlaceholder non persiste realmente i nuovi post via `POST`, assumo di eseguire la chiamata mantenendo l'aggiornamento nello stato locale per dare riscontro immediato all'utente; inoltre, ho scelto di lavorare su una repository dedicata partendo dalla traccia per avere pieno controllo su setup e commit.

## Durante lo sviluppo

- Ho provato inizialmente a gestire il flusso di creazione affidandomi direttamente alla risposta della `POST` verso l'API mock, ma un disallineamento tra i dati inviati dal form, l'helper API e lo stato locale (unito all'assenza di persistenza reale lato server di JSONPlaceholder) mi ha portato a consolidare l'aggiornamento dei nuovi post direttamente nello stato locale di sessione.

## Cosa è stato realizzato

- **Fetch iniziale, gestione errori e retry (`src/api/postsApi.js`, `src/App.jsx`):** Recupero dei post tramite `GET /posts` con supporto ad `AbortController` in `useEffect` per evitare aggiornamenti di stato su componenti smontati, gestione esplicita degli stati di caricamento ed errore e pulsante **Riprova** per rilanciare la chiamata.
- **Ricerca e stati vuoti (`src/components/PostFilters.jsx`, `src/components/PostList.jsx`):** Filtro case-insensitive su titolo e corpo del post, pulsante rapido per azzerare la ricerca e distinzione tra elenco vuoto e ricerca senza corrispondenze.
- **Creazione post in modale (`src/components/Modal.jsx`, `src/components/PostForm.jsx`):** Finestra modale basata sull'elemento nativo `<dialog>` (`showModal()` / `close()`) con `aria-labelledby`, chiusura tramite pulsante, click sul backdrop o tasto `Escape`, e form con validazione lato client (`aria-invalid`, `aria-describedby` e messaggi d'errore con `role="alert"`).
- **Gestione dati mock e ID locali:** Poiché JSONPlaceholder non persiste realmente i nuovi record sul server e restituisce sempre `id: 101` per le `POST`, i nuovi post vengono creati con `userId: 11`, un `id` intero incrementale calcolato a partire dal massimo ID presente (`Math.max` con valore iniziale `100` in caso di array vuoto) e contrassegnati con `isLocal: true` per distinguerli visivamente in sessione.
- **Layout e stile:** Impostazione responsiva con CSS Flexbox e CSS Grid e fogli di stile dedicati per i componenti principali.

## Scelte tecniche, debug e compromessi

- **Modale per il form di creazione:** Spostare `PostForm` in un modale mantiene il focus sul feed principale e sulla ricerca, a fronte di una leggera complessità in più nella gestione apertura/chiusura e accessibilità rispetto a un form sempre visibile in pagina.
- **Stato locale in memoria (senza persistenza esterna):** I post creati restano nello stato React della sessione corrente. È un compromesso consapevole per rispettare il perimetro della challenge ed evitare backend o storage aggiuntivi non richiesti.
- **Debug e iterazione:** Durante lo sviluppo sono emersi alcuni intoppi classici (come `await` mancante su `response.json()`, `return` implicito/esplicito in `.map()`, inizializzazione di `nextErrors` come array anziché oggetto e struttura del modale) risolti iterativamente verificando il comportamento a runtime.
- **Nota sui tempi:** La traccia indicava una durata indicativa di 90 minuti; ho preferito dedicare il tempo necessario a completare il flusso, curare i casi limite, rifinire le parti essenziali e controllare l'accessibilità piuttosto che fermarmi a una bozza incompleta.

## Cosa vorrei poter fare di più (prossimi step)

- Aggiungere un messaggio di conferma visivo temporaneo (es. toast/banner) alla pubblicazione di un nuovo post e un focus management più completo all'apertura/chiusura del modale (ritorno del focus sul pulsante trigger).
- Inserire una persistenza locale opzionale (es. `localStorage`) o un dataset di fallback in caso di indisponibilità della rete.
- Migliorare ulteriormente la rifinitura UI/CSS, i test automatizzati (unit/component tests su filtro, validazione form e stati di errore/retry) e l'aggiunta di una vista di dettaglio dei post, con la relativa possibilità di modificare o eliminare il post stesso.
- Aggiungere elementi di Graphic Design al progetto (come logo, icone e immagini), dopotutto anche l'occhio vuole la sua parte.

## Utilizzo di Gemini nello sviluppo

Durante la realizzazione del progetto ho utilizzato **Gemini** come supporto iterativo per:
- discutere l'impostazione dell'architettura dei componenti e le scelte di UX (come l'uso del modale e la gestione degli stati vuoti/errore);
- individuare e correggere bug durante il debug (gestione asincrona delle `Promise`, rendering delle liste, validazione del form, struttura del modale);
- risolvere dettagli di accessibilità e stile come la classe `.sr-only` e la personalizzazione dell'outline in `:focus-visible` per gli input;
- sintetizzare la discussione per punti per facilitare l'organizzazione di questo README.

Le decisioni finali, la grafica della pagina, l'integrazione nel codice, la verifica del funzionamento e i test di accessibilità in locale sono stati seguiti e validati direttamente da me.