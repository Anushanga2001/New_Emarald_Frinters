import { toast, type ToastOptions, type Id } from 'react-toastify'

/**
 * Centralized toast helper. Use this instead of importing `toast` from
 * `react-toastify` directly so styling defaults, behaviour overrides, and
 * future library swaps live in one place.
 *
 * Global container + base defaults are configured in `App.tsx`.
 */
export const notify = {
  success(message: string, options?: ToastOptions): Id {
    return toast.success(message, options)
  },

  error(message: string, options?: ToastOptions): Id {
    return toast.error(message, { autoClose: 5000, ...options })
  },

  info(message: string, options?: ToastOptions): Id {
    return toast.info(message, options)
  },

  warning(message: string, options?: ToastOptions): Id {
    return toast.warning(message, options)
  },

  dismiss(id?: Id): void {
    toast.dismiss(id)
  },
}

export type Notify = typeof notify
