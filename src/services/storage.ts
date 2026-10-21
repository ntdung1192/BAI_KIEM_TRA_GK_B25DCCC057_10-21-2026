import type { Post } from '../types'

const POSTS_KEY = 'miniblog.posts'

export function loadMyPosts(): Post[] {
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]')
  } catch {
    return []
  }
}

function save(posts: Post[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export function createPost(title: string, body: string) {
  const post: Post = {
    id: Date.now(),
    userId: 0,
    title,
    body,
    mine: true,
    createdAt: new Date().toISOString(),
  }
  save([post, ...loadMyPosts()])
  return post
}

export function deletePost(id: number) {
  save(loadMyPosts().filter((p) => p.id !== id))
}
