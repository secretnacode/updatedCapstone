import { NotificationProvider } from "@/component/client_component/provider/notificationProvider";
import "./globals.css";
import { LoadingProvider } from "@/component/client_component/provider/loadingProvider";
import Head from "next/head";
import { WindowProvider } from "@/provider/WindowProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          href="https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <WindowProvider>
          <LoadingProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </LoadingProvider>
        </WindowProvider>
      </body>
    </html>
  );
}
