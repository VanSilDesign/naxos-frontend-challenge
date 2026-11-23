## Naxos Frontend Challenge

# Prima di iniziare

1. Cosa farei per primo: Imposterei il flusso dati base — recupero dei post da /posts con gestione esplicita degli stati di loading, error e success, seguito da un form controllato con validazione immediata.
2. Cosa ritengo più importante: La chiarezza dell'esperienza utente: feedback visivi puntuali (errori leggibili, stato di invio, conferma di aggiunta) e un'interfaccia ordinata dove la ricerca/filtro si integri senza appesantire il flusso.
3. Dubbi e assunzioni: Poiché JSONPlaceholder non persiste realmente i nuovi post via POST, assumo di simulare/eseguire la chiamata mantenendo l'aggiornamento nello stato locale per dare riscontro immediato all'utente; inoltre, ho scelto di lavorare su una repository dedicata partendo dalla traccia per avere pieno controllo su setup e commit.

