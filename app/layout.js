import './globals.css';

export const metadata = {
  title: 'Inventory Portal',
  description: 'Private inventory management',
};

// FIX: Prevent accidental zooming on mobile inputs
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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


// import './globals.css';

// export const metadata = {
//   title: 'Inventory Portal',
//   description: 'Private inventory management',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="bg-zinc-950 text-white min-h-screen antialiased">
//         {children}
//       </body>
//     </html>
//   );
// }