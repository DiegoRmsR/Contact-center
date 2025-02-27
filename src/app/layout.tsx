import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { AgentsProvider } from '@/context/AgentsContext';
import { ClientsProvider } from '@/context/ClientsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Contact Center Dashboard',
  description: 'Dashboard for managing agents and clients in a Contact Center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AgentsProvider>
          <ClientsProvider>
            <header className="bg-blue-600 text-white shadow-md">
              <div className="container mx-auto p-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold">Contact Center Dashboard</h1>
                  <nav>
                    <ul className="flex space-x-4">
                      <li>
                        <Link href="/" className="hover:underline">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/agents" className="hover:underline">
                          Agents
                        </Link>
                      </li>
                      <li>
                        <Link href="/clients" className="hover:underline">
                          Clients
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </header>
            <main>{children}</main>
          </ClientsProvider>
        </AgentsProvider>
      </body>
    </html>
  );
}
