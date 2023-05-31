import './globals.scss'

export const metadata = {
  title: 'Polyrhythmic Metronome',
  description: 'Polyrhythm is the simultaneous use of two or more rhythms that are not readily perceived as deriving from one another',
}

export default function RootLayout({ children}: IRootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

interface IRootLayoutProps {
  children: React.ReactNode
}