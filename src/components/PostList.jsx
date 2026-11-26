import "./PostList.css";

export default function PostList({ posts, hasActiveSearch, onClearSearch }) {
  let postContent;

  if (posts.length === 0) {
    if (hasActiveSearch) {
      postContent = (
        <div className="empty-state">
          <p>Nessun post corrisponde alla ricerca inserita.</p>
          {onClearSearch && (
            <button type="button" onClick={onClearSearch}>
              Azzera ricerca
            </button>
          )}
        </div>
      );
    } else {
      postContent = <p>Non ci sono post disponibili al momento.</p>;
    }
  } else {
    postContent = (
      <ul className="post-list">
        {posts.map((post) => {
          return (
            <li key={post.id} className="post-card">
              <span>Autore #{post.userId}</span>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  return <div className="post-content">{postContent}</div>;
}
