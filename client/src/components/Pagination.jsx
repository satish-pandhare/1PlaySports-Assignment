export default function Pagination({ pagination, currentPage, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { totalPages, total } = pagination;

  return (
    <div className="flex items-center justify-between mt-4 pt-3">
      <span className="text-xs text-neutral-400">{total} tasks</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 text-xs rounded-lg cursor-pointer ${
              page === currentPage
                ? "bg-neutral-800 text-white"
                : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >{page}</button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >Next</button>
      </div>
    </div>
  );
}
