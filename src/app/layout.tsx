import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import './globals.css';
import { AuthProvider } from '@/components/layout/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { Toaster } from '@/components/UiComponents';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/app-config';
import { getSession } from '@/lib/auth';
import { APP_DIR, APP_LANG } from '@/lib/i18n';
import { SIDEBAR_COLLAPSED_COOKIE } from '@/lib/preferences';

const yekanBakh = localFont({
  src: './fonts/YekanBakh-VF.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-yekan-bakh',
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

/** Applies the saved theme before first paint so there is no flash of the wrong theme. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`;

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [user, cookieStore] = await Promise.all([getSession(), cookies()]);
  const sidebarCollapsed = cookieStore.get(SIDEBAR_COLLAPSED_COOKIE)?.value === 'true';

  return (
    <html
      lang={APP_LANG}
      dir={APP_DIR}
      className={`dark ${yekanBakh.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${yekanBakh.className} bg-background font-sans text-foreground antialiased`}
      >
        <AuthProvider user={user}>
          {user ? <AppShell sidebarCollapsed={sidebarCollapsed}>{children}</AppShell> : children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

/** Authenticated chrome: skip link, sidebar, header, main region. */
function AppShell({
  sidebarCollapsed,
  children,
}: {
  sidebarCollapsed: boolean;
  children: ReactNode;
}) {
  return (
    <SidebarProvider defaultCollapsed={sidebarCollapsed}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        رفتن به محتوای اصلی
      </a>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
