import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FoodSolution - Conseil économique pour la restauration',
  description: 'Calculez le seuil de rentabilité de chaque plat en fonction du coût réel des matières premières.',
  keywords: ['restaurant', 'rentabilité', 'food cost', 'marge', 'gestion'],
  authors: [{ name: 'FoodSolution' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FoodSolution',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#6366F1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased h-full">
        <div className="container-app h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
