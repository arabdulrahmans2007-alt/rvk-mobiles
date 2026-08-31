import React from 'react';
import { Home, ShoppingBag, Smartphone, Tag, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function MobileNav({ currentRoute, setCurrentRoute }) {
  const { totalCount, setIsCartOpen } = useCart();
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Shop', icon: ShoppingBag },
    { id: 'display-service', label: 'Repair', icon: Smartphone },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, isCart: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.id;
        if (item.isCart) {
          return (
            <button
              key={item.id}
              onClick={() => setIsCartOpen(true)}
              className="relative flex flex-col items-center justify-center p-1 text-slate-600 hover:text-brand-600"
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        }
        return (
          <button
            key={item.id}
            onClick={() => setCurrentRoute(item.id)}
            className={`flex flex-col items-center justify-center p-1 ${isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}