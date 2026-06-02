import React, { useState, useRef, useEffect } from 'react';
import { Filter, Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = options.find(o => o.value === value);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-6 h-11 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl backdrop-blur-xl",
          value 
            ? "border-primary/40 bg-primary/10 text-primary" 
            : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.08] hover:border-white/20"
        )}
      >
        <Filter className={cn("size-3.5", value && "text-primary")} />
        {value ? `${label}: ${activeOption?.label}` : label}
        <ChevronDown className={cn("size-3 transition-transform duration-300", isOpen && "rotate-180")} />
        {value && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
          >
            <X className="size-3" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 z-[100] bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="p-2 space-y-1">
            <p className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">Select {label}</p>
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  value === opt.value 
                    ? "bg-white/[0.05] text-primary border border-white/10 shadow-inner" 
                    : "text-muted-foreground/40 hover:bg-white/[0.03] hover:text-foreground/80 border border-transparent"
                )}
              >
                {opt.label}
                {value === opt.value && <Check className="size-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
