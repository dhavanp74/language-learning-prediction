import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Language Learning Signal Studio',
  description: 'Interactive language learning outcome prediction dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
