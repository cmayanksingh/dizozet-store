export const initialStoreConfig = {
  storeName: "Dizo Pulse",
  storeTagline: "Premium Subscriptions & Viral Reels Bundles",
  currencySymbol: "₹",
  supportEmail: "support@dizopulse.com",
  supportWhatsApp: "+91 78957 68118",
  whatsappNumber: "7895768118",
  whatsappLink: "https://wa.me/917895768118?text=Hi%2C%20I%20want%20to%20order%20from%20Dizo%20Pulse",
  upiId: "dizopulse@upi",
  upiQrImage: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=dizopulse@upi&pn=Dizo%20Pulse&cu=INR",
  razorpayKeyId: "rzp_test_dizopulse12345",
  stripePublishableKey: "pk_test_dizopulse_mock",
  paymentMethods: {
    upiQr: true,
    cardRazorpay: true,
    stripe: true,
    netBanking: true
  },
  announcementText: "",
  guaranteeText: "100% Genuine Licenses • 24/7 WhatsApp Support: 7895768118 • Instant Replacement Guarantee"
};

export const whyChooseUsFeatures = [
  {
    icon: "Zap",
    title: "Instant Delivery",
    description: "Your download links, Google Drive folders, or login credentials appear promptly on-screen & via WhatsApp."
  },
  {
    icon: "ShieldCheck",
    title: "100% Genuine & Replacement Warranty",
    description: "All subscriptions and products come with full warranty. If you ever face an issue, our support team fixes or replaces it quickly."
  },
  {
    icon: "Tag",
    title: "Transparent & Direct Pricing",
    description: "Honest, straightforward pricing on premium subscriptions and high-quality viral video bundles."
  },
  {
    icon: "Headphones",
    title: "Dedicated WhatsApp Support",
    description: "Direct assistance on WhatsApp (+91 78957 68118) for all subscription activations, plan renewals, and inquiries."
  },
  {
    icon: "Sparkles",
    title: "Lifetime Updates & No Watermarks",
    description: "Reels are watermark-free, 1080p full HD, and ready to post or resell with full commercial rights."
  },
  {
    icon: "CreditCard",
    title: "Safe & Encrypted Payments",
    description: "Pay securely using UPI QR, Google Pay, PhonePe, Paytm, Credit/Debit cards, or Net Banking."
  }
];

export const customerReviews = [
  {
    id: "rev-1",
    name: "Aarav Sharma",
    role: "Content Creator, Delhi",
    rating: 5,
    title: "Grew my Instagram from 4k to 120k in 2 months!",
    comment: "The Cartoon and AI Reels bundles are absolute goldmines. Clean HD quality, no watermark, and the audio sync is spot on. Saved me easily 5 hours of editing every day. Support on WhatsApp answered my query in 2 minutes!",
    purchasedItem: "4000+ Ready-to-Upload 2D & 3D Cartoon Videos",
    date: "2 days ago",
    verified: true
  },
  {
    id: "rev-2",
    name: "Priya Patel",
    role: "Graphic Designer, Ahmedabad",
    rating: 5,
    title: "Canva Pro & Gemini AI worked flawlessly",
    comment: "Canva Pro was activated directly on my existing Gmail within 60 seconds. All Brand Kits and Magic Studio features unlocked. WhatsApp team was super quick to assist.",
    purchasedItem: "Canva Pro Lifetime + Gemini AI",
    date: "1 week ago",
    verified: true
  },
  {
    id: "rev-3",
    name: "Rohan Mehta",
    role: "Digital Marketing Agency, Mumbai",
    rating: 5,
    title: "Reseller license generated high client revenue",
    comment: "Bought the Motivation and Fitness bundles with commercial reseller rights. Repackaged them and provided them to clients. High return on investment.",
    purchasedItem: "Fitness & Gym Reels Mega Bundle (Reseller Rights)",
    date: "3 weeks ago",
    verified: true
  },
  {
    id: "rev-4",
    name: "Ananya Verma",
    role: "Video Editor & Creator, Bangalore",
    rating: 5,
    title: "CapCut Pro PC and ChatGPT Plus are lifesavers",
    comment: "Auto-captions in CapCut without watermark made my reels look so professional. Ordered on WhatsApp and received credentials within 2 minutes!",
    purchasedItem: "CapCut Pro + ChatGPT Plus",
    date: "Just now",
    verified: true
  }
];

export const generalFaqs = [
  {
    question: "How do I order subscriptions via WhatsApp?",
    answer: "For all subscriptions, simply click 'Buy Now' on the product card or product page. It automatically opens WhatsApp with our official support number (7895768118) with the selected plan details pre-filled. Our team will verify and activate your subscription immediately!"
  },
  {
    question: "How do I receive Reels Bundles?",
    answer: "Reels Bundles are delivered automatically! You can buy them directly on the website and get instant Google Drive download links on-screen and via email."
  },
  {
    question: "Are the Reels Bundles free of watermarks?",
    answer: "Yes! All reels bundles are completely watermark-free, 1080x1920 Full HD MP4 files. Reseller license packages also allow you to resell them to clients and keep 100% profits."
  },
  {
    question: "What payment methods are supported?",
    answer: "We support instant UPI (Google Pay, PhonePe, Paytm, BHIM), UPI QR Code scanning, WhatsApp Pay, Credit Cards, Debit Cards, and Net Banking."
  },
  {
    question: "What is your replacement and warranty policy?",
    answer: "We provide full replacement guarantee for all subscriptions throughout your active plan duration. If any account ever experiences downtime or login errors, our WhatsApp team (+91 78957 68118) fixes or replaces it promptly."
  }
];
