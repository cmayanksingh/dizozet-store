import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const recentPurchasesList = [
  {
    name: "Rahul S.",
    city: "Mumbai",
    title: "2000+ GTA 6 Viral Reels Bundle",
    timeAgo: "Just now",
    thumbnail: "/images/gta6-bundle-cover.jpg",
    link: "/product/reels-bundle/rb-2000-gta-6-viral-reels"
  },
  {
    name: "Aman K.",
    city: "Delhi NCR",
    title: "1000+ AI Dogs Reels Bundle",
    timeAgo: "2 mins ago",
    thumbnail: "/images/1000-ai-dog-reels-bundle-1-2-1.png",
    link: "/reels-bundles"
  },
  {
    name: "Priya M.",
    city: "Bengaluru",
    title: "4000+ Cartoon Videos Bundle",
    timeAgo: "4 mins ago",
    thumbnail: "https://media-cdn.cosmofeed.com/chat/Neon-4000--Cartoon-Video-Bundle-2026-10-10-03-03-49.png?w=200&q=75",
    link: "/reels-bundles"
  },
  {
    name: "Karan D.",
    city: "Lucknow",
    title: "2000+ GTA 6 Viral Reels Bundle",
    timeAgo: "Just now",
    thumbnail: "/images/gta6-bundle-cover.jpg",
    link: "/product/reels-bundle/rb-2000-gta-6-viral-reels"
  },
  {
    name: "Vikram P.",
    city: "Pune",
    title: "1000+ Hot Webseries Reels Bundle",
    timeAgo: "1 min ago",
    thumbnail: "/images/1000-hot-webseries-clips-bundle-reels-bundle-4-2-1.jpg",
    link: "/reels-bundles"
  },
  {
    name: "Sameer R.",
    city: "Hyderabad",
    title: "3000+ Sigma Male Reels Bundle",
    timeAgo: "3 mins ago",
    thumbnail: "/images/sigma-male-reels-bundle-5-2-1.jpg",
    link: "/reels-bundles"
  },
  {
    name: "Deepak B.",
    city: "Ahmedabad",
    title: "1000+ Premanand Ji Maharaj Reels Bundle",
    timeAgo: "5 mins ago",
    thumbnail: "/images/premanand-ji-maharaj-reels-bundle-4-2.png",
    link: "/reels-bundles"
  },
  {
    name: "Neha G.",
    city: "Jaipur",
    title: "10000+ Hot Girls Reels Bundle",
    timeAgo: "2 mins ago",
    thumbnail: "/images/10000-hot-girls-reels-bundle-4-2-1.jpg",
    link: "/reels-bundles"
  }
];

export default function RecentSalesToast() {
  const { orders } = useStore();
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    let currentIndex = 0;
    let hideTimer = null;
    let nextTimer = null;

    const triggerNotification = () => {
      // Pick notification
      const item = recentPurchasesList[currentIndex % recentPurchasesList.length];
      currentIndex++;

      setCurrentNotification(item);
      setIsVisible(true);

      // Hide after 5 seconds
      hideTimer = setTimeout(() => {
        setIsVisible(false);
        // Wait 7 seconds before showing next
        nextTimer = setTimeout(triggerNotification, 7000);
      }, 5500);
    };

    // First appearance: EXACTLY 2 seconds after page loads
    const initialTimer = setTimeout(() => {
      triggerNotification();
    }, 2000);

    return () => {
      clearTimeout(initialTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (nextTimer) clearTimeout(nextTimer);
    };
  }, [isDismissed]);

  if (!currentNotification || isDismissed) return null;

  return (
    <div
      className={`fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 max-w-[260px] sm:max-w-sm transition-all duration-500 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xl p-2 sm:p-3.5 flex items-center gap-2 sm:gap-3 relative hover:border-teal-500/50 transition-all group">
        
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setTimeout(() => setIsDismissed(true), 500);
          }}
          className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-xs text-[10px] opacity-70 group-hover:opacity-100"
          title="Dismiss notification"
        >
          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </button>

        {/* Thumbnail */}
        <Link to={currentNotification.link} className="shrink-0 relative">
          <img
            src={currentNotification.thumbnail}
            alt={currentNotification.title}
            className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover bg-slate-900 border border-slate-200 shadow-xs"
            onError={(e) => {
              e.target.src = '/images/icon.png';
            }}
          />
          <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-emerald-500 rounded-full border border-white flex items-center justify-center animate-pulse" />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 pr-1 sm:pr-2">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-slate-900">
            <span className="truncate">{currentNotification.name}</span>
            <span className="text-slate-400 font-normal">•</span>
            <span className="text-slate-500 font-semibold text-[9px] sm:text-[10px] truncate">{currentNotification.city}</span>
          </div>

          <Link
            to={currentNotification.link}
            className="text-[11px] sm:text-xs font-black text-slate-800 hover:text-teal-700 truncate block transition-colors leading-tight mt-0.5"
            title={currentNotification.title}
          >
            {currentNotification.title}
          </Link>

          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 text-[9px] sm:text-[10px]">
            <span className="text-emerald-700 font-extrabold flex items-center gap-0.5 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
              <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-600" /> Verified
            </span>
            <span className="text-slate-400 font-medium">
              {currentNotification.timeAgo}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
