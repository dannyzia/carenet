"use client";
import { useState, useEffect } from "react";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { shopService } from "@/backend/services/shop.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { Link, useNavigate } from "react-router";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ChevronRight, CreditCard, Truck, ShieldCheck, Ticket } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/theme/tokens";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.cart", "Cart"));

  const navigate = useNavigate();
  const { data: initialCart, loading } = useAsyncData(() => shopService.getCartItems());
  const [cartItems, setCartItems] = useState<Awaited<ReturnType<typeof shopService.getCartItems>>>([]);

  useEffect(() => {
    if (initialCart) setCartItems(initialCart);
  }, [initialCart]);

  if (loading || !initialCart) return <PageSkeleton />;

  const updateQuantity = (id: number, delta: number) => { setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)); };
  const removeItem = (id: number) => { setCartItems(cartItems.filter(item => item.id !== id)); };
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + shipping;
  if (cartItems.length === 0) { return (<div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-6"><div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center text-gray-300"><ShoppingBag className="w-16 h-16" /></div><h2 className="text-2xl font-black text-gray-800">Your Cart is Empty</h2><Link to="/shop"><Button className="px-12 py-6 rounded-2xl bg-[#DB869A] text-white font-black shadow-xl">Start Shopping</Button></Link></div>); }
  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100"><div className="max-w-7xl mx-auto px-4 py-4"><h1 className="text-xl font-black text-gray-800">Shopping Cart ({cartItems.length})</h1></div></div>
      <div className="max-w-7xl mx-auto px-4 py-8"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-4">{cartItems.map((item) => (<div key={item.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 group"><div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div><div className="flex-1 space-y-2"><div className="flex justify-between items-start"><h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3><button onClick={() => removeItem(item.id)} className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button></div><div className="flex justify-between items-center pt-2"><span className="text-lg font-black text-[#DB869A]">{"\u09F3"}{item.price.toLocaleString()}</span><div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100 w-fit"><button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 rounded-lg hover:bg-white text-gray-500" disabled={item.quantity <= 1}><Minus className="w-4 h-4" /></button><span className="text-base font-black text-gray-800 min-w-[20px] text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 rounded-lg hover:bg-white text-gray-500"><Plus className="w-4 h-4" /></button></div></div></div></div>))}</div><div className="space-y-6"><div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6 sticky top-24"><h2 className="text-xl font-black text-gray-800">Order Summary</h2><div className="space-y-4 pt-4 border-t border-gray-100"><div className="flex justify-between text-gray-500 text-sm"><span>Subtotal</span><span className="font-bold text-gray-800">{"\u09F3"}{subtotal.toLocaleString()}</span></div><div className="flex justify-between text-gray-500 text-sm"><span>Shipping</span><span className={`font-bold ${shipping === 0 ? "text-[#5FB865]" : "text-gray-800"}`}>{shipping === 0 ? "FREE" : `\u09F3${shipping}`}</span></div></div><div className="pt-4 border-t border-gray-100 flex justify-between items-baseline"><span className="text-gray-500 text-sm">Total</span><span className="text-3xl font-black text-[#DB869A]">{"\u09F3"}{total.toLocaleString()}</span></div><Link to="/shop/checkout"><Button className="w-full h-16 rounded-2xl bg-[#DB869A] text-white text-lg font-black hover:bg-[#DB869A]/90 shadow-xl flex items-center justify-center gap-2">Checkout<ChevronRight className="w-5 h-5" /></Button></Link><div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><ShieldCheck className="w-4 h-4 text-[#7CE577]" /><span>Secure Payment Guaranteed</span></div></div></div></div></div>
    </div>
  );
}