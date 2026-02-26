# Step-by-Step Build Log

## Phase 1: Baseline Delivery
1. Parsed assessment PDF and extracted mandatory API/UI requirements.
2. Scaffolded backend and frontend from empty folders.
3. Built authentication, product, cart, order, and reporting modules.
4. Added frontend pages (register/login/products/cart/admin).
5. Added tests, docker files, compose file, and docs.

## Phase 2: Stabilization and Bug Fixes
1. Fixed malformed `.env` handling and startup validation flow.
2. Fixed product list 500 error caused by unsafe query mutation.
3. Removed duplicate mongoose indexes that triggered warnings.
4. Resolved hydration warning noise from browser extension attributes.
5. Improved global scroll behavior and fixed footer layout behavior.

## Phase 3: UI/UX and Admin Enhancements
1. Reworked visual system (lighter palette, typography, spacing, component consistency).
2. Added legal pages and footer policy navigation.
3. Upgraded Admin panel into operations console:
   - Overview KPIs
   - Inventory risk insights
   - Product search/filter workflows
   - Order management with status updates
4. Added order lifecycle support and admin order endpoints.
5. Added inventory reporting endpoint.

## Phase 4: Cart System Enhancements
1. Added `PATCH /cart/:productId` for direct quantity updates.
2. Added `DELETE /cart` to clear full cart.
3. Added quantity steppers and per-item subtotal on frontend cart page.
4. Added operation-level busy states and clearer user feedback.
5. Enforced business rule: admin cannot perform customer cart/order placement actions.

## Phase 5: Documentation and Submission Hardening
1. Rewrote root README to match final implementation.
2. Added requirement compliance matrix with PASS state per requirement.
3. Updated docs index and references.
4. Re-validated quality gates:
   - Backend: lint/build/test PASS
   - Frontend: lint/build/test PASS
