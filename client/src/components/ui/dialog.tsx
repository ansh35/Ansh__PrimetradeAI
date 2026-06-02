import * as React from "react"
import { X } from "lucide-react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative bg-[#09090b]/40 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden backdrop-blur-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Top Shine Reflection */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="flex items-center justify-between px-8 py-7 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all text-muted-foreground hover:text-foreground shadow-xl"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export { Dialog }
