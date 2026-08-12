import './globals.css';

export const metadata = {
  title: 'Movie Catalog',
  description: 'Movies from our Telegram channel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
