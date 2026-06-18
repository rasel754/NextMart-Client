# NextMart Client

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.dotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

NextMart Client is a high-performance, feature-rich eCommerce front-end client application built using **Next.js 15 (App Router)** and **React 19**. It features global state management powered by **Redux Toolkit** and persistent store routing via **Redux Persist**, client-side and server-side authentication using **JWT and Next.js Server Actions**, dynamic role-based routing (RBAC) middleware protection, and beautiful typography and styling with **Tailwind CSS** and **Shadcn UI**.

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Interactive Home Page**: Dynamic Hero section, customized Category list cards/sliders, Featured Products display, and Flash Sales highlight.
- **Advanced Shopping Cart**: Full-featured cart system allowing users to add, increment, decrement, and remove items.
- **Dynamic Shipping Costs**: Automatically calculates shipping charges depending on destination (Flat ৳50 inside Dhaka, ৳100 outside Dhaka).
- **Persistent Cart State**: Cart content, shipping address, and checkout configuration are stored and rehydrated across reloads using Redux Persist.
- **Secure Checkout**: Seamless order creation integrated with backend Order APIs.

### 🏪 Vendor & Shop Management
- **Vendor Onboarding**: Quick shop creation flow for verified user accounts.
- **Complete Product Catalog Management**: CRUD dashboard allowing vendors to add and update products (including multi-image uploads via Form Data).
- **Brand & Category Administration**: Create and delete brands or product categories directly from the vendor layout.

### 🛡️ Security & Performance
- **Role-Based Access Control (RBAC)**: Next.js middleware dynamically monitors route protection for `user` and `admin` portals, routing users seamlessly back to login/home based on their authorization token.
- **Server-Side Authentication**: Employs Next.js Server Actions to safely handle user registration, logins, token cookies, and session decodes.
- **Bot Mitigation**: Google reCAPTCHA v3/v2 client-side widget verification, reinforced by server-side verification actions.
- **On-Demand Cache Revalidation**: Uses Next.js caching tag tags (`PRODUCT`, `Brands`, `CATEGORY`) to purge and refresh pages immediately after database mutations.

---

## 🛠️ Technical Stack

- **Core Framework**: [Next.js 15.1.6](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Global State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Styling & Theme**: [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/) primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod Schema Validation](https://zod.dev/)
- **Notifications**: [Sonner](https://ryabchikov.it/sonner/) Toast Manager
- **Auth Utils**: [jwt-decode](https://github.com/auth0/jwt-decode)
- **Security Check**: [React Google reCAPTCHA](https://github.com/dozoisch/react-google-recaptcha)

---

## 📂 Project Architecture

The codebase follows a modular directory structure designed for scalability and separation of concerns:

```
NextMart-Client/
├── src/
│   ├── app/                      # Next.js App Router (Layouts & Pages)
│   │   ├── (WithCommonLayout)/   # Routes with common Header & Footer (Home, Cart, Products, Shop Creation)
│   │   ├── (WithDashboardLayout)/# Protected Admin and User/Vendor dashboards
│   │   ├── login/                # User login page
│   │   ├── register/             # User registration page
│   │   ├── success/              # Order checkout success landing page
│   │   └── globals.css           # Global CSS variables & styles
│   ├── assets/                   # Static assets (images, logos, etc.)
│   ├── components/               # React components
│   │   ├── modules/              # Feature-specific modules (auth, cart, home, products, shop)
│   │   ├── shared/               # Shared components (Header, Footer, Navbar, Sidebar)
│   │   └── ui/                   # Reusable UI primitives (Shadcn components & custom wrappers)
│   │       └── core/             # Custom tables, modals, image uploaders, and cards
│   ├── contants/                 # Application-wide static data (cities list, protected routes)
│   ├── context/                  # React Contexts (User session provider and custom hooks)
│   ├── hooks/                    # Reusable React hooks
│   ├── lib/                      # External library client instances & utility functions
│   ├── middleware.ts             # Route verification & role-based redirection middleware
│   ├── providers/                # Client-side Wrapper Providers (Redux, PersistGate, Context Providers)
│   ├── redux/                    # Redux Toolkit configuration (store, slices, persistence settings)
│   ├── services/                 # Next.js Server Actions (Auth, Product, Brand, Category, Order, FlashSale)
│   └── types/                    # TypeScript interfaces & custom type definitions
├── components.json               # Shadcn UI CLI configuration
├── tailwind.config.ts            # Tailwind CSS custom themes & animations
├── tsconfig.json                 # TypeScript compiler configuration
└── package.json                  # Dependencies & npm scripts
```

---

## ⚙️ Environment Configuration

Create a `.env` or `.env.local` file in the root directory of the project and specify the following variables:

```env
# The URL endpoint of the NextMart Express/Nest Backend Server
NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1

# Google reCAPTCHA site credentials for bot protection
NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY=your_recaptcha_site_key
NEXT_PUBLIC_RECAPTCHA_SERVER_KEY=your_recaptcha_secret_key
```

---

## 🛠️ Installation & Setup

Follow these steps to run the client application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/rasel754/NextMart-Client.git
cd NextMart-Client
```

### 2. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed. Run:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 4. Build for Production
To build the application for optimal production deployment:
```bash
npm run build
```

### 5. Start Production Server
```bash
npm run start
```

### 6. Linting
Verify code consistency and lint rules:
```bash
npm run lint
```

---

## 🧩 Architectural Highlights & API Services

### 🔒 User Authentication Flow (`src/services/AuthService`)
The client logs in users, captures their JWT token, sets it as an HTTP-only/secure cookie, and decodes the token on the server side to load details such as user ID, role, and email.
```typescript
// Example from src/services/AuthService/index.ts
export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const result = await res.json();
    if (result.success) {
      (await cookies()).set("accessToken", result.data.accessToken);
    }
    return result;
  } catch (error) {
    return Error(error);
  }
};
```

### 🛒 Redux State Management & Selectors (`src/redux/featurs/cartSlice.ts`)
The client leverages RTK Selectors to compute invoice items reactively from the state. Shipping cost is determined dynamically based on the selected delivery city:
```typescript
export const shippingCostSelector = (state: RootState) => {
  if (state.cart.city && state.cart.city === "Dhaka" && state.cart.products.length > 0) {
    return 50;
  } else if (state.cart.city && state.cart.city !== "Dhaka" && state.cart.products.length > 0) {
    return 100;
  } else {
    return 0;
  }
};
```

---

## 🤝 Contributing

We welcome contributions to NextMart Client! Please follow these guidelines:
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details if available.
