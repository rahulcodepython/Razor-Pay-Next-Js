import './globals.css'
import Script from 'next/script'

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" defer></Script>
        </html>
    )
}