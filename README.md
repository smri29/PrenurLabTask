# PrenurLab Full-Stack Assessment Solution

A production-style full-stack TypeScript e-commerce project built for the assessment requirements in `PLTaskAssessment.pdf`.

## Stack
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB Atlas + Mongoose
- Auth: JWT in HTTP-only cookies

## Requirement Status
All required functional and frontend requirements are implemented and verified.

Detailed checklist: [docs/requirement-compliance-matrix.md](docs/requirement-compliance-matrix.md)

## Key Features

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- Password hashing with `bcryptjs`
- JWT generation + cookie-based session
- Role-based route protection (`user` / `admin`)

### Product Management (Admin)
- `POST /api/products` (admin)
- `GET /api/products` (public, pagination + search)
- `GET /api/products/:id` (public)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- Zod validation + centralized error handling

### Cart System (User only)
- `POST /api/cart` add product + quantity
- `GET /api/cart` fetch user cart
- `PATCH /api/cart/:productId` update quantity
- `DELETE /api/cart/:productId` remove item
- `DELETE /api/cart` clear cart
- Rules enforced:
  - existing item increases quantity on add
  - quantity cannot exceed stock
  - cart is scoped to logged-in user
- Admin accounts are blocked from cart usage

### Orders
- `POST /api/orders` place order (user only)
- `GET /api/orders/me` user order history
- `GET /api/orders/admin` admin order listing
- `PATCH /api/orders/:orderId/status` admin order status update
- Placement logic:
  - validate stock
  - fail on insufficient stock
  - deduct stock
  - create order
  - clear cart
  - transaction-safe with Mongo session

### Reporting
- `GET /api/reports/summary` (admin)
  - total orders
  - total revenue
  - top 3 best-selling products
- `GET /api/reports/inventory` (admin)
  - total products
  - total units in stock
  - low-stock and out-of-stock insights

### Frontend
- Pages:
  - `/register`
  - `/login`
  - `/` (product list)
  - `/cart`
  - `/admin`
  - `/terms-of-service`
  - `/privacy-policy`
  - `/about-us`
- Protected admin UI
- API error handling with clear in-page messages
- Responsive polished UI with fixed footer navigation
- Product cards with "Read more" for consistent grid height

## Project Structure

```text
.
+-- backend
+-- frontend
+-- docs
+-- docker-compose.yml
```

## Environment Setup

### Backend `.env`
Use `backend/.env.example` as reference.

Required keys:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_secret>
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:3000
COOKIE_NAME=pl_auth_token
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!@
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## Local Run

### Backend
```bash
cd backend
npm install
npm run seed:admin
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Quality Commands

### Backend
```bash
npm run lint
npm run build
npm test
```

### Frontend
```bash
npm run lint
npm run build
npm test
```

Current status: PASS for all commands.

## Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Submission Assets
- Postman collection: [docs/postman/PrenurLabTask.postman_collection.json](docs/postman/PrenurLabTask.postman_collection.json)
- Requirement matrix: [docs/requirement-compliance-matrix.md](docs/requirement-compliance-matrix.md)
- Code walkthrough: [docs/code-walkthrough.md](docs/code-walkthrough.md)
- Design decisions: [docs/design-decisions.md](docs/design-decisions.md)
- Build log: [docs/step-by-step-build-log.md](docs/step-by-step-build-log.md)
- Prompt log: [docs/prompt-log.md](docs/prompt-log.md)

## AI Tool Usage
- Tool used: OpenAI Codex
- Prompt history summary: [docs/prompt-log.md](docs/prompt-log.md)
