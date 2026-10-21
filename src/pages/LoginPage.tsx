import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { username, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const next: string = location.state?.next ?? '/'

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [message, setMessage] = useState('')

  if (username) return <Navigate to={next} replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !password) {
      setMessage('Nhập đủ tên đăng nhập và mật khẩu đã.')
      return
    }
    if (!signIn(name.trim(), password, remember)) {
      setMessage('Tên đăng nhập hoặc mật khẩu không đúng.')
      setPassword('')
      return
    }
    navigate(next, { replace: true })
  }

  return (
    <div className="card narrow">
      <h1>Đăng nhập</h1>
      {location.state?.next && <p className="hint-box">Bạn cần đăng nhập để viết bài.</p>}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="name">Tên đăng nhập</label>
          <input id="name" autoFocus autoComplete="username" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="password">Mật khẩu</label>
          <div className="password-row">
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="link-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Ghi nhớ đăng nhập
        </label>

        {message && <p className="error-text">{message}</p>}

        <button type="submit" className="btn full">
          Đăng nhập
        </button>
      </form>
    </div>
  )
}
