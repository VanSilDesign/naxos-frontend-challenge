import "./PostFilters.css";

export default function PostFilter({
  searchQuery,
  onSearchChange,
  disabled = false,
}) {
  return (
    <div className="post-filter">
      <label htmlFor="post-search" className="post-search-label sr-only">
        Cerca post per titolo o contenuto
      </label>
      <div className="post-filter-form">
        <input
          id="post-search"
          type="search"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
          placeholder="Cerca post per titolo o contenuto"
          disabled={disabled}
        />
        {searchQuery && (
          <button
            className="input-clear-button"
            type="button"
            onClick={() => onSearchChange("")}
            disabled={disabled}
          >
            Pulisci
          </button>
        )}
      </div>
    </div>
  );
}
