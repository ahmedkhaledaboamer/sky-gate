# Sky Gate

E-commerce store, customer area and admin/manager dashboard for Sky Gate, built with [Next.js](https://nextjs.org) (App Router), React, Tailwind CSS and Framer Motion. JavaScript only (no TypeScript).

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

## Scripts

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start the development server        |
| `npm run build` | Create a production build           |
| `npm run start` | Serve the production build          |
| `npm run lint`  | Lint the project with ESLint        |

## Environment variables

Copy `.env.example` to `.env.local` and adjust:

| Variable               | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the deployed site (canonical/Open Graph/sitemap) |
| `NEXT_PUBLIC_API_URL`  | E-Commerce API origin **without** `/api/v1` (e.g. `http://localhost:8000`) |
| `NEXT_PUBLIC_CURRENCY` | ISO currency used to display prices (default `AED`, match the API `CURRENCY`) |

## Project structure

```
app/
  (site)/            Store + customer area (shared Header/Footer layout)
    page.jsx         /                       home (categories, best sellers, featured, brands from the API)
    products/        /products, /products/:id (filters/sort/page live in the URL)
    categories/ brands/
    login/ signup/ forgot-password/
    cart/ checkout/ checkout/success/ wishlist/
    account/         /account (profile), /account/orders(/:id), /account/addresses
    blog/
  dashboard/         Admin/manager dashboard (own layout; role-guarded)
components/
  ui/                Reusable UI kit: Button, Input/Select/Textarea, Modal, ConfirmModal, Drawer,
                     DataTable, Pagination, SearchInput, SortSelect, StarRating, Loading/Error/EmptyState
  auth/              Guards (ProtectedRoute, DashboardRoute, PublicRoute, RoleGuard) + auth forms
  store/ home/ orders/ account/   Store, checkout and customer-area components
  dashboard/         Dashboard shell, forms and pages
  pages/             Page-level client views used by app/ routes
context/             AuthContext, CartContext, WishlistContext, ToastContext
hooks/               useApiQuery, useUrlParams, useForm, useDashboardList, ...
lib/api/             Centralized API layer (client.js + one module per resource)
lib/                 constants, formatting, validation, i18n, product helpers
data/                Blog content (data/products.js is no longer used — products come from the API)
messages/            Translations (en.js, ar.js + store.en.js, store.ar.js)
public/images/       Static images
styles/globals.css   Global styles + Tailwind
```

## Internationalization

English and Arabic are supported with LTR/RTL. The selected language is stored
in the `ds_locale` cookie, so the server renders the correct language and
direction on first load (no flash, no hydration mismatch). URLs are the same
for both languages. Translations live in `messages/en.js` and `messages/ar.js`
and are read with `useTranslations('Namespace')` in Client Components or
`createTranslator(locale, 'Namespace')` on the server.

## API & auth

All requests go through `lib/api/client.js` (`Authorization: Bearer <token>`, error
normalization, `401` → logout + redirect to `/login`). The token and user are kept in
`localStorage`; route guards run on the client and the API enforces permissions.

| Role      | Access                                                                     |
| --------- | -------------------------------------------------------------------------- |
| `user`    | Store, cart, wishlist, checkout, orders, addresses, reviews, profile       |
| `manager` | Dashboard: create / edit everything, mark orders paid/delivered, delete reviews |
| `admin`   | Manager permissions + all delete actions                                   |

## Forms

Contact, agency request and newsletter forms open the visitor's email client
via `mailto:` (see `lib/sendToEmail.js`). To send directly instead, replace the
body of `sendToEmail` with a call to an API route or email service.
