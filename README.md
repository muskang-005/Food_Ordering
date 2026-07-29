
# 🍴 Food Ordering App

A full‑stack food ordering web application built with **React, Redux, Node.js, Express.js, and MySQL**.  
Users can browse menus, manage carts, place orders, and track order history with authentication and secure APIs.

---

## 🚀 Features
- Responsive UI for browsing menus, viewing cart, and placing orders
- User authentication (signup/login, protected routes)
- Cart management (add, remove, update items)
- Order history with past orders tracking
- Wallet integration for payments (optional)
- Admin panel to manage products
- Redux state management for cart, orders, and user data
- RESTful APIs built with Express.js
- MySQL database for users, menu items, orders, and cart

---

## 📂 Project Structure
```plaintext
Food-Ordering-App/
│── client/               # Frontend (React + Redux)
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/   # CartDetails, OrderHistory, Login, Signup, etc.
│       ├── actions/      # Redux actions (orderActions, walletActions)
│       ├── reducers/     # Redux reducers (cartReducer, userReducer, walletReducer)
│       ├── redux/        # Store configuration
│       ├── App.js / App.css
│       ├── index.js / index.css
│
│── server/               # Backend (Node.js + Express)
│   ├── server.js         # API entry point
│   └── package.json      # Backend dependencies
│
│── database/
│   └── mysql.session.sql # MySQL schema (users, menu_items, orders, cart)
│
│── README.md             # Documentation
│── LICENSE               # License info
│── .gitignore            # Ignore rules
