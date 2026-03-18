# Restaurant Management System

## Stack
- **Frontend**: React + Vite + Tailwind + Firebase Auth
- **Backend**: Django REST Framework + PostgreSQL
- **Payments**: Mpesa (Daraja), Stripe, PayPal, Cash
- **Receipts**: ReportLab PDF + ESC/POS thermal printing + Barcode
- **Hosting**: Vercel (frontend) + Railway/Render (backend)

## Roles
- `superadmin` — full access, manages employees, accounting, system settings
- `admin` — manages orders, reservations, menu, customers
- `customer` — browses menu, orders, pays, tracks, reserves

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in your values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Build Order
1. Django models + Firebase auth middleware
2. React auth (Login, Register, role routing)
3. Public website pages
4. Customer portal (menu, cart, checkout, payments)
5. Admin dashboard
6. Super Admin dashboard
7. Accounting + receipts + barcode
8. Mpesa + Stripe + PayPal integration
