import Nav from "./components/navigation/nav"
import './globals.css'

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
          <Nav />
          <main>{children}</main>
        </body>
      </html>
    )
  }