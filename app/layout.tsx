import { NotificationProvider } from "@/component/client_component/provider/notificationProvider";
import "./globals.css";
import { LoadingProvider } from "@/component/client_component/provider/loadingProvider";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <link
            href="https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.css"
            rel="stylesheet"
          />
        </Head>
        <body className="antialiased">
          <LoadingProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </LoadingProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
