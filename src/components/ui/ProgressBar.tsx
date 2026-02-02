'use client'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-[#D946A8] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-300
                ${
                  i < currentStep
                    ? 'bg-[#D946A8] text-white'
                    : i === currentStep
                    ? 'bg-[#D946A8] text-white ring-4 ring-[#FDF2F8]'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {i < currentStep ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {stepLabels && stepLabels[i] && (
              <span
                className={`
                  mt-1 text-xs text-center max-w-[60px] leading-tight
                  ${i <= currentStep ? 'text-gray-700' : 'text-gray-400'}
                `}
              >
                {stepLabels[i]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
