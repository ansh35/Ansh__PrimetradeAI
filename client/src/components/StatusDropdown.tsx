import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusDropdownProps {
  status: string;
  onStatusChange: (newStatus: string) => void;
  className?: string;
}

const statuses = [
  { value: 'TODO', label: 'TODO', icon: Circle, color: 'text-muted-foreground/40', bg: 'bg-white/[0.03]', border: 'border-white/5' },
  { value: 'IN_PROGRESS', label: 'IN PROGRESS', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { value: 'DONE', label: 'COMPLETE', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, onStatusChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStatus = statuses.find(s => s.value === status) || statuses[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] transition-all border shadow-lg group/btn",
          currentStatus.bg,
          currentStatus.color,
          currentStatus.border,
          "hover:scale-[1.02] active:scale-95"
        )}
      >
        <currentStatus.icon className={cn("size-3.5", status === 'IN_PROGRESS' && "animate-pulse")} />
        {currentStatus.label}
        <ChevronDown className={cn("size-3 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 z-[9999] bg-[#09090b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="p-1.5 space-y-1">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(s.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  status === s.value 
                    ? "bg-white/[0.05] text-foreground border border-white/10 shadow-inner" 
                    : "text-muted-foreground/40 hover:bg-white/[0.03] hover:text-foreground/80 border border-transparent"
                )}
              >
                <s.icon className={cn("size-4", status === s.value ? s.color : "text-muted-foreground/20")} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
