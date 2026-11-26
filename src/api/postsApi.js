const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

/**
 * Recupera l'elenco dei post dall'API pubblica.
 * Accetta un AbortSignal opzionale per evitare aggiornamenti di stato su componenti smontati.
 */

export async function fetchPosts(signal) {
  const response = await fetch(BASE_URL, { signal });

  if (!response.ok) {
    throw new Error(
      `Impossibile recuperare i dati. (HTTP status: ${response.status})`,
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Invia una richiesta POST per creare un nuovo post.
 * Nota: JSONPlaceholder simula la creazione (risponde 201 con id: 101) senza persistere sul server.
 * Utilizzo nuovo userId per non creare confusione.
 */

export async function createPost({
  title,
  body,
  userId = 11,
  existingPosts = [],
}) {
  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title: trimmedTitle,
      body: trimmedBody,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Errore durante la pubblicazione del post (HTTP status: ${response.status})`,
    );
  }

  const createdPost = await response.json();
  const lastIdPost = existingPosts.reduce(
    (max, post) => Math.max(max, Number(post.id) || 0),
    100,
  );

  return {
    ...createdPost,
    id: lastIdPost + 1,
    userId,
    isLocal: true,
  };
}
