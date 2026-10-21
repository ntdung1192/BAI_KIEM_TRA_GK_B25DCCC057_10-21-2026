import { useEffect, useState } from 'react'

const API = 'https://jsonplaceholder.typicode.com'

interface FetchResult<T> {
  key: string
  data: T | null
  status: number
  error: string
}

// path = null thi khong goi api
export function useFetch<T>(path: string | null) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<FetchResult<T>>({ key: '', data: null, status: 0, error: '' })

  const key = path ? `${path}#${attempt}` : ''

  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    const currentKey = `${path}#${attempt}`

    fetch(API + path, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          setResult({ key: currentKey, data: null, status: res.status, error: `Máy chủ trả về lỗi ${res.status}` })
          return
        }
        const data = await res.json()
        setResult({ key: currentKey, data, status: res.status, error: '' })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setResult({ key: currentKey, data: null, status: 0, error: 'Không kết nối được tới máy chủ. Kiểm tra lại mạng nhé.' })
      })

    return () => controller.abort()
  }, [path, attempt])

  const loading = !!path && result.key !== key
  const done = !!path && !loading

  return {
    data: done ? result.data : null,
    status: done ? result.status : 0,
    error: done ? result.error : '',
    loading,
    retry: () => setAttempt((n) => n + 1),
  }
}
