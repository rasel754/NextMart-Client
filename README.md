# 🛒 NextMart - Modern Multi-Vendor E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

NextMart is an enterprise-grade, high-performance **Multi-Vendor E-Commerce Platform** designed for seamless modern shopping. It is split into an interactive, lightning-fast client interface built with **Next.js 15 (App Router)** & **React 19**, and a robust backend API powered by **Node.js, Express, and TypeScript**. NextMart features secure role-based access controls, interactive vendor/merchant portals, real-time analytics, secure payment gateway flows, and automated invoicing.

---

## 🌐 Live Deployments & Repository Links

| Component | Live Link | Repository |
| :--- | :--- | :--- |
| **Frontend Client** | [next-mart-client-sable.vercel.app](https://next-mart-client-sable.vercel.app/) | [GitHub Repository](https://github.com/rasel754/NextMart-Client) |
| **Backend Server** | [next-mart-server-taupe.vercel.app](https://next-mart-server-taupe.vercel.app/) | [GitHub Repository](https://github.com/rasel754/NextMart-Server) |

📩 **Connect with Me:** [LinkedIn Profile](https://www.linkedin.com/in/rasel754)

---

## 🎨 Preview & Visuals

> [!NOTE]
> Enhance your user onboarding by showcasing the responsive design and beautiful visual dashboards of NextMart here.

| Desktop Homepage Preview | Vendor Analytics Dashboard |
| :---: | :---: |
| <img src="https://i.ibb.co.com/BVL913Yg/screencapture-next-mart-client-sable-vercel-app-2026-06-25-16-08-32.png" width="100%" alt="Homepage View" style="border-radius: 8px;" /> | <img src="https://i.ibb.co.com/whHjNtQQ/screencapture-next-mart-client-sable-vercel-app-admin-2026-06-25-16-09-28.png" width="100%" alt="Dashboard Analytics" style="border-radius: 8px;" /> |

---

## ⚙️ Technology Stack

### 💻 Frontend
- **Framework:** Next.js 15.5 (App Router) & React 19.2
- **State Management:** Redux Toolkit & Redux Persist (ensures persistent cart states)
- **UI & Styling:** Tailwind CSS 3, Shadcn UI, Radix UI Primitives, Lucide Icons, and Embla Carousel
- **Forms & Validation:** React Hook Form & Zod Schema Validation
- **Analytics Visualization:** Recharts (interactive dashboards for merchants and administrators)
- **Security Widgets:** React Google reCAPTCHA (client-side bot protection)

### 🔌 Backend
- **Core Environment:** Node.js & TypeScript
- **Web Server:** Express.js
- **Database ORM:** Mongoose ODM for MongoDB
- **Authentication & Authorization:** Secure JWT (Access & Refresh tokens) with HttpOnly cookie persistence
- **Payment Processing:** SSLCommerz Integration (`sslcommerz-lts`) with atomic transactions
- **File Upload & Storage:** Multer & Cloudinary
- **Email & Communications:** Nodemailer SMTP with responsive Handlebars (`.hbs`) templates
- **PDF Document Engine:** PDFKit (automated payment invoice creation)
- **Security Middleware:** Helmet, CORS, Express Mongo Sanitize, and Express Rate Limit

---

## ✨ Core Features & Highlights

### 🛍️ Client & Customer Experience
*   **Dynamic Landing Page:** Features high-conversion hero sliders, nested category selectors, flash sales with real-time count-down timers, and brand showcase modules.
*   **Persistent Shopping Cart:** Powered by Redux Persist. Automatically computes cart updates, item quantities, and subtotal amounts on the fly.
*   **Dynamic Shipping Calculator:** Automatically calculates shipping costs based on delivery address criteria (e.g., inside Dhaka vs outside Dhaka).
*   **Secure Multi-Step Checkout:** Seamless transition from cart validation to order submission and SSLCommerz payment portal.

### 🏪 Vendor & Shop Management
*   **Vendor Onboarding:** Easily registers shops with customizable branding, descriptions, and logo uploading.
*   **Product Inventory CRUD:** Complete inventory portal where vendors manage titles, descriptions, categories, stock, prices, flash sale tags, and image galleries.
*   **Analytics Dashboards:** Access detailed charts (Recharts) summarizing monthly income, sales volume, top products, and overall shop performance.

### 🛡️ Security, Auditing & Performance
*   **Role-Based Access Control (RBAC):** Middleware checks verify permissions for Customers, Vendors, and Administrators.
*   **Bot Prevention:** Integrates Google reCAPTCHA verification on login and registration portals.
*   **Request & Browser Auditing:** Uses UAParser.js to capture client IP, device models, browsers, and operating systems on authentication endpoints.
*   **On-Demand Cache Revalidation:** Uses Next.js tag-based validation (`PRODUCT`, `Brands`, `CATEGORY`) to purge client-side cache as soon as updates occur.

---

## 📦 Main Dependencies

### Client
```json
"dependencies": {
  "next": "^15.5.19",
  "react": "^19.2.0",
  "@reduxjs/toolkit": "^2.8.2",
  "redux-persist": "^6.0.0",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "zod": "^3.24.1",
  "react-hook-form": "^7.54.2",
  "@hookform/resolvers": "^3.10.0",
  "react-google-recaptcha": "^3.1.0",
  "lucide-react": "^0.474.0",
  "sonner": "^1.7.2",
  "recharts": "^3.8.1",
  "embla-carousel-react": "^8.6.0"
}
```

### Server
```json
"dependencies": {
  "express": "^4.21.2",
  "mongoose": "^8.9.5",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "zod": "^3.24.1",
  "sslcommerz-lts": "^1.1.0",
  "nodemailer": "^6.9.16",
  "pdfkit": "^0.16.0",
  "cloudinary": "^1.30.0",
  "multer": "^1.4.5-lts.1",
  "node-cron": "^4.4.1",
  "winston": "^3.19.0"
}
```

---

## 🚀 Run Locally

Ensure you have [Node.js v20+](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Setup Backend Server
1. Clone the repository and navigate to the server folder:
   ```bash
   git clone https://github.com/rasel754/NextMart-Server.git
   cd NextMart-Server
   ```
2. Install the server-side dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` configuration. Copy `.env.example` to `.env` and fill in the credentials:
   ```bash
   cp .env.example .env
   ```
4. Run the local backend server:
   ```bash
   npm run dev
   ```
   *The server runs locally at `http://localhost:3001` (or your customized port).*

### Setup Frontend Client
1. Navigate to the client folder:
   ```bash
   git clone https://github.com/rasel754/NextMart-Client.git
   cd NextMart-Client
   ```
2. Install the client-side dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root of the client project:
   ```env
   NEXT_PUBLIC_BASE_API=http://localhost:3001/api/v1
   NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY=your_recaptcha_site_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) to view the client application in your browser.*

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
