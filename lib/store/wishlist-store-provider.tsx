"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type WishlistStore,
  createWishlistStore,
} from "@/lib/store/wishlist-store";

export type WishlistStoreApi = ReturnType<typeof createWishlistStore>;

export const WishlistStoreContext = createContext<WishlistStoreApi | undefined>(
  undefined
);

export interface WishlistStoreProviderProps {
  children: ReactNode;
}

export const WishlistStoreProvider = ({
  children,
}: WishlistStoreProviderProps) => {
  const storeRef = useRef<WishlistStoreApi>(undefined);
  if (!storeRef.current) {
    storeRef.current = createWishlistStore();
  }

  return (
    <WishlistStoreContext.Provider value={storeRef.current}>
      {children}
    </WishlistStoreContext.Provider>
  );
};

export const useWishlistStore = <T,>(
  selector: (store: WishlistStore) => T
): T => {
  const wishlistStoreContext = useContext(WishlistStoreContext);

  if (!wishlistStoreContext) {
    throw new Error(
      `useWishlistStore must be used within WishlistStoreProvider`
    );
  }

  return useStore(wishlistStoreContext, selector);
};

// Helper hooks
export const useWishlistItems = () => useWishlistStore((state) => state.items);
export const useWishlistActions = () => {
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  
  return { addItem, removeItem, clearWishlist, isInWishlist };
};
