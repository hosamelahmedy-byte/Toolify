import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Toolify',
  description: 'Read Toolify\'s Privacy Policy. We do not collect personal data. All tools run in your browser. No signup, no tracking, no ads that profile you.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/privacy' },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'April 30, 2026'
  const contactEmail = 'privacy@toolify.app'

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-20">
        <div className="section-container py-12 max-w-3xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">

            <div className="glass-card p-6 rounded-2xl border-l-4 border-primary">
              <p className="font-medium text-foreground text-base mb-1">
                The short version: We collect almost nothing.
              </p>
              <p>
                Toolify is a collection of free browser-based tools. Almost all processing happens
                locally in your browser. We don&apos;t require accounts, we don&apos;t sell your data,
                and we don&apos;t store the files or text you process through our tools.
              </p>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>

              <h3 className="font-medium text-foreground mb-2">Data You Provide</h3>
              <p className="mb-3">
                Toolify does not require you to create an account or provide any personal information
                to use its tools. Any text, files, or data you enter into our tools is processed
                entirely within your browser and is never transmitted to our servers.
              </p>

              <h3 className="font-medium text-foreground mb-2">Usage Analytics</h3>
              <p className="mb-3">
                We may collect anonymized usage analytics to understand which tools are most popular
                and to improve the site. This data does not include personally identifiable information.
                We do not use third-party advertising trackers.
              </p>

              <h3 className="font-medium text-foreground mb-2">Cookies & Local Storage</h3>
              <p>
                We use browser local storage only to save your preferences (such as dark/light mode)
                and recently used tools. This data stays on your device and is never sent to us.
                We do not use advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Information</h2>
              <p>The limited data we collect is used solely to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>Operate and maintain the Toolify service</li>
                <li>Improve tool performance and user experience</li>
                <li>Monitor site health and diagnose technical issues</li>
              </ul>
              <p className="mt-3">
                We do not sell, rent, or share your information with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Third-Party Services</h2>
              <p className="mb-3">Toolify is hosted on Vercel. Their privacy policy applies to infrastructure-level data handling. Some tools (such as the QR Code Generator) use external APIs to generate output. In those cases, only the necessary input data (e.g., the URL you want to encode) is sent to the API provider. We do not associate this with your identity.</p>
              <p>
                We may in the future display non-personalized advertisements through Google AdSense.
                Google&apos;s privacy policy governs the use of advertising cookies if and when ads are shown.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Security</h2>
              <p>
                Since we don&apos;t store your personal data or processed files, there is minimal risk
                of a data breach affecting your content. Our site is served over HTTPS and infrastructure
                security is handled by Vercel.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Children&apos;s Privacy</h2>
              <p>
                Toolify does not knowingly collect information from children under 13. If you believe a
                child has submitted information to us, please contact us and we will promptly delete it.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p className="mb-3">
                Since we collect minimal data, most privacy requests are addressed by simply clearing
                your browser&apos;s local storage. If you have specific concerns, you may contact us at:
              </p>
              <p>
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-mono">
                  {contactEmail}
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page
                with an updated date. Continued use of Toolify after changes constitutes acceptance of
                the new policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-mono">
                  {contactEmail}
                </a>.
              </p>
            </section>

            <div className="pt-4 border-t border-white/10 flex gap-4">
              <Link href="/terms" className="text-primary hover:underline text-sm">Terms of Service</Link>
              <Link href="/about" className="text-primary hover:underline text-sm">About Us</Link>
              <Link href="/" className="text-primary hover:underline text-sm">Back to Toolify</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

