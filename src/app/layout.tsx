import "~/styles/globals.css";

import { Poppins } from "next/font/google";
import Header from "~/components/Header";
import { ThemeProvider } from "~/components/theme-provider";
import QueryClientProvider from "~/components/QueryClientProvider";
import LeftNavAside from "~/components/LeftNavAside";
import { Toaster } from "~/components/ui/sonner";
import PostHogProvider from "~/components/PostHogProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
  icons: [{ rel: "icon", url: "/logo.webp" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider>
      <html lang="en" className="overflow-hidden" suppressHydrationWarning>
        <body className={`font-sans ${poppins.variable}`}>
          <PostHogProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <div className="flex h-dvh overflow-hidden">
                <Toaster position="bottom-right" className="z-50" />
                <LeftNavAside />
                <div className="flex flex-1 flex-col overflow-auto sm:gap-4 md:py-4">
                  <Header />
                  {children}
                </div>
              </div>
            </ThemeProvider>
          </PostHogProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}