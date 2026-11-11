import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { BoxIcon } from "lucide-react";
export interface DropdownItem {
  label: string;
  icon?: BoxIcon;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}
interface DropdownProps {
  trigger: (props: {
    open: boolean;
    toggle: () => void;
  }) => React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  header?: React.ReactNode;
}
export function Dropdown({
  trigger,
  items,
  align = 'right',
  header
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      {trigger({
      open,
      toggle: () => setOpen((o) => !o)
    })}
      <AnimatePresence>
        {open && <motion.div role="menu" initial={{
        opacity: 0,
        scale: 0.96,
        y: -4
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.96,
        y: -4
      }} transition={{
        duration: 0.15,
        ease: [0.23, 1, 0.32, 1]
      }} className={twMerge('absolute z-50 mt-1.5 min-w-[200px] overflow-hidden rounded-lg border border-line bg-white py-1 shadow-pop', align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left')}>
            {header && <div className="border-b border-line px-3 py-2.5">{header}</div>}
            {items.map((item) => <button key={item.label} role="menuitem" disabled={item.disabled} onClick={() => {
          setOpen(false);
          item.onClick();
        }} className={twMerge('flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors duration-100 disabled:opacity-40', item.danger ? 'text-danger-700 hover:bg-danger-50' : 'text-ink hover:bg-canvas')}>
                {item.icon && <item.icon className="h-4 w-4 text-current opacity-70" aria-hidden />}
                {item.label}
              </button>)}
          </motion.div>}
      </AnimatePresence>
    </div>;
}