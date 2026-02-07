import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "glass text-white hover:bg-white/20",
        primary: "bg-pink-500/80 text-white hover:bg-pink-500 shadow-lg shadow-pink-500/25",
        secondary: "bg-green-500/80 text-white hover:bg-green-500 shadow-lg shadow-green-500/25",
        outline: "border-2 border-white/30 bg-transparent text-white hover:bg-white/10",
        ghost: "text-white/70 hover:text-white hover:bg-white/10",
        sleep: "bg-indigo-600/80 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-600/25",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
