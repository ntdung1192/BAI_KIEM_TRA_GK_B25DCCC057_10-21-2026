import { Link, useLocation } from 'react-router-dom'

export default function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <div className="lost">
      <div className="torn">404</div>
      <h1>Không tìm thấy trang</h1>
      <p>
        Không có gì ở <code>{pathname}</code> cả.
      </p>
      <Link to="/" className="btn">
        Quay về danh sách bài viết
      </Link>
    </div>
  )
}
