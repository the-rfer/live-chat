import { Geist, Geist_Mono } from 'next/font/google';
import '@/css/globals.css';
import { AuthProvider } from '@/context/auth-context';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata = {
    title: 'Shh.chat',
    description: 'Simple, quick, private messaging made easy.',
};

export default function RootLayout({ children }) {
    return (
        <html lang='pt'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
