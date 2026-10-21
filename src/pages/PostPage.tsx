import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'
import { loadMyPosts } from '../services/storage'
import { ErrorNote, Spinner } from '../components/Feedback'
import { formatDate, initials, readingTime } from '../utils'
import type { Comment, Post, User } from '../types'
import NotFoundPage from './NotFoundPage'

export default function PostPage() {
  const { id } = useParams()
  const { username } = useAuth()

  const postId = Number(id)
  const validId = Number.isInteger(postId) && postId > 0
  const localPost = validId ? loadMyPosts().find((p) => p.id === postId) : undefined
  const fromApi = validId && !localPost

  const post = useFetch<Post>(fromApi ? `/posts/${postId}` : null)
  const comments = useFetch<Comment[]>(fromApi ? `/posts/${postId}/comments` : null)
  // co bai viet roi moi lay thong tin tac gia
  const author = useFetch<User>(post.data ? `/users/${post.data.userId}` : null)

  if (!validId || post.status === 404) return <NotFoundPage />

  if (localPost) {
    return (
      <article className="article">
        <Link to="/" className="back">
          ← Về danh sách bài viết
        </Link>
        <h1>{localPost.title}</h1>
        <p className="byline">
          {username ?? 'Tôi'} · viết ngày {formatDate(localPost.createdAt)} · {readingTime(localPost.body)} phút đọc
        </p>
        <div className="content">{localPost.body}</div>
        <p className="nothing">Bài này mới được viết nên chưa có ai bình luận.</p>
      </article>
    )
  }

  if (post.loading) return <Spinner label="Đang mở bài viết..." />
  if (post.error || !post.data) return <ErrorNote text={post.error || 'Không đọc được bài viết.'} onRetry={post.retry} />

  return (
    <article className="article">
      <Link to="/" className="back">
        ← Về danh sách bài viết
      </Link>
      <h1>{post.data.title}</h1>
      <p className="byline">
        {author.data ? author.data.name : `Tác giả #${post.data.userId}`} · {readingTime(post.data.body)} phút đọc
      </p>
      <div className="content">{post.data.body}</div>

      <section className="discussion">
        <h2>Bình luận {comments.data && <span className="badge">{comments.data.length}</span>}</h2>

        {comments.loading && <Spinner label="Đang tải bình luận..." />}
        {comments.error && <ErrorNote text={comments.error} onRetry={comments.retry} />}
        {comments.data?.length === 0 && <p className="nothing">Chưa có bình luận nào.</p>}

        {comments.data?.map((c) => (
          <div key={c.id} className="comment">
            <span className="avatar" style={{ background: `hsl(${(c.id * 47) % 360} 40% 55%)` }}>
              {initials(c.name)}
            </span>
            <div>
              <div className="comment-head">
                <b>{c.name}</b>
                <a href={`mailto:${c.email}`}>{c.email.toLowerCase()}</a>
              </div>
              <p>{c.body}</p>
            </div>
          </div>
        ))}
      </section>
    </article>
  )
}
