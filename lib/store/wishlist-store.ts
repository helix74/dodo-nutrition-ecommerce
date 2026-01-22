import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  addedAt: number;
}

export interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

export interface WishlistActions {
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export type WishlistStore = WishlistState & WishlistActions;

export const defaultInitState: WishlistState = {
  items: [],
  isOpen: false,
};

export const createWishlistStore = (initState: WishlistState = defaultInitState) => {
  return createStore<WishlistStore>()(
    persist(
      (set, get) => ({
        ...initState,

        addItem: (item) =>
          set((state) => {
            const exists = state.items.some((i) => i.productId === item.productId);
            if (exists) return state;
            return { items: [...state.items, item] };
          }),

        removeItem: (productId) =>
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          })),

        isInWishlist: (productId) => {
          return get().items.some((i) => i.productId === productId);
        },

        clearWishlist: () => set({ items: [] }),
      }),
      {
        name: "wishlist-storage",
        skipHydration: true, // Important for Next.js SSR
      }
    )
  );
};
