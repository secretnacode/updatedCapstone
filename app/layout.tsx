import { NotificationProvider } from "@/component/client_component/provider/notificationProvider";
import "./globals.css";
import { LoadingProvider } from "@/component/client_component/provider/loadingProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LoadingProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
