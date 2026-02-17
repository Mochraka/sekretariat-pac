import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Sekretariat PAC IPNU IPPNU Kec. Taman',
    template: '%s | PAC IPNU IPPNU Kec. Taman',
  },
  description:
    'Website resmi Sekretariat Pimpinan Anak Cabang IPNU IPPNU Kecamatan Taman. Portal informasi kegiatan, arsip surat, dan dokumentasi organisasi.',
}

export const viewport: Viewport = {
  themeColor: '#1a7a3a',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
