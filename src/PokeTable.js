import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { TypeBadge } from './utils';
import Pagination from './Pagination';
import FilterPanel from './FilterPanel';
import { AlertCircle } from "lucide-react"

const POKEMON_LIMIT = 151
const PAGE_LIMIT = 20

const PokeTable = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [pokes, setPokes] = useState([])
  const [searchedPoke, setSearchedPoke] = useState("")
  const [filteredPoke, setFilteredPoke] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    onLoadPokes()
  }, [])

  const onLoadPokes = () => {
    setIsLoading(true)
    setIsError(false)
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=" + POKEMON_LIMIT,)
      .then(res => {
        axios.all(res.data.results.map(r => axios.get(r.url)))
          .then((details) => {
            const res = details.map(({ data }) => {
              const { id, name, types, sprites } = data;
              return { id, name, types: types.map(type => type.type.name), sprites }
            }).sort((a, b) => a.id - b.id)
            setPokes(res)
          }).catch(err => {
            setIsError(true)
            console.error(err)
          })
          .finally(() => setIsLoading(false))
      })
      .catch(err => {
        setIsError(true)
        console.error(err)
      })
  
  }

  const sPokes = [...pokes].filter(poke => poke.name.toLowerCase().includes(searchedPoke.toLowerCase()) && (filteredPoke === "all" || poke.types.includes(filteredPoke)))
  const pagedPokes = [...sPokes].slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT)

  const pages = Math.ceil(sPokes.length / PAGE_LIMIT)

  return (
    <div className="App min-h-screen bg-gray-50 p-8" >
      <header className="App-header">
        <h1 className="text-5xl font-bold text-gray-800 mb-5">Poké-Table</h1>
      </header>

      <FilterPanel name={searchedPoke} onSearch={setSearchedPoke} type={filteredPoke} onFilter={setFilteredPoke} onPageChange={setPage} />

      {isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <div className="text-red-600 text-xl font-semibold mb-2">
            Fail to load pokes
          </div>
          <button
            onClick={onLoadPokes}  
            className="px-5 py-2 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-300 transition-colors"
          >
            Retry
          </button>
        </div>
      ) :
        isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) :

          (<div className="overflow-x-auto shadow rounded-lg border border-slate-300">
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
                {pagedPokes.length ?
                pagedPokes.map((poke) => (
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
                          <TypeBadge key={type} type={type}/>
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
                )) : <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-slate-500 italic"
                >
                  No pokes found
                </td>
              </tr>}
              </tbody>
            </table>
            {!!pagedPokes.length && <Pagination page={page} pages={pages} onPageChange={setPage} />}
          </div>)}
    </div>
  );
}

export default PokeTable;
