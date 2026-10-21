import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const YEAR = new Date().getFullYear()

export default function Layout() {
  const { username, signOut } = useAuth()
  const navigate = useNavigate()

  const onSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="page">
      <header className="topbar">
        <Link to="/" className="brand">
          MiniBlog
        </Link>

        <nav className="menu">
          <NavLink to="/" end>
            Bài viết
          </NavLink>
          <NavLink to="/viet-bai">Viết bài</NavLink>
          {username ? (
            <button className="link-btn" onClick={onSignOut} title={`Đang đăng nhập: ${username}`}>
              Đăng xuất ({username})
            </button>
          ) : (
            <NavLink to="/dang-nhap">Đăng nhập</NavLink>
          )}
        </nav>
      </header>

      <main className="sheet">
        <Outlet />
      </main>

      <footer className="footnote">Dữ liệu mẫu từ JSONPlaceholder · MiniBlog {YEAR}</footer>
    </div>
  )
}
