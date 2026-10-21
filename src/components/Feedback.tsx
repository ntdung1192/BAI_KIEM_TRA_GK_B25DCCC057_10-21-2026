export function Spinner({ label }: { label: string }) {
  return (
    <div className="spinner" role="status">
      <span className="dots">
        <i />
        <i />
        <i />
      </span>
      {label}
    </div>
  )
}

export function ErrorNote({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div className="error-note" role="alert">
      <b>Ối, có lỗi rồi.</b> {text}
      {onRetry && (
        <button className="btn small" onClick={onRetry}>
          Tải lại
        </button>
      )}
    </div>
  )
}
