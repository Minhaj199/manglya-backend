# 🛠️ Mangalya Backend

This is the backend service for the **Mangalya** matrimonial platform, built with **Express.js** and **TypeScript**, following a clean **repository pattern** architecture. It features RESTful APIs with secure JWT-based authentication, modular and decoupled design, and integrations with key services like Stripe, Cloudinary, and Socket.io.

---

## 🚀 Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Architecture**: Repository Pattern
- **Auth**: JWT (JSON Web Token)
- **Design Principles**: Encapsulation, Decoupling

---

## 📦 Key Libraries & Integrations

- `jsonwebtoken` – Authentication with JWT
- `mongoose` – MongoDB ODM
- `stripe` – Payment integration
- `cron` – Scheduled tasks
- `cloudinary` – Media uploads and CDN
- `nodemailer` – Email services
- `socket.io` – Real-time communication

---

## 🔐 Features

- RESTful APIs
- JWT Authentication & Role-based Access (Admin/User)
- User management
- Admin dashboard support
- Stripe-powered payments
- Zod (for input validation)
- Image uploads via Cloudinary
- Scheduled background jobs using `node-cron`
- Real-time features with `Socket.io`
- Email support using `Nodemailer`

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Minhaj199/manglya-backend.git
cd mangalya-backend
```

### 2. Create .env

```bash
JWT_ACCESS_SECRET_ADMIN=
JWT__ACCESS_SECRET_USER=
JWT_REFRESH_SECRET_ADMIN=
JWT__REFRESH_SECRET_USER=
CONNECTIN_STRING= 
PORT=
ADMIN_USERNAME=
ADMIN_PASSWORD=
GOOGLE_USERNAME=
GOOGLE_PASSWORD=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET_KEY=

STRIPE_PUBLISH_KEY=
```
### 3. Install Dependencies
```bash
npm install
```
### 4. Start the Server
```bash
npm run build
```

## . Mock payment card 
```bash
$ 4242 4242 4242 4242
```

```

