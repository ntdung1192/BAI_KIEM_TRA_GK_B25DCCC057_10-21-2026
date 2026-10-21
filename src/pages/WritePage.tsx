import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPost } from '../services/storage'
import { readingTime } from '../utils'

const TITLE_MAX = 120

function checkForm(title: string, body: string) {
  const errors: { title?: string; body?: string } = {}

  if (title.trim().length === 0) errors.title = 'Bài viết cần có tiêu đề.'
  else if (title.trim().length < 6) errors.title = 'Tiêu đề ngắn quá, tối thiểu 6 ký tự.'
  else if (title.length > TITLE_MAX) errors.title = `Tiêu đề không quá ${TITLE_MAX} ký tự.`

  const words = body.trim() ? body.trim().split(/\s+/).length : 0
  if (words === 0) errors.body = 'Chưa có nội dung.'
  else if (words < 10) errors.body = `Viết thêm chút nữa, cần ít nhất 10 từ (hiện có ${words}).`

  return errors
}

export default function WritePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [preview, setPreview] = useState(false)

  // chi hien loi sau khi bam dang lan dau, de nguoi dung khong bi bao do ngay tu dau
  const errors = submitted ? checkForm(title, body) : {}

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(checkForm(title, body)).length > 0) return

    const post = createPost(title.trim(), body.trim())
    navigate(`/bai-viet/${post.id}`)
  }

  return (
    <div className="card">
      <div className="write-head">
        <h1>Viết bài mới</h1>
        <div className="tabs">
          <button type="button" className={!preview ? 'on' : ''} onClick={() => setPreview(false)}>
            Soạn
          </button>
          <button type="button" className={preview ? 'on' : ''} onClick={() => setPreview(true)}>
            Xem trước
          </button>
        </div>
      </div>

      {preview ? (
        <div className="preview">
          <h2>{title.trim() || 'Chưa có tiêu đề'}</h2>
          <div className="content">{body.trim() || 'Chưa có nội dung...'}</div>
        </div>
      ) : (
        <form id="write-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="title">Tiêu đề</label>
            <input
              id="title"
              value={title}
              className={errors.title ? 'invalid' : ''}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="field-foot">
              <span className="error-text">{errors.title}</span>
              <span className={title.length > TITLE_MAX ? 'counter over' : 'counter'}>
                {title.length}/{TITLE_MAX}
              </span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="body">Nội dung</label>
            <textarea
              id="body"
              rows={10}
              value={body}
              className={errors.body ? 'invalid' : ''}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="field-foot">
              <span className="error-text">{errors.body}</span>
              <span className="counter">{body.trim() ? `~${readingTime(body)} phút đọc` : ''}</span>
            </div>
          </div>
        </form>
      )}

      <div className="actions">
        <Link to="/" className="btn ghost">
          Hủy
        </Link>
        <button type="submit" form="write-form" className="btn" disabled={preview}>
          Đăng bài
        </button>
      </div>
    </div>
  )
}
