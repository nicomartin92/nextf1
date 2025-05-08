import Nav from './components/navigation/nav'
import './globals.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <body className="mx-auto">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
