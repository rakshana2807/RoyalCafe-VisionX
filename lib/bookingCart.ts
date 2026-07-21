/**
 * lib/bookingCart.ts
 * Cross-page cart helper using localStorage.
 * Works seamlessly across Menu → Booking navigation and page refreshes.
 * Dispatches "cart-updated" window event after every mutation so UI components
 * can reactively re-render without polling.
 */

export interface CartMenuItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CartWifiPass {
  name: string;
  duration: string;
  price: number;
}

export interface BookingCart {
  menuItems: CartMenuItem[];
  wifiPass: CartWifiPass | null;
}

const CART_KEY = "bookingCart";

function dispatch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
}

/** Read current cart from localStorage (safe on SSR). */
export function getCart(): BookingCart {
  if (typeof window === "undefined") {
    return { menuItems: [], wifiPass: null };
  }
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { menuItems: [], wifiPass: null };
    return JSON.parse(raw) as BookingCart;
  } catch {
    return { menuItems: [], wifiPass: null };
  }
}

function saveCart(cart: BookingCart) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  dispatch();
}

/** Add a menu item. If already present, increments quantity instead. */
export function addMenuItem(item: Omit<CartMenuItem, "quantity">) {
  const cart = getCart();
  const idx = cart.menuItems.findIndex((m) => m.id === item.id);
  if (idx !== -1) {
    cart.menuItems[idx].quantity += 1;
  } else {
    cart.menuItems.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
}

/** Remove a menu item by id. */
export function removeMenuItem(id: string) {
  const cart = getCart();
  cart.menuItems = cart.menuItems.filter((m) => m.id !== id);
  saveCart(cart);
}

/** Increment or decrement quantity. Removes item if quantity reaches 0. */
export function updateMenuItemQty(id: string, delta: 1 | -1) {
  const cart = getCart();
  const idx = cart.menuItems.findIndex((m) => m.id === id);
  if (idx === -1) return;
  cart.menuItems[idx].quantity += delta;
  if (cart.menuItems[idx].quantity <= 0) {
    cart.menuItems.splice(idx, 1);
  }
  saveCart(cart);
}

/** Set or replace the WiFi pass. Pass null to remove. */
export function setWifiPass(pass: CartWifiPass | null) {
  const cart = getCart();
  cart.wifiPass = pass;
  saveCart(cart);
}

/** Compute derived totals. */
export function getCartTotals(cart: BookingCart) {
  const foodTotal = cart.menuItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const wifiTotal = cart.wifiPass?.price ?? 0;
  return { foodTotal, wifiTotal };
}

/** Empty the entire cart (call after booking is confirmed). */
export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  dispatch();
}
