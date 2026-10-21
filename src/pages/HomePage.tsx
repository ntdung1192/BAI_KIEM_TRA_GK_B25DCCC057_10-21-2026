import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'
import { deletePost, loadMyPosts } from '../services/storage'
import { ErrorNote, Spinner } from '../components/Feedback'
import Pager from '../components/Pager'
import { readingTime } from '../utils'
import type { Post, User } from '../types'

const PER_PAGE = 8

function Highlight({ text, word }: { text: string; word: string }) {
  const i = word ? text.toLowerCase().indexOf(word) : -1
  if (i === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + word.length)}</mark>
      {text.slice(i + word.length)}
    </>
  )
}

export default function HomePage() {
  const posts = useFetch<Post[]>('/posts')
  const users = useFetch<User[]>('/users')
  const { username } = useAuth()
  const [myPosts, setMyPosts] = useState(loadMyPosts)
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''
  const keyword = q.trim().toLowerCase()

  const all = [...myPosts, ...(posts.data ?? [])]
  const matched = keyword ? all.filter((p) => p.title.toLowerCase().includes(keyword)) : all

  const totalPages = Math.ceil(matched.length / PER_PAGE)
  const page = Math.min(Number(params.get('trang')) || 1, Math.max(totalPages, 1))
  const shown = matched.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const authorOf = (post: Post) => {
    if (post.mine) return username ?? 'Tôi'
    const user = users.data?.find((u) => u.id === post.userId)
    return user ? user.name : `Tác giả #${post.userId}`
  }

  const search = (value: string) => {
    // doi tu khoa thi quay ve trang 1
    setParams(value ? { q: value } : {}, { replace: true })
  }

  const goToPage = (p: number) => {
    const next = new URLSearchParams(params)
    next.set('trang', String(p))
    setParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = (post: Post) => {
    if (!window.confirm(`Xóa bài "${post.title}"? Không khôi phục được đâu.`)) return
    deletePost(post.id)
    setMyPosts(loadMyPosts())
  }

  return (
    <section>
      <div className="home-head">
        <h1>Bài viết</h1>
        <div className="search-box">
          <input
            type="search"
            placeholder="Tìm theo tiêu đề..."
            value={q}
            onChange={(e) => search(e.target.value)}
          />
          {q && (
            <button className="clear" onClick={() => search('')} aria-label="Xóa từ khóa">
              ×
            </button>
          )}
        </div>
      </div>

      {posts.loading && <Spinner label="Đang tải bài viết..." />}
      {posts.error && <ErrorNote text={posts.error} onRetry={posts.retry} />}

      {!posts.loading && (
        <>
          <p className="summary">
            {keyword
              ? `Có ${matched.length} bài khớp với “${q.trim()}”`
              : `${all.length} bài viết, trong đó ${myPosts.length} bài của bạn`}
          </p>

          {shown.length === 0 && <p className="nothing">Không tìm thấy bài nào. Thử từ khóa khác xem.</p>}

          <ol className="entries">
            {shown.map((post, index) => (
              <li key={post.id} className={post.mine ? 'entry is-mine' : 'entry'}>
                <span className="entry-no">{String((page - 1) * PER_PAGE + index + 1).padStart(2, '0')}</span>
                <div className="entry-body">
                  <Link to={`/bai-viet/${post.id}`} className="entry-title">
                    <Highlight text={post.title} word={keyword} />
                  </Link>
                  <p className="excerpt">{post.body.split('\n')[0]}</p>
                  <div className="entry-meta">
                    <span>{authorOf(post)}</span>
                    <span>{readingTime(post.body)} phút đọc</span>
                    {post.mine && <span className="stamp">bài của tôi</span>}
                    {post.mine && username && (
                      <button className="link-btn danger" onClick={() => remove(post)}>
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <Pager page={page} total={totalPages} onChange={goToPage} />
        </>
      )}
    </section>
  )
}
