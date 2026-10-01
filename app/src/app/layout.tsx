import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import type { Metadata } from 'next';
import './globals.css';
import './theme.css';
export const metadata: Metadata = { title: 'Edusentinel | Every student, a clearer story', description: 'A thoughtful workspace for exploring learning patterns and student progress.', icons: { icon: '/edusentinel-logo.svg' } };
export default function Layout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
