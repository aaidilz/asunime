import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Otakudesu Scraper UI',
  description: 'Streaming anime sub indo',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-950 text-white">
        <header className="bg-gray-900 p-4 shadow">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">Asunime</h1>
          </div>
        </header>
        <main className="container mx-auto py-6 px-4">{children}</main>
      </body>
    </html>
  );
}
