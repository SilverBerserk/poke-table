import { POKEMON_TYPES } from "./utils"

const FilterPanel = ({name, onSearch, type, onPageChange, onFilter}) => {
    

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-5 bg-white shadow rounded-lg">
        <input
            id="search_input"
          value={name}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search Pokémon..."
          className="px-4 py-2 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-800
      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
        />
        <select
        id="type_input"
          value={type}
          onChange={(e) => onFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-800
      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
        >
          <option value="all">All Types</option>

          {POKEMON_TYPES.map((option) => (
            <option key={option} value={option}>
              {option.toUpperCase()}
            </option>
          ))}
        </select>

      </div>
    )
}

export default FilterPanel