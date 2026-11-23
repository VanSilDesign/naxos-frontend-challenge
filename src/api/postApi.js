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

  return response.json();
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
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title: title.trim(),
      body: body.trim(),
      userId,
    }),
  });
  
  if (!response.ok) {
    throw new Error(
      `Errore durante la pubblicazione del post (HTTP status: ${response.status})`,
    );
  }

  const createdPost = response.json();
  const lastIdPost = existingPosts.reduce((max, post) =>
    Math.max(max, Number(post.id) || 0, 100),
  ); /* Cerco il massimo id tra i post */

  return {
    ...createdPost,
    id: lastIdPost + 1,
    userId,
    isLocal: true,
  };
}
