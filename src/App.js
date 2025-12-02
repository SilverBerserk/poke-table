import { useEffect, useState } from 'react';
import axios from "axios"

const POKEMON_LIMINT = 151
const PAGE_LIMIT = 20

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

const App = () => {
  const [pokes, setPokes] = useState([])
  const [selectedPage, setSelectedPage] = useState(1)
  const [searchedPoke, setSearchedPoke] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")


  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=" + POKEMON_LIMINT,)
      .then(res => {
        axios.all(res.data.results.map(r => axios.get(r.url)))
          .then((details) => {

            const res = details.map(({ data }) => {
              const { id, name, types, sprites } = data;
              return { id, name, types: types.map(type => type.type.name), sprites }
            }).sort((a, b) => a - b)
            setPokes(res)
          })
      })

      .catch(err => console.error(err))
  }, [])


  const sPoke = [...pokes].filter(poke => poke.name.toLowerCase().includes(searchedPoke.toLowerCase()))
  const fPoke = typeFilter === "all" ? [...sPoke] : [...sPoke].filter(poke => poke.types.includes(typeFilter))
  const pagedPoke = [...fPoke].slice((selectedPage - 1) * PAGE_LIMIT, selectedPage * PAGE_LIMIT)

  return (
    <div className="App">
      <header className="App-header">
        <h5>Poke-Table</h5>
      </header>
      <div className="flex items-center gap-4 mb-6">

        {/* Search Input */}
        <input
          value={searchedPoke}
          onChange={(e) => setSearchedPoke(e.target.value)}
          placeholder="Search Pokémon..."
          className="
      px-4 py-2
      border border-slate-300
      rounded-lg
      shadow-sm
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500/40
      focus:border-blue-500
      bg-white
      text-slate-800
      w-60
    "
        />

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
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

      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-300 rounded-lg overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b">
                ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b">
                Type(s)
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b">
                Sprite
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pagedPoke.map((poke) => (
              <tr
                key={poke.id}
                className="hover:bg-slate-50 cursor-pointer"
              >
                <td className="px-4 py-3 text-slate-700">
                  #{poke.id.toString().padStart(3, "0")}
                </td>
                <td className="px-4 py-3 capitalize text-slate-800">
                  {poke.name}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {poke.types.map((type) => (
                      <span
                        key={type}
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                        className="px-3 py-1 rounded-full text-white text-xs font-semibold uppercase"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {poke.sprites.front_default && (
                    <img
                      src={poke.sprites.front_default}
                      alt={poke.name}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {[...Array(parseInt((POKEMON_LIMINT / PAGE_LIMIT).toFixed())).keys()].map(pageButton => <button onClick={() => setSelectedPage(pageButton + 1)}>{pageButton + 1}</button>)}
        </div>
      </div>
    </div>
  );
}

export default App;
