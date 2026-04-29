'use client'

import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { ToolifyProvider } from '@/lib/store'
import { ToastProvider } from '@/lib/toast'
import { PWAInstallBanner } from '@/hooks/usePWA'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ToolifyProvider>
        <ToastProvider>
          {children}
          <PWAInstallBanner />
        </ToastProvider>
      </ToolifyProvider>
    </ThemeProvider>
  )
}
