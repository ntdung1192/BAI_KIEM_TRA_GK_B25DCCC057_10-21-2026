interface Props {
  page: number
  total: number
  onChange: (page: number) => void
}

export default function Pager({ page, total, onChange }: Props) {
  if (total <= 1) return null

  const pages = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="pager">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        ‹ Trước
      </button>
      {pages.map((p) => (
        <button key={p} className={p === page ? 'current' : ''} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button disabled={page === total} onClick={() => onChange(page + 1)}>
        Sau ›
      </button>
    </div>
  )
}
