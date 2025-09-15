export type Address = {
  street: string;
  local: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  published: boolean;
  zoneId: number | null;
  zone?: Zone;
  users?: User[];
  shops?: Shop[];
  orders?: Order[];
};

export type Zone = {
  name: string;
  id: number;
  price: number;
  addresses: Address[];
  status: string;
};

export type Agent = {
  id: number;
  userId: number;
  code: string;
  user?: User;
  delivery?: Delivery[];
};

export type Category = {
  name: string;
  id: number;
  weight: number;
  status: boolean;
  products?: Product[];
  imgUrl?: string;
  slug: string;
  display: boolean;
};

export type Delivery = {
  id: number;
  status: string;
  agentId: number | null;
  orderId: number;
  orderItem?: OrderItem[];
  agent?: Agent;
  order?: Order;
};

export type Log = {
  id: number;
  createdAt: Date | null;
  description: string;
  userId: number | null;
  user?: User;
  action: string;
};

export type NotificationT = {
  id: number;
  createdAt: Date;
  description: string;
  userId: number;
  user?: User;
  action: string;
};

export type Order = {
  ref: string;
  id: number;
  userId: number;
  note: string;
  address: Address;
  addressId: number;
  orderItems?: (Partial<OrderItem>&{shopId?: number})[];
  payment?: Payment;
  delivery?: Delivery[];
  createdAt: Date;
  total: number;
  status: "FAILED" | "COMPLETED" | "PROCESSING" | "REJECTED" | "ACCEPTED" | "PENDING" | "CANCELED";
  weight: number;
  deliveryFee: number;
  user: User;
};

export type OrderItem = {
  id: number;
  orderId: number;
  order?: Order;
  note: string;
  productVariant: ProductVariant;
  productVariantId: number;
  quantity: number;
  total: number;
  deliveryId: number | null;
  delivery?: Delivery;
};

export type Payment = {
  name: string;
  id: number;
  status: "FAILED" | "COMPLETED" | "PROCESSING" | "REJECTED" | "ACCEPTED" | "PENDING";
  orderId: number;
  order?: Order[];
  total: number;
  ref: string;
  tel: string;
  method: string;
};

export type Permission = {
  id: number;
  action: string;
  role?: Role[];
};

export type Product = {
  name: string;
  slug: string,
  id: number;
  createdAt: Date;
  updatedAt: Date;
  weight: number;
  status: boolean;
  categoryId: number | null;
  category?: Category;
  variants: ProductVariant[];
  description: string;
};

export type ProductVariant = {
  name: string;
  imgUrl?: string;
  id: number;
  weight: number;
  status: boolean;
  price: number;
  productId: number;
  product?: Product;
  stock: Stock[];
  quantity: number;
  unit: string;
  createdAt: Date;
};

export type Promotion = {
  id: number;
  code: string;
  percentage: number;
  expireAt: Date;
  stock?: Stock[];
};

export type Role = {
  id: number;
  name: string;
  permissions: Permission[];
  user?: User[];
};

export type Shop = {
  name: string;
  id: number;
  addressId: number | null;
  address?: Address;
};

export type Stock = {
  id: number;
  quantity: number;
  productVariantId: number;
  productVariant: ProductVariant;
  shopId: number;
  shop?: Shop;
  promotionId: number | null;
  promotion?: Promotion;
};

export type User = {
  id: number;
  email: string;
  password: string;
  name: string | null;
  passwordResetOtp: string | null;
  passwordResetOtpExpires: Date | null;
  tel: string | null;
  verified: boolean;
  verificationOtp: string | null;
  verificationOtpExpires: Date | null;
  active: boolean;
  imageUrl: string | null;
  roleId: number | null;
  role?: Role;
  orders?: Order[];
  favorite?: Product[];
  logs?: Log[];
  notifications?: NotificationT[];
  addresses?: Address[];
  fidelity?: number;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  token: string | null;
};

export type RegisterPayload = {
  name: string;
  email: string;
  tel: string;
  password: string;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  topic: Topic[];
  topicId: number;
};

export type Topic = {
  id: number;
  name: string;
  faqs: Faq[];
};

export type Setting = {
  id: number;
  name: string;
  content?: string;
  value?: number;
  note?: string;
  section: String;
  date?: Date;
};
