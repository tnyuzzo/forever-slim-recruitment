'use client'

import { forwardRef, InputHTMLAttributes } from 'react'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  options: RadioOption[]
  orientation?: 'horizontal' | 'vertical'
}

const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ label, error, options, orientation = 'vertical', name, value, onChange, className = '' }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <p className="block text-sm font-medium text-gray-700 mb-3">{label}</p>
        )}
        <div
          className={`
            flex gap-3
            ${orientation === 'vertical' ? 'flex-col' : 'flex-wrap'}
          `}
        >
          {options.map((option, index) => (
            <label
              key={option.value}
              className={`
                relative flex items-start gap-3 p-4 border rounded-lg cursor-pointer
                transition-all duration-200
                hover:border-[#D946A8] hover:bg-[#FDF2F8]
                ${value === option.value ? 'border-[#D946A8] bg-[#FDF2F8]' : 'border-gray-200'}
                ${error ? 'border-red-300' : ''}
              `}
            >
              <input
                ref={index === 0 ? ref : undefined}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="sr-only"
              />
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  transition-all duration-200
                  ${value === option.value ? 'border-[#D946A8]' : 'border-gray-300'}
                `}
              >
                <div
                  className={`
                    w-2.5 h-2.5 rounded-full bg-[#D946A8]
                    transition-all duration-200
                    ${value === option.value ? 'scale-100' : 'scale-0'}
                  `}
                />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">{option.label}</span>
                {option.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

export default RadioGroup
