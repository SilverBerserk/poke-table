import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios"
import { POKEMON_TYPES, TYPE_COLORS } from './utils';
import Pagination from './Pagination';

const POKEMON_LIMIT = 151
const PAGE_LIMIT = 20

const PokeTable = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const navigate = useNavigate();

  const [pokes, setPokes] = useState([])
  const [searchedPoke, setSearchedPoke] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")


  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=" + POKEMON_LIMIT,)
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


  const handleSearchPoke = (value) => {
    setSearchedPoke(value)
    setSearchParam({ page: 1 })
  }

  const handleFilterPoke = (type) => {
    setTypeFilter(type)
    setSearchParam({ page: 1 })

  }


  const sPoke = [...pokes].filter(poke => poke.name.toLowerCase().includes(searchedPoke.toLowerCase()))
  const fPoke = typeFilter === "all" ? [...sPoke] : [...sPoke].filter(poke => poke.types.includes(typeFilter))
  const pagedPoke = [...fPoke].slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT)

  const pages = Math.ceil(fPoke.length / PAGE_LIMIT)

  return (
    <div className="App min-h-screen bg-gray-50 p-8" >
      <header className="App-header">
        <h5>Poke-Table</h5>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-5 bg-white shadow rounded-lg">
        <input
          value={searchedPoke}
          onChange={(e) => handleSearchPoke(e.target.value)}
          placeholder="Search Pokémon..."
          className="px-4 py-2 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-800
      focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
        />
        <select
          value={typeFilter}
          onChange={(e) => handleFilterPoke(e.target.value)}
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

      <div className="overflow-x-auto shadow rounded-lg border border-slate-300">
        <table className="min-w-full   overflow-hidden">
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
                onClick={() => navigate('/' + poke.id)}
                className="bg-white hover:bg-slate-50 cursor-pointer"
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
                      className="w-20 h-20 object-contain"
                      src={poke.sprites.front_default}
                      alt={poke.name}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} pages={pages}/>

      </div>
    </div>
  );
}

export default PokeTable;
