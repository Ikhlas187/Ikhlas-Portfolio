import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full resize-none rounded-[16px] border-0 bg-transparent p-[18px] font-sans text-base text-black transition-colors outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
