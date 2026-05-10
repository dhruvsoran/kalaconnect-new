# कलाConnect (KalaConnect) 🎨

कलाConnect is a cutting-edge, AI-powered digital marketplace designed to empower Indian artisans and celebrate cultural heritage. It bridges the gap between traditional craftsmanship and the global digital economy.

## 🌟 Key Features

### 🤖 Generative AI Integration (Powered by Genkit)
- **AI Product Storyteller**: Generates rich, culturally relevant product descriptions from images and basic details.
- **AI Marketing Assistant**: Automatically creates social media posts and email campaigns for artisans.
- **KalaConnect AI Assistant**: A 24/7 chatbot to help artisans manage their shops and help buyers find the perfect art.
- **AI Curated Picks**: Personalized artwork recommendations for buyers based on their preferences.

### 👥 User Roles & Dashboards
- **Artisan Workspace**: Tools for listing products, tracking analytics, and using AI to grow their business.
- **Buyer Gallery**: A beautiful discovery feed with community interactions and purchase history.
- **Admin Command Center**: A master dashboard for the platform owner (**Dhruv**) to manage users, monitor revenue, and oversee all transactions.

### 💬 Community & Social
- **Likes & Comments**: Buyers can interact directly with heritage pieces and provide feedback to artisans.
- **Follow System**: Stay connected with your favorite creators.
- **Social Sharing**: Easily share beautiful Indian art across the web.

### 💳 E-Commerce Flow
- **Shopping Cart & Wishlist**: Manage favorites and intended purchases.
- **Secure Checkout**: Simulated payment gateway with support for Cards, UPI, and Net Banking.
- **Order Tracking**: Real-time status updates for buyers.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Backend**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **AI Engine**: [Genkit](https://firebase.google.com/docs/genkit) (Gemini 2.5/3.1)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Custom CSS Liquid Motion & Tailwind Animate

## 🎨 Visual Identity
- **Branding**: Uses "Playfair Display" for a premium, heritage feel.
- **Liquid Background**: A dynamic, site-wide fluid motion background that adapts to Light and Dark modes.
- **3D Effects**: Immersive hover animations on product cards.

## 🚀 Getting Started

### Prerequisites
- Node.js installed.
- A Firebase project with Auth (Email/Password) and Firestore enabled.
- Google AI (Gemini) API Key.

### Environment Variables
Create a `.env` file in the root:
```env
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
```

### Installation
```bash
npm install
npm run dev
```

## 👨‍💻 Developer
Developed by **Dhruv Soran**
