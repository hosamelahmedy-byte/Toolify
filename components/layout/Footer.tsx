import Link from 'next/link'
import { Zap } from 'lucide-react'

const FOOTER_LINKS = {
  Tools: [
    { href: '/tools/qr-code-generator', label: 'QR Code Generator' },
    { href: '/tools/word-counter', label: 'Word Counter' },
    { href: '/tools/bmi-calculator', label: 'BMI Calculator' },
    { href: '/tools/json-to-typebox', label: 'JSON → TypeBox' },
    { href: '/tools/keyword-generator', label: 'Keyword Generator' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap size={14} className="text-primary-foreground" />
              </div>
              <span className="font-bold font-display">Tool<span className="gradient-text-static">ify</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free online tools for developers, writers & creators.
              Fast, private, no signup.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-semibold text-sm mb-3">{group}</h4>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Toolify. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
