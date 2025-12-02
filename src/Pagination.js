import { useSearchParams } from "react-router-dom"

const Pagination = ({ page, pages }) => {
    const [_,setSearchParam] = useSearchParams()


    return (
        <div className="flex gap-2 my-6 flex-wrap justify-center">
            <button className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                    ${page === 1 ? "bg-gray-200" : "hover:bg-slate-100"}`}
                disabled={page === 1}
                onClick={() => page > 1 && setSearchParam({ page: page - 1 })}>{"<"}</button>
            {[...Array(pages).keys()].map((pageButton) => {
                const pageNum = pageButton + 1;
                const isActive = pageNum === page; // ← your current page

                return (
                    <button
                        key={pageNum}
                        onClick={() => setSearchParam({ page: pageNum })}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
          ${isActive ? "bg-blue-600 text-white border-blue-700 shadow" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"}`}
                    >
                        {pageNum}
                    </button>
                );
            })}
            <button className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
          ${page === pages ? "bg-gray-200" : "hover:bg-slate-100"}`}
                disabled={page === pages}
                onClick={() => page < pages && setSearchParam({ page: page + 1 })}>{">"}</button>

        </div>
    )
}

export default Pagination