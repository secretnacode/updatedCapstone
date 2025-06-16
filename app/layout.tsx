import { NotificationProvider } from "./component/client_component/provider/notificationProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
