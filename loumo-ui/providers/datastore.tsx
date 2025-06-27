import {
  Category,
  Order,
  OrderItem,
  ProductVariant,
  User,
} from "@/types/types";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  orders: Order[];
  setOrders: (order: Order[]) => void;
  resetUser: () => void;

  currentOrderItems: OrderItem[];

  addOrderItem: (item: { variant: ProductVariant; note: string }, quantity?:number) => void;
  incrementOrderItem: (variantId: number) => void;
  decrementOrderItem: (variantId: number) => void;
  removeOrderItem: (variantId: number) => void;

  getOrderTotal: () => number;

  orderNote: string;
  orderAddressId: number | null;
  setOrderNote: (note: string) => void;
  setOrderAddress: (addressId: number) => void;
  resetOrderDraft: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
      logout: () => set({ user: null }),
      categories: [],
      setCategories: (categories) => set(() => ({ categories })),
      orders: [],
      setOrders: (orders) => set(() => ({ orders })),
      resetUser: () =>
        set(() => ({
          user: null,
        })),

      currentOrderItems: [],
      orderNote: "",
      orderAddressId: null,

      addOrderItem: ({ variant, note },quantity=1) => {
        const existing = get().currentOrderItems.find(
          (x) => x.productVariantId === variant.id
        );

        if (existing) {
          set((state) => ({
            currentOrderItems: state.currentOrderItems.map((x) =>
              x.productVariantId === variant.id
                ? {
                    ...x,
                    quantity: x.quantity + quantity,
                    total: (x.quantity + quantity) * (variant.price || 0),
                  }
                : x
            ),
          }));
          toast.info(`Increased quantity for ${variant.name}`);
        } else {
          const price = variant.price || 0;
          const newItem: OrderItem = {
            id: 0,
            orderId: 0,
            note,
            productVariant: variant,
            productVariantId: variant.id,
            quantity: quantity,
            total: price,
            deliveryId: null,
          };

          set((state) => ({
            currentOrderItems: [...state.currentOrderItems, newItem],
          }));

          toast.success(`Added ${variant.name} to order`);
        }
      },

      incrementOrderItem: (variantId) =>
        set((state) => ({
          currentOrderItems: state.currentOrderItems.map((x) =>
            x.productVariantId === variantId
              ? {
                  ...x,
                  quantity: x.quantity + 1,
                  total: (x.quantity + 1) * (x.productVariant?.price || 0),
                }
              : x
          ),
        })),

      decrementOrderItem: (variantId) =>
        set((state) => ({
          currentOrderItems: state.currentOrderItems
            .map((x) =>
              x.productVariantId === variantId
                ? {
                    ...x,
                    quantity: x.quantity - 1,
                    total: (x.quantity - 1) * (x.productVariant?.price || 0),
                  }
                : x
            )
            .filter((x) => x.quantity > 0),
        })),

      removeOrderItem: (variantId) =>
        set((state) => ({
          currentOrderItems: state.currentOrderItems.filter(
            (x) => x.productVariantId !== variantId
          ),
        })),

      getOrderTotal: () =>
        get().currentOrderItems.reduce((total, item) => total + item.total, 0),

      setOrderNote: (note) => set({ orderNote: note }),
      setOrderAddress: (addressId) => set({ orderAddressId: addressId }),

      resetOrderDraft: () =>
        set({
          currentOrderItems: [],
          orderNote: "",
          orderAddressId: null,
        }),
    }),
    {
  name: "ecommerce-store",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    ...state,
    user: null, 
    orders: [], 
    categories: [], 
    orderAddressId: null, 
    currentOrderItems: state.currentOrderItems,
    orderNote: state.orderNote
  })
}
  )
);
