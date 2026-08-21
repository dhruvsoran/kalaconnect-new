# कलाConnect (KalaConnect) 🎨

A production-ready AI-powered digital marketplace connecting Indian artisans directly with art lovers worldwide. Built with Next.js 15, MongoDB, and Genkit AI.

## Features

### For Buyers
- Browse authentic handcrafted artworks from verified artisans
- Like , share comment on product of artisan
- Secure checkout with UPI, Cards, and Net Banking
- Real-time order tracking with status history timeline
- Rate and review purchases
- Wishlist and cart management
- AI-powered art recommendations

### For Artisans
- Free marketplace to sell artwork online
- AI-generated product descriptions from photos
- Auto-create social media posts and marketing campaigns
- Order management with Amazon-style status updates
- Analytics dashboard to track sales and growth
- Voice support for managing shop in local languages

### For Admin
- Complete platform oversight with role-based access
- Manage products, orders, users, and artisans
- System logs viewer with error tracking and activity monitoring
- Contact message management
- Revenue and analytics overview

### AI-Powered Tools (Genkit + Gemini)
- **Product Storyteller**: Generates culturally rich descriptions from images
- **Marketing Assistant**: Creates social media posts and email campaigns
- **24/7 Chatbot**: Helps artisans set up shops and buyers find art
- **Smart Matching**: Connects art styles with the right buyers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + ShadCN UI |
| Database | MongoDB (Atlas) |
| Auth | JWT (localStorage + API) |
| AI Engine | Genkit + Gemini |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Playfair Display + PT Sans |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- Google AI (Gemini) API key



### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Creating an Admin User

```bash
curl -X POST http://localhost:3000/api/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kalaconnect.me","password":"your_password","name":"Admin","secret":"your_setup_secret"}'
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Login, register, me endpoints
│   │   ├── db/            # Generic CRUD API with role-based access
│   │   ├── setup/         # Admin user creation
│   │   └── stats/         # Platform statistics
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # Artisan & buyer dashboards
│   │   ├── orders/        # Order management & tracking
│   │   ├── products/      # Product CRUD (artisan)
│   │   ├── analytics/     # AI-powered analytics
│   │   ├── chatbot/       # AI assistant
│   │   └── marketing/     # AI marketing tools
│   ├── explore/           # Marketplace browse page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Secure checkout
│   ├── login/             # User login
│   ├── register/          # User registration (buyer/artisan)
│   ├── not-found.tsx      # Custom 404 page
│   ├── error.tsx          # Custom 500 error boundary
│   └── access-denied/     # Custom 403 page
├── components/            # Reusable UI components
├── lib/
│   ├── db.ts              # Database models & queries
│   ├── actions.ts         # Server actions
│   ├── logger.ts          # Client-side logging utility
│   ├── jwt.ts             # JWT token utilities
│   ├── password.ts        # Password hashing
│   └── mongodb.ts         # MongoDB connection
├── ai/
│   └── flows/             # Genkit AI flows
├── middleware.ts           # Auth redirect middleware
└── hooks/                 # Custom React hooks
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register buyer/artisan |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/me` | Get current user (requires token) |

### Database (Role-Based Access)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/db/products` | List products (active for buyers, all for admin) |
| POST | `/api/db/products` | Create product (artisan/admin only) |
| GET | `/api/db/orders` | List orders (buyer sees own, artisan sees their products', admin sees all) |
| POST | `/api/db/orders` | Place order (buyer) |
| PATCH | `/api/db/orders/:id` | Update order status (artisan/admin) |
| GET | `/api/db/users` | List users (admin only) |
| GET | `/api/db/contactMessages` | List messages (admin only) |
| POST | `/api/db/contactMessages` | Send contact message (public) |
| GET | `/api/db/systemLogs` | System logs (admin only) |
| GET | `/api/stats` | Platform statistics |

## User Isolation

All users are fully isolated:
- **Buyers** can only see their own orders and data
- **Artisans** can only see orders containing their products
- **Admin** has full access to all data
- **Contact messages** are only visible to admin
- **System logs** are only visible to admin

## Error Pages

| Status | Page | Description |
|--------|------|-------------|
| 404 | Custom not-found | Branded page with navigation links |
| 500 | Custom error boundary | Error details with retry option |
| 403 | Access denied | Redirects to login |

## Admin Monitoring

The admin dashboard includes a **Logs** tab that automatically tracks:
- User registrations and login attempts
- Order placements and status changes
- Product creation and deletion
- Failed authentication attempts (as warnings)
- System errors

## License

Private - Developed by Dhruv Soran
