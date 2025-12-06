import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import { Header } from "@/components/app/Header";
import { CartSheet } from "@/components/app/CartSheet";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <Header />
        <main>{children}</main>
        <CartSheet />
        <SanityLive />
      </CartStoreProvider>
    </ClerkProvider>
  );
}

export default AppLayout;
