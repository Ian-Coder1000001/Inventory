# Tinez Inventory Management System

A modern full-stack inventory management system built with **Next.js**, **MongoDB**, and **Cloudinary**.

Tinez helps businesses manage products and inventory batches, record sales, monitor stock levels, and maintain an activity history of inventory operations through a centralised dashboard.

## 🚀 Live Demo

**Live Application:**
[https://tinez-inventory.vercel.app/login](https://tinez-inventory.vercel.app/login)

---

## 📌 Project Purpose

Tinez was developed to simplify inventory management for businesses that need a centralized system for tracking products, stock batches, sales, and inventory activity.

Instead of relying on spreadsheets or manual records, Tinez provides an interactive dashboard where authorized users can:

* Manage inventory products
* Organize stock into batches
* Track quantities and stock levels
* Record product sales
* Monitor inventory activity
* View batch-specific information
* Upload product-related images
* Authenticate securely through a login system

The application is designed as a full-stack Next.js application, with the frontend interface and backend API routes contained within the same project.

---

# ✨ Features

## 📊 Inventory Dashboard

The dashboard provides a centralized overview of the inventory system.

Users can:

* View available inventory
* Monitor product quantities
* View inventory batches
* Access individual batch details
* Track inventory activity
* Manage products and stock

---

## 📦 Batch Management

Inventory can be organized into individual batches.

Each batch can contain information about:

* Batch identification
* Products associated with the batch
* Stock quantities
* Batch activity
* Inventory status

Users can open individual batches to view more detailed information.

---

## 🛒 Product Management

The system provides functionality for managing inventory products.

Users can:

* Add new products
* View products
* Update product information
* Manage product quantities
* Sell products
* Upload product images

Products are connected to inventory batches to make stock tracking easier.

---

## 💰 Sales Management

Tinez includes functionality for recording product sales.

Users can:

1. Select a product.
2. Enter the quantity being sold.
3. Record the sale.
4. Automatically update the available inventory.
5. Track the transaction through the activity history.

This helps ensure that inventory quantities remain synchronized with recorded sales.

---

## 📝 Activity Tracking

The application maintains an activity history for inventory operations.

The activity feed can be used to track actions such as:

* Products being added
* Inventory changes
* Sales
* Batch-related activity
* Other inventory operations

Activity information can also be viewed for individual batches.

---

## 🔐 Authentication

Tinez includes an authentication system to restrict access to inventory data.

The authentication flow includes:

* User login
* Secure logout
* Protected application routes
* Authenticated API requests
* User session management

Authentication functionality is implemented through the application's authentication utilities and API routes.

---

## ☁️ Cloudinary Integration

Product and inventory images can be uploaded and stored using **Cloudinary**.

This keeps media storage separate from the application server while providing a scalable solution for managing uploaded images.

---

# 🧰 Tech Stack

## Frontend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Next.js            | Full-stack React framework |
| React              | User interface             |
| JavaScript         | Application logic          |
| CSS                | Styling                    |
| Next.js App Router | Application routing        |

## Backend

| Technology               | Purpose                   |
| ------------------------ | ------------------------- |
| Next.js API Routes       | Backend/API functionality |
| Node.js                  | Server-side runtime       |
| MongoDB                  | Database                  |
| MongoDB Models           | Data management           |
| Authentication utilities | User authentication       |

## Storage & Services

| Technology | Purpose                     |
| ---------- | --------------------------- |
| Cloudinary | Image upload and storage    |
| MongoDB    | Persistent application data |
| Vercel     | Application deployment      |

---

# 🏗️ Application Architecture

Tinez uses the **Next.js App Router** to combine the user interface and backend API within a single application.

```text
                         ┌─────────────────────────┐
                         │       Tinez App         │
                         │       Next.js           │
                         └────────────┬────────────┘
                                      │
                  ┌───────────────────┴───────────────────┐
                  │                                       │
                  ▼                                       ▼
        ┌───────────────────┐                   ┌───────────────────┐
        │   User Interface  │                   │     API Routes    │
        │                   │                   │                   │
        │ Dashboard         │                   │ Authentication    │
        │ Batches           │                   │ Products          │
        │ Products          │                   │ Batches           │
        │ Activity          │                   │ Sales             │
        │ Login             │                   │ Uploads           │
        └─────────┬─────────┘                   └─────────┬─────────┘
                  │                                       │
                  └───────────────────┬───────────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │        MongoDB          │
                         │                         │
                         │ Users                   │
                         │ Products                │
                         │ Batches                 │
                         │ Activities              │
                         └─────────────────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │  Cloudinary   │
                              │    Images     │
                              └───────────────┘
```

---

# 📁 Project Structure

```text
Tinez/
│
├── app/
│   ├── api/
│   │   ├── activity/
│   │   │   └── [batchId]/
│   │   │       └── route.js
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js
│   │   │   └── logout/
│   │   │       └── route.js
│   │   │
│   │   ├── batches/
│   │   │   ├── [id]/
│   │   │   │   └── route.js
│   │   │   └── route.js
│   │   │
│   │   ├── ping/
│   │   │   └── route.js
│   │   │
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   ├── sell/
│   │   │   │   │   └── route.js
│   │   │   │   └── route.js
│   │   │   └── route.js
│   │   │
│   │   └── upload/
│   │       └── route.js
│   │
│   ├── batch/
│   │   └── [id]/
│   │       └── page.js
│   │
│   ├── dashboard/
│   │   └── page.js
│   │
│   ├── login/
│   │   └── page.js
│   │
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── ActivityFeed.jsx
│   ├── AddBatchModal.jsx
│   ├── AddProductModal.jsx
│   ├── BatchCard.jsx
│   ├── BatchSummaryBar.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── SellModal.jsx
│
├── lib/
│   ├── auth.js
│   ├── cloudinary.js
│   ├── fetchWithAuth.js
│   └── mongodb.js
│
├── models/
│   ├── Activity.js
│   ├── Batch.js
│   ├── Product.js
│   └── User.js
│
├── public/
│
├── scripts/
│   └── seed.js
│
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── proxy.js
└── README.md
```

---

# 🗂️ Data Models

The application uses four primary MongoDB models.

### User

Stores authenticated user information.

```text
User
├── Authentication information
└── User account data
```

### Product

Stores information about inventory products.

```text
Product
├── Product information
├── Inventory quantity
├── Product image
└── Batch relationship
```

### Batch

Represents a specific inventory batch.

```text
Batch
├── Batch information
├── Products
├── Inventory data
└── Activity
```

### Activity

Stores a history of inventory-related actions.

```text
Activity
├── Action
├── Related batch
├── Product/activity information
└── Timestamp
```

---

# 🔌 API Routes

The application exposes backend functionality through Next.js API routes.

## Authentication

```text
POST /api/auth/login
```

Authenticates a user and establishes an authenticated session.

```text
POST /api/auth/logout
```

Logs the current user out.

---

## Products

```text
GET    /api/products
POST   /api/products
GET    /api/products/[id]
PUT    /api/products/[id]
DELETE /api/products/[id]
```

Used to manage inventory products.

### Sell Product

```text
POST /api/products/[id]/sell
```

Records a product sale and updates the corresponding inventory.

---

## Batches

```text
GET  /api/batches
POST /api/batches

GET  /api/batches/[id]
PUT  /api/batches/[id]
```

Used to create, retrieve, and manage inventory batches.

---

## Activity

```text
GET /api/activity/[batchId]
```

Retrieves activity associated with a specific inventory batch.

---

## Upload

```text
POST /api/upload
```

Handles image uploads and integrates with Cloudinary for media storage.

---

# ⚙️ Getting Started

## Prerequisites

Before running the project locally, make sure you have:

* Node.js 18 or later
* npm
* Git
* MongoDB or a MongoDB Atlas database
* Cloudinary account

Check your Node.js installation:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

# 1. Clone the Repository

Clone the project:

```bash
git clone https://github.com/YOUR_USERNAME/tinez-inventory.git
```

Navigate into the project:

```bash
cd tinez-inventory
```

> Replace `YOUR_USERNAME/tinez-inventory` with the actual GitHub repository URL.

---

# 2. Install Dependencies

Install all project dependencies:

```bash
npm install
```

The project uses the `package-lock.json` file to ensure consistent dependency versions.

---

# 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

AUTH_SECRET=your_auth_secret
```

Use the exact variable names expected by your application's configuration files.

### ⚠️ Security

Never commit environment variables or API credentials to GitHub.

Add the following to `.gitignore` if they are not already present:

```gitignore
.env
.env.local
.env.production
node_modules/
.next/
```

---

# 4. Seed the Database

The project includes a database seed script:

```text
scripts/seed.js
```

If the project is configured to support database seeding through npm scripts, run:

```bash
npm run seed
```

If no seed script is defined in `package.json`, you can execute the script according to your project's Node.js configuration.

The seed script can be used to populate the database with initial/demo data.

---

# ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

Open the login page:

```text
http://localhost:3000/login
```

---

# 🧪 Testing the Application

After starting the development server, test the main application workflows.

## Authentication Test

1. Open `/login`.
2. Enter valid user credentials.
3. Log in.
4. Confirm that you are redirected to the dashboard.
5. Verify that protected pages cannot be accessed without authentication.
6. Log out and confirm that the session is terminated.

---

## Inventory Test

1. Open the dashboard.
2. Add a new product.
3. Add inventory to a batch.
4. Confirm that the product appears in the inventory.
5. Open the batch details page.
6. Check the activity feed.

---

## Sales Test

1. Select an available product.
2. Open the selling interface.
3. Enter the quantity sold.
4. Confirm the sale.
5. Verify that the inventory quantity decreases.
6. Check the activity history for the recorded transaction.

---

## Image Upload Test

1. Open the product creation interface.
2. Select an image.
3. Upload the image.
4. Confirm that the image is successfully stored.
5. Verify that the product displays the uploaded image.

---

# 🚀 Deployment

Tinez is deployed using **Vercel**.

The production application is available at:

**[https://tinez-inventory.vercel.app/login](https://tinez-inventory.vercel.app/login)**

For a production deployment, configure the required environment variables in your hosting provider.

At minimum, the production environment should have access to:

```text
MongoDB
Cloudinary
Authentication secret
```

Do not expose private API credentials in client-side code.

---

# 🔒 Security

The application incorporates several security considerations:

* Authenticated user sessions
* Protected API routes
* Server-side authentication checks
* Separate authentication utilities
* Environment-based secrets
* Database access through server-side code
* Protected inventory operations
* Server-side handling of image uploads

Sensitive credentials should always be stored using environment variables.

---

# 📈 Future Improvements

Potential future enhancements include:

* Advanced inventory analytics
* Low-stock notifications
* Inventory forecasting
* Supplier management
* Purchase order management
* Stock transfer functionality
* Barcode/QR code scanning
* Export inventory reports to CSV/PDF
* Role-based access control
* Detailed sales reports
* Date-based activity filtering
* Dashboard charts and KPIs
* Automated email notifications
* Comprehensive automated testing
* Audit logs for administrative actions

---

# 🧑‍💻 Development Architecture

Tinez follows a modular full-stack architecture.

### Application Layer

The `app/` directory contains the Next.js application routes and pages.

```text
app/
├── dashboard/
├── login/
├── batch/
└── api/
```

### API Layer

Backend functionality is organized using Next.js API route handlers:

```text
app/api/
├── auth/
├── batches/
├── products/
├── activity/
└── upload/
```

### Component Layer

Reusable UI components are stored in:

```text
components/
```

Examples include:

* `ProductCard`
* `BatchCard`
* `ActivityFeed`
* `SellModal`
* `AddProductModal`
* `Navbar`

### Data Layer

Database models are located in:

```text
models/
```

The application currently uses:

```text
User
Product
Batch
Activity
```

### Services

External services and shared functionality are organized inside:

```text
lib/
```

This includes:

* MongoDB connection
* Cloudinary integration
* Authentication
* Authenticated API requests

---

# 📄 License

This project is intended for educational, portfolio, and demonstration purposes.

If you intend to distribute or use the project commercially, add an appropriate license to the repository.

---

# 👨‍💻 Author

**Ian**

Digital Marketing & Software Development

Built with ❤️ using Next.js, MongoDB, and modern web technologies.

---

## ⭐ Project Highlights

* Full-stack Next.js application
* Inventory management dashboard
* Product management
* Batch-based inventory tracking
* Product sales management
* Real-time inventory quantity updates
* Activity history
* User authentication
* Protected API routes
* MongoDB database integration
* Cloudinary image storage
* Responsive dashboard interface
* Next.js App Router architecture
* Vercel deployment

### 🔗 Live Demo

**[https://tinez-inventory.vercel.app/login](https://tinez-inventory.vercel.app/login)**
