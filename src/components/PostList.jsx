export default function PostList({ posts }) {
  let postContent;

  if (posts.length === 0) {
    postContent = <p>Nessun post trovato</p>;
  } else {
    postContent = (
      <ul className="post-list">
        {posts.map((post) => {
          return (
            <li key={post.id} className="post-card">
              <div>
                <span>Autore #{post.userId}</span>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return <div className="post-content">{postContent}</div>;
}
