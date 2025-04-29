"use client"

import type * as React from "react"
import { createContext, useContext, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const SidebarContext = createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  open: true,
  setOpen: () => {},
})

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex h-full">{children}</div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(SidebarContext)

  return (
    <aside
      data-state={open ? "open" : "closed"}
      className={cn(
        "relative h-full flex-col border-r bg-background data-[state=closed]:w-[--sidebar-width-collapsed] data-[state=open]:w-[--sidebar-width] transition-all",
        className,
      )}
      style={
        {
          "--sidebar-width": "240px",
          "--sidebar-width-collapsed": "4rem",
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </aside>
  )
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useContext(SidebarContext)

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
      onClick={() => setOpen((prev) => !prev)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}

export function SidebarContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(SidebarContext)

  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn("flex h-14 items-center border-b px-4 data-[state=closed]:justify-center", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(SidebarContext)

  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn("flex items-center border-t p-4 data-[state=closed]:justify-center", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroup({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-2", className)} role="group" {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(SidebarContext)

  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn("mb-2 px-2 text-xs font-semibold text-muted-foreground data-[state=closed]:sr-only", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroupContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  )
}

const sidebarMenuButtonVariants = cva(
  "group relative flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
  {
    variants: {
      isActive: {
        true: "bg-accent text-accent-foreground",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {}

export function SidebarMenuButton({ className, isActive, children, ...props }: SidebarMenuButtonProps) {
  const { open } = useContext(SidebarContext)

  return (
    <button
      data-state={open ? "open" : "closed"}
      className={cn(
        sidebarMenuButtonVariants({ isActive }),
        "data-[state=closed]:justify-center data-[state=closed]:px-2 data-[state=closed]:py-1.5",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarMenuBadge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(SidebarContext)

  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn(
        "ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-medium text-muted-foreground data-[state=closed]:sr-only",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarMenuSub({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(SidebarContext)

  return (
    <div data-state={open ? "open" : "closed"} className={cn("pl-4 data-[state=closed]:pl-0", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarRail({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useContext(SidebarContext)

  return (
    <div
      className={cn(
        "absolute right-0 top-0 h-full w-1 -translate-x-1/2 cursor-ew-resize bg-transparent transition-colors hover:bg-border",
        className,
      )}
      onMouseDown={(e) => {
        e.preventDefault()
        const startX = e.clientX
        const sidebarWidth = open
          ? Number.parseInt(getComputedStyle(e.currentTarget.parentElement!).getPropertyValue("--sidebar-width"))
          : Number.parseInt(
              getComputedStyle(e.currentTarget.parentElement!).getPropertyValue("--sidebar-width-collapsed"),
            )

        const onMouseMove = (e: MouseEvent) => {
          if (!open) {
            setOpen(true)
          }

          const newWidth = sidebarWidth + e.clientX - startX
          e.currentTarget?.parentElement?.style.setProperty("--sidebar-width", `${newWidth}px`)
        }

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove)
          document.removeEventListener("mouseup", onMouseUp)
        }

        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
      }}
      {...props}
    />
  )
}

export function SidebarInset({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-1 flex-col overflow-auto", className)} {...props}>
      {children}
    </div>
  )
}
