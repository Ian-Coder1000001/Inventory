import './globals.css';

export const metadata = {
  title: 'Inventory Portal',
  description: 'Private inventory management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}