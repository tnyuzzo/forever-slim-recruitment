"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
    question: string
    answer: React.ReactNode
}

export function AccordionItem({ question, answer }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex justify-between items-center text-left hover:text-primary-main focus:outline-none transition-colors duration-200"
            >
                <span className="font-semibold text-text-main pr-4">{question}</span>
                <ChevronDown
                    className={`shrink-0 w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="text-text-muted text-sm md:text-base leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    )
}

export function Accordion({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full divide-y divide-gray-200">
            {children}
        </div>
    )
}
