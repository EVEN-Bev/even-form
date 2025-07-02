'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface DebugPanelProps {
  data: any
  title?: string
}

export function DebugPanel({ data, title = 'Debug Info' }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-black border border-[#9D783C] p-4 rounded shadow-lg w-[500px] max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#9D783C] font-bold">{title}</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-[#9D783C]">
              <X size={18} />
            </button>
          </div>
          <pre className="text-xs text-white whitespace-pre-wrap">
            {JSON.stringify(
              data,
              (key, value) => {
                // Handle circular references and functions
                if (typeof value === 'function') {
                  return '[Function]'
                }
                return value
              },
              2
            )}
          </pre>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#9D783C] text-white px-4 py-2 rounded shadow-lg hover:bg-[#8A6A35]"
        >
          Debug
        </button>
      )}
    </div>
  )
}
