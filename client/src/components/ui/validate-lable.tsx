import { cn } from '../../lib/utils'

interface ValidateLabelProps {
  message?: string
  type?: 'error' | 'warning' | 'success' | 'info'
  className?: string
}

export default function ValidateLabel({ 
  message, 
  type = 'error',
  className 
}: ValidateLabelProps) {
  if (!message) return null

  const styles = {
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    success: 'text-green-700 bg-green-50 border-green-200',
    info: 'text-blue-700 bg-blue-50 border-blue-200',
  }

  const icons = {
    error: '✕',
    warning: '⚠',
    success: '✓',
    info: 'ℹ',
  }

  return (
    <div
      className={cn(
        'mt-1 px-3 py-1.5 text-sm rounded-md border flex items-center gap-2',
        styles[type],
        className
      )}
      role="alert"
    >
      <span className="font-semibold">{icons[type]}</span>
      <span>{message}</span>
    </div>
  )
}
