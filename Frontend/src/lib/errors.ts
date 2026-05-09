interface ApiErrorBody {
  message?: string
  detail?: string
  title?: string
  error?: string
  errors?: Record<string, string[] | string> | string[]
}

interface AxiosLikeError {
  isAxiosError?: boolean
  response?: { data?: unknown; status?: number; statusText?: string }
  message?: string
}

function flattenValidationErrors(
  errors: Record<string, string[] | string> | string[],
): string | null {
  if (Array.isArray(errors)) {
    const joined = errors.filter(Boolean).join(' ')
    return joined || null
  }
  const messages: string[] = []
  for (const value of Object.values(errors)) {
    if (Array.isArray(value)) {
      messages.push(...value.filter(Boolean))
    } else if (typeof value === 'string' && value) {
      messages.push(value)
    }
  }
  return messages.length > 0 ? messages.join(' ') : null
}

function fromBody(body: unknown): string | null {
  if (!body) return null
  if (typeof body === 'string') return body || null

  if (typeof body === 'object') {
    const b = body as ApiErrorBody
    if (typeof b.message === 'string' && b.message.trim()) return b.message
    if (typeof b.detail === 'string' && b.detail.trim()) return b.detail
    if (typeof b.error === 'string' && b.error.trim()) return b.error
    if (b.errors) {
      const flat = flattenValidationErrors(b.errors)
      if (flat) return flat
    }
    if (typeof b.title === 'string' && b.title.trim()) return b.title
  }
  return null
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (!err) return fallback

  if (typeof err === 'string') return err

  const axiosErr = err as AxiosLikeError
  const fromResponse = fromBody(axiosErr?.response?.data)
  if (fromResponse) return fromResponse

  if (err instanceof Error && err.message) return err.message
  if (typeof axiosErr?.message === 'string' && axiosErr.message) return axiosErr.message

  return fallback
}

/**
 * For axios responses with `responseType: 'blob'`, the error body is a Blob —
 * read it as text, parse the JSON, then run the same extraction. Always async.
 */
export async function getBlobErrorMessage(err: unknown, fallback = 'Something went wrong'): Promise<string> {
  const axiosErr = err as AxiosLikeError
  const data = axiosErr?.response?.data

  if (data instanceof Blob) {
    try {
      const text = await data.text()
      try {
        const parsed = JSON.parse(text)
        return fromBody(parsed) ?? (text.trim() || fallback)
      } catch {
        return text.trim() || fallback
      }
    } catch {
      // fall through to generic extraction
    }
  }
  return getErrorMessage(err, fallback)
}
