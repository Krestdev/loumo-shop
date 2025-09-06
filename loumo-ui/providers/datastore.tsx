import { getBestPromotionPrice } from "@/lib/utils";
import {
  Address,
  Category,
  Order,
  OrderItem,
  ProductVariant,
  Promotion,
  User,
} from "@/types/types";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  user: User | null;
  setUser: (user: User) => void;
  address: Address | null;
  setAddress: (address: Address) => void;
  logout: () => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  orders: Order[];
  setOrders: (order: Order[]) => void;
  resetUser: () => void;
  setIsHydrated: (v: boolean) => void;
  isHydrated: boolean;

  successMobileOpen: boolean;
  failedPaiement: boolean;
  pendingPaiement: boolean;
  setSuccessMobileOpen: (v: boolean) => void;
  setFailedPaiement: (v: boolean) => void;
  setPendingPaiement: (v: boolean) => void;

  currentOrderItems: OrderItem[];

  addOrderItem: (
    item: { variant: ProductVariant; note: string; promotions: Promotion[] },
    quantity?: number
  ) => void;

  updateOrderItem: (variantId: number, quantity: number) => void;

  incrementOrderItem: (variantId: number, promotions: Promotion[]) => void;

  decrementOrderItem: (variantId: number, promotions: Promotion[]) => void;

  removeOrderItem: (variantId: number) => void;

  clearCart: () => void;

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
      isHydrated: false,

      setIsHydrated: (v) => set(() => ({ isHydrated: v })),
      user: null,
      setUser: (user) => set(() => ({ user })),
      address: null,
      setAddress: (address) => set(() => ({ address })),
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

      addOrderItem: ({ variant, note, promotions }, quantity = 1) => {
        const { currentOrderItems } = get();
        const existing = currentOrderItems.find(x => x.productVariantId === variant.id);
        const promoPrice = getBestPromotionPrice(variant, promotions);

        if (existing) {
          const newQuantity = existing.quantity + quantity;
          set((state) => ({
            currentOrderItems: state.currentOrderItems.map((x) =>
              x.productVariantId === variant.id
                ? {
                  ...x,
                  quantity: newQuantity,
                  total: newQuantity * promoPrice,
                  note: note || x.note, // Garder la note existante si nouvelle note non fournie
                }
                : x
            ),
          }));
          toast.info(`Increased quantity for ${variant.name}`);
        } else {
          const newItem: OrderItem = {
            id: 0,
            orderId: 0,
            note,
            productVariant: variant,
            productVariantId: variant.id,
            quantity,
            total: promoPrice * quantity,
            deliveryId: null,
          };

          set((state) => ({
            currentOrderItems: [...state.currentOrderItems, newItem],
          }));
          toast.success(`Added ${variant.name} to order`);
        }
      },

      updateOrderItem: (variantId, quantity) => {
        // Vérifier que la quantité est valide
        if (quantity <= 0) {
          set((state) => ({
            currentOrderItems: state.currentOrderItems.filter(
              (x) => x.productVariantId !== variantId
            ),
          }));
          return;
        }

        set((state) => {
          const updatedItems = state.currentOrderItems.map((x) => {
            if (x.productVariantId === variantId) {
              const unitPrice = x.total / x.quantity;
              return {
                ...x,
                quantity,
                total: unitPrice * quantity
              };
            }
            return x;
          });

          return { currentOrderItems: updatedItems };
        });
      },

      incrementOrderItem: (variantId, promotions) =>
        set((state) => ({
          currentOrderItems: state.currentOrderItems.map((x) => {
            if (x.productVariantId === variantId) {
              const price = getBestPromotionPrice(x.productVariant!, promotions);
              console.log(price);

              return {
                ...x,
                quantity: x.quantity + 1,
                total: (x.quantity + 1) * price,
              };
            }
            return x;
          }),
        })),



      decrementOrderItem: (variantId, promotions) =>
        set((state) => ({
          currentOrderItems: state.currentOrderItems
            .map((x) => {
              if (x.productVariantId === variantId) {
                const price = getBestPromotionPrice(x.productVariant!, promotions);
                return {
                  ...x,
                  quantity: x.quantity - 1,
                  total: (x.quantity - 1) * price,
                };
              }
              return x;
            })
            .filter((x) => x.quantity > 0),
        })),



      removeOrderItem: (variantId) =>
        set((state) => ({
          currentOrderItems: state.currentOrderItems.filter(
            (x) => x.productVariantId !== variantId
          ),
        })),

      clearCart: () => set({ currentOrderItems: [] }),

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


      // Modals for paiement status
      failedPaiement: false,
      pendingPaiement: false,
      successMobileOpen: false,
      setFailedPaiement: (v) => set({ failedPaiement: v }),
      setPendingPaiement: (v) => set({ pendingPaiement: v }),
      setSuccessMobileOpen: (v) => set({ successMobileOpen: v }),
    }),

    {
      name: "ecommerce-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        user: state.user,
        orders: state.orders,
        categories: state.categories,
        orderAddressId: state.orderAddressId,
        currentOrderItems: state.currentOrderItems,
        orderNote: state.orderNote
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true); // ✅ proper Zustand update
      },
    }
  )
);
