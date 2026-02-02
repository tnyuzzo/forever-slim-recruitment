'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode
  error?: string
  description?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, className = '', id, ...props }, ref) => {
    const checkboxId = id || props.name

    return (
      <div className={`relative ${className}`}>
        <div className="flex items-start gap-3">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`
                w-5 h-5 border-2 rounded flex items-center justify-center
                transition-all duration-200
                peer-focus:ring-2 peer-focus:ring-[#D946A8] peer-focus:ring-offset-2
                peer-checked:bg-[#D946A8] peer-checked:border-[#D946A8]
                peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                ${error ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          {label && (
            <div className="flex-1">
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                {label}
              </label>
              {description && (
                <p className="mt-0.5 text-sm text-gray-500">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
