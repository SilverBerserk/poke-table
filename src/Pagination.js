import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ table }) => {
    const pageIndex = table.getState().pagination.pageIndex
    const pageCount = table.getPageCount()

    if (pageCount <= 1) return null;

    return (
        <div className="flex gap-2 my-6 flex-wrap justify-center">
            <button className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all
          ${pageIndex === 0 ? "bg-gray-200" : "hover:bg-slate-100"}`}
                disabled={pageIndex === 0}
                onClick={() => table.previousPage()}
            >
                <ChevronLeft size={14} />
            </button>

            {[...Array(pageCount).keys()].map((i) => {
                const isActive = i === pageIndex;
                const pageNum = i + 1;
                return (
                    <button key={i}
                        onClick={() => table.setPageIndex(i)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
              ${isActive ? "bg-blue-400 text-white border-blue-500 shadow"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                    >
                        {pageNum}
                    </button>
                );
            })}

            <button
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all
          ${pageIndex === pageCount - 1
                        ? "bg-gray-200"
                        : "hover:bg-slate-100"
                    }`}
                disabled={pageIndex === pageCount - 1}
                onClick={() => table.nextPage()}
            >
                <ChevronRight size={14} />
            </button>
        </div>
    )
}

export default Pagination
