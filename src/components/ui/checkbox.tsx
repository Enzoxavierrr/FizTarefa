import { forwardRef, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 shrink-0 rounded-md border border-border ring-offset-background transition-colors',
            'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'peer-checked:bg-primary peer-checked:border-primary',
            className
          )}
        >
          {checked && (
            <Check className="h-4 w-4 text-primary-foreground m-0.5" strokeWidth={3} />
          )}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }

