ecommerce/
│
├── client/                         # React Frontend
│   ├── src/
│   │   ├── api/                    # Axios configuration
│   │   │   └── axios.js
│   │   │
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ProductsAdmin.jsx
│   │   │       └── OrdersAdmin.jsx
│   │   │
│   │   ├── context/                # Auth / Cart context
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
├── server/                         # Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── cart.controller.js
│   │   │   └── order.controller.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── cart.routes.js
│   │   │   └── order.routes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── admin.middleware.js
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── hashPassword.js
│   │   │
│   │   └── config/
│   │       └── db.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── docker-compose.yml              # Optional (Postgres container)
