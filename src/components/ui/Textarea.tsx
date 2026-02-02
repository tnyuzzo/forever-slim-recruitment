'use client'

import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  showCount?: boolean
  maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCount, maxLength, className = '', id, value, ...props }, ref) => {
    const textareaId = id || props.name
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 border rounded-lg text-gray-900
            placeholder:text-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#D946A8] focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            resize-y min-h-[120px]
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        <div className="mt-1.5 flex justify-between items-start">
          <div>
            {hint && !error && (
              <p className="text-sm text-gray-500">{hint}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          {showCount && maxLength && (
            <p className={`text-sm ${currentLength > maxLength ? 'text-red-600' : 'text-gray-400'}`}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
