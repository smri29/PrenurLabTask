# Code Walkthrough

## Backend

### Authentication
- `backend/src/services/authService.ts`
  - Handles register/login logic.
  - Hashes passwords and issues JWT.
- `backend/src/middlewares/auth.ts`
  - Protects routes and enforces role checks.

### Products
- `backend/src/services/productService.ts`
  - Product CRUD, search, and pagination.
- `backend/src/validators/productValidator.ts`
  - Input and query validation.

### Cart
- `backend/src/services/cartService.ts`
  - Add item (+increment if already present)
  - Update quantity (`PATCH /cart/:productId`)
  - Remove single item
  - Clear full cart (`DELETE /cart`)
  - Enforces stock caps
- `backend/src/routes/cartRoutes.ts`
  - Cart endpoints and role restriction (`user` only)

### Orders
- `backend/src/services/orderService.ts`
  - Transactional order placement with stock deduction and cart clear.
  - User order history listing.
  - Admin order listing and status updates.
- `backend/src/models/Order.ts`
  - Supports lifecycle statuses:
    - placed
    - processing
    - shipped
    - delivered
    - cancelled

### Reporting
- `backend/src/services/reportService.ts`
  - Summary analytics (`/reports/summary`)
  - Inventory analytics (`/reports/inventory`)

### Error Handling + Validation
- `backend/src/middlewares/validate.ts`
  - Reusable zod validation for body/query.
- `backend/src/middlewares/errorHandlers.ts`
  - Uniform API error response handling.

## Frontend

### Auth + API
- `frontend/context/AuthContext.tsx`
  - Session hydration and auth state.
- `frontend/lib/api.ts`
  - Shared fetch wrapper (`credentials: include`).

### Product Experience
- `frontend/app/page.tsx`
  - Product list, search, pagination, add-to-cart flow.
- `frontend/components/ProductCard.tsx`
  - Consistent card height with read-more toggle.

### Cart Experience
- `frontend/app/cart/page.tsx`
  - Quantity steppers (+/-)
  - Per-item subtotal
  - Remove and clear-cart operations
  - Place-order action

### Admin Operations Console
- `frontend/app/admin/page.tsx`
  - Dashboard KPIs
  - Inventory risk view
  - Product management with search/filter
  - Order management with status updates

### Layout and Policy Pages
- `frontend/components/Footer.tsx`
  - Fixed footer with profile + policy links.
- `frontend/app/terms-of-service/page.tsx`
- `frontend/app/privacy-policy/page.tsx`
- `frontend/app/about-us/page.tsx`

## Quality
- Backend and frontend pipelines are configured for lint, build, and tests.
- Current project state passes all configured checks.
