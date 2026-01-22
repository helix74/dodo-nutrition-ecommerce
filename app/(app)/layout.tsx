import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "@/components/ui/sonner";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/app/CartSheet";
import { ChatSheet } from "@/components/app/ChatSheet";
import { AppShell } from "@/components/app/AppShell";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
        <ChatStoreProvider>
          <AppShell>
            <div className="flex min-h-screen flex-col">
              <TopBar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AppShell>
          <CartSheet />
          <ChatSheet />
          <Toaster position="bottom-center" />
          <SanityLive />
        </ChatStoreProvider>
    </ClerkProvider>
  );
}

export default AppLayout;
