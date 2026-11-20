import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917895768118?text=Hi%2C%20I%20want%20to%20order%20a%20subscription%20or%20need%20help"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 sm:p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
      title="Chat & Order on WhatsApp: 7895768118"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full animate-ping" />
        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-200 rounded-full" />
      </div>
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pl-0 group-hover:pl-1">
        Order on WhatsApp (7895768118)
      </span>
    </a>
  );
}
