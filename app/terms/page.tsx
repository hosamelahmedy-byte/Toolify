import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service | Toolify',
  description: 'Toolify Terms of Service. Free tools for personal and commercial use. No warranty. Read our terms before using the service.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/terms' },
}

export default function TermsOfServicePage() {
  const lastUpdated = 'April 30, 2026'
  const contactEmail = 'legal@toolify.app'

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-20">
        <div className="section-container py-12 max-w-3xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

            <div className="glass-card p-6 rounded-2xl border-l-4 border-primary">
              <p className="font-medium text-foreground text-base mb-1">
                Agreement to Terms
              </p>
              <p>
                By accessing or using Toolify (&quot;the Service&quot;), you agree to be bound by these
                Terms of Service. If you do not agree, please do not use the Service.
              </p>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. The Service</h2>
              <p className="mb-3">
                Toolify provides a collection of free, browser-based online tools for developers,
                writers, and creators. The tools include text utilities, developer tools, PDF tools,
                calculators, and more. All tools are provided free of charge.
              </p>
              <p>
                We reserve the right to add, modify, or discontinue any tool or feature at any time
                without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Acceptable Use</h2>
              <p className="mb-3">You agree to use Toolify only for lawful purposes. You must not use the Service to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Process or distribute illegal, harmful, or infringing content</li>
                <li>Attempt to overload, hack, or disrupt the Service</li>
                <li>Scrape or automate requests to the Service at scale without permission</li>
                <li>Circumvent any usage limits or security measures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Intellectual Property</h2>
              <p className="mb-3">
                The Toolify name, logo, source code, and design are owned by Toolify and protected by
                copyright law. You may not copy, reproduce, or create derivative works from our
                interface without permission.
              </p>
              <p>
                Content you create or process using our tools remains your own property. We claim
                no ownership over files or text you use with our tools.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Disclaimer of Warranties</h2>
              <p className="mb-3">
                Toolify is provided &quot;as is&quot; without any warranties, express or implied. We do not
                guarantee that the Service will be error-free, uninterrupted, or accurate.
              </p>
              <p>
                Tool outputs (such as calculations, conversions, or generated text) are provided for
                informational and convenience purposes only. Do not rely on them for critical medical,
                financial, legal, or safety decisions without independent verification.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Toolify and its operators shall not be liable
                for any direct, indirect, incidental, or consequential damages arising from your use
                of the Service. This includes but is not limited to data loss, output errors, or
                service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Third-Party Links & Services</h2>
              <p>
                Toolify may link to or rely on third-party services. We are not responsible for the
                content, privacy practices, or availability of those services. Use them at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Privacy</h2>
              <p>
                Your use of the Service is also governed by our{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>,
                which is incorporated by reference into these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Changes to Terms</h2>
              <p>
                We may update these Terms at any time. Continued use of Toolify after changes are
                posted constitutes your acceptance of the revised Terms. We will update the
                &quot;Last updated&quot; date above when changes are made.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Contact</h2>
              <p>
                Questions about these Terms? Contact us at{' '}
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-mono">
                  {contactEmail}
                </a>.
              </p>
            </section>

            <div className="pt-4 border-t border-white/10 flex gap-4">
              <Link href="/privacy" className="text-primary hover:underline text-sm">Privacy Policy</Link>
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

