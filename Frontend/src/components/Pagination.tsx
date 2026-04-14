interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}) => {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 text-sm text-gray-600">
      <span className="text-center sm:text-left">
        Mostrando {from}–{to} de {total} registros
      </span>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        <span className="px-3 py-1.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
