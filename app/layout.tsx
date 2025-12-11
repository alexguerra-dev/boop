import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Boop - 4d4.live',
    description: "It's hard not to boop.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
