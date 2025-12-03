import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { TypeBadge } from './utils';
import Pagination from './Pagination';
import FilterPanel from './FilterPanel';
import { AlertCircle } from "lucide-react";

const POKEMON_LIMIT = 151
const PAGE_LIMIT = 20

const PokeTable = () => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [pokes, setPokes] = useState([])
  const [searchedPoke, setSearchedPoke] = useState("")
  const [filteredPoke, setFilteredPoke] = useState("all")

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_LIMIT,
  });

  useEffect(() => {
    onLoadPokes()
  }, [])

  const onLoadPokes = () => {
    setIsLoading(true)
    setIsError(false)

    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`)
      .then((res) =>
        axios.all(res.data.results.map((r) => axios.get(r.url)))
      )
      .then((details) => {
        const res = details
          .map(({ data }) => {
            const { id, name, types, sprites } = data;
            return {
              id,
              name,
              types: types.map((t) => t.type.name),
              sprites,
            };
          })
          .sort((a, b) => a.id - b.id);

        setPokes(res);
      })
      .catch((err) => {
        setIsError(true);
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const onSearch = (value) => {
    setSearchedPoke(value)
    table.setPageIndex(1)
  }

  const onFilter = (value) => {
    setFilteredPoke(value)
    table.setPageIndex(1)
  }

  const sPokes = useMemo(
    () =>
      pokes.filter(
        (poke) =>
          poke.name.toLowerCase().includes(searchedPoke.toLowerCase()) &&
          (filteredPoke === "all" || poke.types.includes(filteredPoke))
      ),
    [pokes, searchedPoke, filteredPoke]
  )

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        cell: (info) => (
          <span className="text-slate-700">
            #{String(info.getValue()).padStart(3, "0")}
          </span>
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => (
          <span className="capitalize text-slate-800">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Type(s)",
        accessorKey: "types",
        cell: (info) => {
          const types = info.getValue();
          return (
            <div className="flex flex-wrap gap-1">
              {types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          );
        },
      },
      {
        header: "Sprite",
        accessorKey: "sprites",
        cell: (info) => {
          const sprites = info.getValue();
          if (!sprites?.front_default) return null;
          return (
            <img
              className="w-20 h-20 object-contain"
              src={sprites.front_default}
              alt="sprite"
            />
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: sPokes,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="App min-h-screen bg-gray-50 p-8">
      <header className="App-header">
        <h1 className="text-5xl font-bold text-gray-800 mb-5">Poké-Table</h1>
      </header>

      <FilterPanel
        name={searchedPoke}
        onSearch={onSearch}
        type={filteredPoke}
        onFilter={onFilter}
      />

      {isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <div className="text-red-600 text-xl font-semibold mb-4">
            Failed to load pokes
          </div>
          <button
            onClick={onLoadPokes}
            className="px-5 py-2 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-300 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-slate-300">
          <table className="min-w-full overflow-hidden">
            <thead className="bg-slate-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold text-slate-700 border-b"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="py-10 text-center text-slate-500 italic"
                  >
                    No pokes found
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate("/" + row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!!rows.length && <Pagination table={table} />}
        </div>
      )}
    </div>
  );
};

export default PokeTable;
