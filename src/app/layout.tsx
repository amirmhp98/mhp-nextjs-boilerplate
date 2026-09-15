import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DirectionProvider, Toaster } from "@/components/UiComponents";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { getSession } from "@/lib/auth";
import { locale } from "@/lib/locale";
import { t } from "@/lib/t";

// Persian typeface; globals.css picks it up under [lang="fa"] via --font-yekan-bakh.
const yekanBakh = localFont({
  src: "./fonts/YekanBakh-VF.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-yekan-bakh",
});

export const metadata: Metadata = {
  title: "{{PROJECT_NAME}}",
  description: "{{PROJECT_NAME}} — built with Next.js boilerplate",
};

// Applies the stored theme before first paint to avoid a flash.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html
      lang={locale.lang}
      dir={locale.dir}
      className={`dark ${yekanBakh.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <DirectionProvider>
          <AuthProvider user={user}>
            {user ? (
              <SidebarProvider>
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
                >
                  {t("shell.skipToContent")}
                </a>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <Header />
                    <main id="main-content" className="flex-1">
                      {children}
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            ) : (
              // Unauthenticated (login page): no app shell
              children
            )}
          </AuthProvider>
          <Toaster />
        </DirectionProvider>
      </body>
    </html>
  );
}
