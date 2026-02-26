# Design Decisions

## 1. Monorepo Layout
- Kept provided structure (`backend`, `frontend`, `docs`) for clarity and easy assessment review.

## 2. Backend Stack
- Chose Express + Mongoose + TypeScript because this aligns exactly with required stack and is quick to audit.

## 3. JWT in HTTP-only Cookie
- Chosen over localStorage/sessionStorage for improved baseline security against direct JS token access.
- Implemented with `credentials: include` and CORS `credentials: true`.

## 4. Validation Strategy
- Chose Zod for schema-centric validation and typed parsing.
- Validation middleware is reusable and enforces body/query constraints consistently.

## 5. Layered Code Structure
- `routes -> controllers -> services -> models -> utils`.
- Benefits:
  - easy unit testing for business logic
  - thin controllers and reusable services
  - lower coupling

## 6. Cart Rules Handling
- Cart add endpoint increments quantity if item already exists.
- Stock check is done both for new and existing cart entries.

## 7. Order Reliability
- Implemented Mongo session transaction for order placement to avoid partial writes.
- Any stock or product mismatch aborts the transaction.

## 8. Reporting Implementation
- Used aggregation pipeline with facets to compute:
  - order count
  - revenue
  - top 3 sellers
- No hardcoded product assumptions.

## 9. Frontend State Strategy
- Chose lightweight Context API for auth state to avoid unnecessary global store complexity.
- Cart state is fetched per page with simple refresh approach to keep implementation transparent.

## 10. UI Approach
- Tailwind + custom components for speed and readability.
- Focused on functional, clean UI rather than heavy design systems.

## 11. Testing Strategy
- Backend tests focus on core business behavior in service layer.
- Frontend test validates key interaction on product cards.
- Chosen to keep test suite stable and deterministic in local environments.

## 12. Deployment Strategy
- Prepared deployment-ready artifacts and instructions (Render/Railway + Vercel).
- Did not execute live deployment due missing external credentials from assessment context.