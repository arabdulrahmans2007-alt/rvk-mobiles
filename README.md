# RVK MOBILES — Full-Stack Web Application

Professional Mobile Shop & Service Management Platform for **RVK MOBILES**, Trichy.

## 🚀 Features

- **Customer Web Portal (17 Modules)**:
  - **Home**: Dynamic Today's Special Offer banner with live date, verified best sellers, category quick filters, doorstep highlights.
  - **Accessories Catalog**: Verified pricing on Earphones (₹89), AirPods (₹699), Neckbands (₹599), Bluetooth Speakers (₹300–₹3,000), Tempered Glass (₹89), Fast Chargers, and Data Cables.
  - **Display Replacement**: LCD (₹999–₹1,399), LED (₹2,500–₹3,999), and Curved Edge (*Secret Offers*).
  - **Doorstep Service**: Within 20 KM free travel (₹0 travel fee) for regular customers; ₹0 travel for RVK Members across any distance.
  - **RVK Membership Lounge**: VIP benefits overview with *"Membership Plans — Coming Soon"*.
  - **Offers & Promotions**: Active promo list with Today's Offer countdown and instant claim actions.
  - **In-App Notification Center**: Live unread badge, offer alerts, and status notifications.
  - **Cart & Checkout**: Interactive slide-out cart drawer, delivery details, and payment options (Cash on Delivery, UPI on Delivery, Pay at Store).
  - **Live Service Tracking**: Real-time progress timeline by booking code or phone number.
  - **Store Contact & FAQ**: Complete store details in Teppakulam Bazaar Trichy, phone numbers, and official policy statement (*"Warranty details available at the time of service."*).

- **Admin Management Portal (`/admin`)**:
  - Secure JWT authentication with bcrypt password hashing.
  - 14 Admin modules: Dashboard KPIs, Orders, Customers, Products & Stock, Display Services, Doorstep Bookings, Membership, Offers (auto-broadcasts in-app notifications upon publishing), Invoices, Reports, Store Settings, and Admin Accounts.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express, SQLite (`sql.js`), JWT, Bcrypt.js.
- **Design System**: Deep Navy (`#070C1E`, `#0B132B`), Slate surfaces, Electric Blue (`#0066FF`), clean typography, mobile-responsive layout.

## 📦 Getting Started

```bash
# 1. Install root dependencies
npm install

# 2. Install client dependencies
cd client && npm install && cd ..

# 3. Seed initial database & start development server
npm run seed
npm run dev

# 4. Build for production & start
npm run build
npm start
```

## 📍 Store Information

- **Business Name**: RVK MOBILES
- **Proprietor**: Krishna Moorthy
- **Helplines**: `+91 8610903892` / `+91 8608103543`
- **Location**: Vanapatrai Kovil, Teppakulam Bazaar, Trichy, Tamil Nadu, India
- **Official Policy**: *Warranty details available at the time of service.*

## 🔒 Default Admin Credentials

- **URL**: `http://localhost:5000/admin`
- **Email**: `admin@rvkmobiles.com`
- **Password**: `Admin@RVK2026`