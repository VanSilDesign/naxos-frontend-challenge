import { useEffect, useState } from "react";
import { fetchPosts } from "./api/postsApi";
import PostFilters from "./components/PostFilters.jsx";
import PostList from "./components/PostList.jsx";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialPosts() {
      try {
        const data = await fetchPosts(controller.signal);

        if (!controller.signal.aborted) {
          setPosts(data);
          setError(null);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setError(
            err.message ||
              "Si è verificato un errore imprevisto durante il caricamento.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialPosts();

    return () => controller.abort();
  }, []);

  async function handleRetry() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      setError(
        err.message ||
          "Si è verificato un errore imprevisto durante il caricamento.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPosts = normalizedQuery
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.body.toLowerCase().includes(normalizedQuery),
      )
    : posts;

  let mainContent;
  if (isLoading) {
    mainContent = <p>Caricamento in corso...</p>;
  }

  if (error) {
    mainContent = (
      <div>
        <p>{error}</p>
        <button type="button" onClick={handleRetry}>
          Riprova
        </button>
      </div>
    );
  }

  if (!isLoading && !error) {
    mainContent = (
      <section>
        <PostFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          disabled={isLoading || Boolean(error)}
        />
        <p>
          Post caricati: {filteredPosts.length}
          {normalizedQuery ? ` su ${posts.length}` : ""}
        </p>
        <PostList
          posts={filteredPosts}
          hasActiveSearch={Boolean(normalizedQuery)}
          onClearSearch={() => setSearchQuery("")}
        />
      </section>
    );
  }

  return (
    <>
      <header className="main-header">
        <h2>Posts:</h2>
        <p>Esplora i nostri contenuti</p>
      </header>

      <main>
        {mainContent}
        <section></section>
      </main>
    </>
  );
}

export default App;
