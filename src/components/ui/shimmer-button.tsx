import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
}

const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.1em",
      shimmerDuration = "2s",
      borderRadius = "0.75rem",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative z-0 flex items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 font-medium text-white transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        style={{
          borderRadius,
          background,
        }}
        {...props}
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius }}
        >
          <div
            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animationDuration: shimmerDuration,
            }}
          />
        </div>
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"

export { ShimmerButton }

