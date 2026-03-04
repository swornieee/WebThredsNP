import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart");
      setCart(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const addToCart = async (productId) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cart", { productId, quantity: 1 });
      setCart(res.data);
      toast.success("Added to cart!");
    } catch (e) {
      toast.error("Failed to add to cart");
    }
    setLoading(false);
  };

  const removeFromCart = async (id) => {
    try {
      const res = await axios.delete(`/api/cart/${id}`);
      setCart(res.data);
      toast.success("Removed from cart");
    } catch (e) {
      toast.error("Error removing item");
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      const res = await axios.put(`/api/cart/${id}`, { quantity });
      setCart(res.data);
    } catch (e) {
      toast.error("Error updating quantity");
    }
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
