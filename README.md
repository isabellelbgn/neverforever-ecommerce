# Neverforever E-commerce

## Overview
Neverforever E-commerce is a full-stack web application designed for online shopping. It features a front-end built with React and a back-end powered by Node.js, Express, and MySQL. The application allows users to browse products, add items to their cart, and make purchases. Admins can manage products, view orders, and perform other administrative tasks.

## Features
- User authentication and authorization
- Product listing and search functionality
- Shopping cart and checkout process
- Order management

## Technologies Used
- **Front-end:** React
- **Back-end:** Node.js, Express
- **Database:** MySQL
- **Styling:** TailwindCSS, Bootstrap

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- MySQL

## Installation

### Clone the Repository
```bash
git clone https://github.com/isabellelbgn/neverforever-ecommerce.git
cd neverforever-ecommerce
```

## Backend Setup
1. Install dependencies
```bash
cd backend
npm install
```

2. Database Configuration:
- Create a MySQL database.
- Update the environment variables (.env) with your database credentials.
```bash
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

3. Run Migrations:
```bash
npx sequelize db:migrate
```

4. Start the Backend Server:
```bash
npm start
```

## Frontend Setup
1. Install Dependencies:
```bash
cd ../frontend
npm install
```

2. Environment Variables:
- Update .env and update the environment variables if needed.
```bash
REACT_APP_API_URL=http://localhost:5000
```

3. Start the Frontend Server:
```bash
npm start
```

# Usage
## User Registration and Login
- Users can register for a new account or log in with existing credentials.
## Browsing Products
- Products are listed on the homepage. Users can search for products using the search bar.
## Shopping Cart
- Users can add products to their shopping cart and proceed to checkout.
## Checkout Process
- Users can review their cart, enter shipping information, and place an order.
## Admin Functionality
Admins can log in to access the admin panel where they can manage products and view orders.
