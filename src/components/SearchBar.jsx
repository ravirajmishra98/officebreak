import './SearchBar.css'

function SearchBar({ value, onChange, placeholder = 'Search games...' }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
  )
}

export default SearchBar
