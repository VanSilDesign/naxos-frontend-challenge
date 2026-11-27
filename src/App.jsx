import { useEffect, useState } from "react";
import { fetchPosts, createPost } from "./api/postsApi";
import PostFilters from "./components/PostFilters.jsx";
import PostList from "./components/PostList.jsx";
import Modal from "./components/Modal.jsx";
import "./App.css";
import PostForm from "./components/PostForm.jsx";

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostModal, setShowModal] = useState(false);

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

  const handleAddPost = async (newPostData) => {
    const createdPost = await createPost({
      title: newPostData.title,
      body: newPostData.body,
      existingPosts: posts,
      userId: 11,
    });

    setPosts((prevPosts) => [createdPost, ...prevPosts]);
    return createdPost;
  };

  const handleShowPostForm = () => {

    if (!showPostModal) setShowModal(true);
  };

  const handleClosePostForm = () => {
    setShowModal(false);
  };

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
      <div className="error-block">
        <p>{error}</p>
        <button type="button" onClick={handleRetry}>
          Riprova
        </button>
      </div>
    );
  }

  if (!isLoading && !error) {
    mainContent = (
      <section className="main-body">
        <div className="post-filter-content">
          <div>
            <PostFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              disabled={isLoading || Boolean(error)}
            />
            <p className="loaded-posts">
              Post caricati: {filteredPosts.length}
              {normalizedQuery ? ` su ${posts.length}` : ""}
            </p>
          </div>

          <div className="post-add-button">
            <button onClick={handleShowPostForm}>Aggiungi Post</button>
          </div>
        </div>
        <div className="post-list-content">
          <PostList
            posts={filteredPosts}
            hasActiveSearch={Boolean(normalizedQuery)}
            onClearSearch={() => setSearchQuery("")}
          />
        </div>
      </section>
    );
  }

  return (
    <>
      <header>
        <div className="main-header">
          <h1>Esplora i nostri contenuti</h1>
        </div>
      </header>

      <main>
        {mainContent}
        <Modal
          isOpen={showPostModal}
          onClose={handleClosePostForm}
          titleId="post-form-title"
        >
          <PostForm
            titleId="post-form-title"
            onAddPost={async (data) => {
              const created = await handleAddPost(data);
              handleClosePostForm();
              return created;
            }}
          />
        </Modal>
      </main>
    </>
  );
}

export default App;
