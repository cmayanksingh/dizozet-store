import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Clock4, 
  MessageCircle, 
  ArrowLeft, 
  Sparkles,
  Layers,
  Tv,
  Film
} from 'lucide-react';

export default function DigitalProductsPage() {
  return (
    <div className="pb-12 sm:pb-24 pt-4 sm:pt-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
      
      {/* Breadcrumb */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Main Coming Soon Banner Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 border border-slate-200 text-center space-y-4 sm:space-y-6 shadow-xs sm:shadow-sm">
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#a1e3d8]/30 text-teal-800 flex items-center justify-center mx-auto border border-[#a1e3d8]/50 shadow-xs sm:shadow-sm">
          <Clock4 className="w-7 h-7 sm:w-10 sm:h-10" />
        </div>

        <span className="inline-block bg-[#a1e3d8] text-slate-900 font-extrabold text-[10px] sm:text-xs uppercase px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full shadow-xs">
          Coming Soon
        </span>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Digital Products & Templates
        </h1>

        <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          We are currently preparing high-converting Notion Creator Workspaces, Canva Social Media Megapacks, AI Prompts Databases, and Video Editing LUTs.
        </p>

        {/* WhatsApp Notification CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
          <a
            href="https://wa.me/917895768118?text=Hi%2C%20please%20notify%20me%20when%20Digital%20Products%20launch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Notify Me on WhatsApp (7895768118)</span>
          </a>

          <Link
            to="/subscriptions"
            className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Tv className="w-4 h-4 text-[#a1e3d8]" />
            <span>Browse Subscriptions</span>
          </Link>
        </div>
      </div>

      {/* Other Available Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/subscriptions"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-[#a1e3d8] text-slate-800 flex items-center justify-center font-bold transition-colors">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-teal-800 text-base">Subscriptions</h3>
              <p className="text-xs text-slate-500">Gemini, Netflix, Canva, ChatGPT</p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-800 group-hover:translate-x-1 transition-transform">Explore →</span>
        </Link>

        <Link
          to="/reels-bundles"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#a1e3d8] shadow-sm flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-[#a1e3d8] text-slate-800 flex items-center justify-center font-bold transition-colors">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-teal-800 text-base">Reels Bundles</h3>
              <p className="text-xs text-slate-500">130+ Viral Bundles with Google Drive Access</p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-800 group-hover:translate-x-1 transition-transform">Explore →</span>
        </Link>
      </div>

    </div>
  );
}
