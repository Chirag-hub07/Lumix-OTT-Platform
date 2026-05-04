# LUMIX — Entertainment & Media Streaming Dashboard
### Capstone Project | React + Vite | Entertainment Domain

---

## 📋 Project Overview

**Domain:** Entertainment & Media  
**API/Data:** Mock Entertainment API (simulates TMDB-style data with async fetch)  
**Live:** Deploy on Vercel / Netlify  

LUMIX is a full-featured cinema streaming dashboard built with modern React, featuring AI-powered recommendations, real-time analytics, role-based protected routes, and a dark/light theme toggle.

---

## 🛠️ Tech Stack (Mandatory Requirements)

| Category | Technology |
|----------|-----------|
| Frontend | React 18 + Vite (ES6+) |
| State Management | **Redux Toolkit** (authSlice, mediaSlice, toastSlice) |
| Routing | **React Router v6** with protected routes |
| API Integration | **Axios** + Fetch API (async thunks) |
| Styling | **Tailwind CSS** + CSS custom properties |
| Charts | Chart.js + react-chartjs-2 |
| Performance | Lazy loading, pagination |
| Deployment | Vercel / Netlify ready |

---

## ✅ Advanced Features Implemented (6 of 10)

1. **Authentication & Role-based Access** — Login/Signup with protected routes using React Router + Redux
2. **Pagination / Load More** — Browse page loads 12 items at a time with "Load more" button
3. **Search + Filter + Sort** — Debounced search, type filter (All/Movies/Series), genre filter, sort by rating/year/popularity
4. **Dark Mode Toggle** — Full dark/light theme switch stored in Redux
5. **Debounced API calls** — Search input uses 300ms debounce before dispatching
6. **Error Boundary** — `ErrorBoundary` component wraps the whole app
7. **Performance with memoization** — `useMemo` for filtered/sorted lists, `useCallback` for handlers
8. **Dashboard with Charts** — Analytics page: Bar chart, Line chart, Doughnut chart (Chart.js)
9. **Multi-step form** — Onboarding flow with genre selection validation

---

## 📁 Project Structure

```
lumix-react/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky nav with search, theme, auth
│   │   ├── MovieCard.jsx       # Reusable card with hover overlay
│   │   ├── Toast.jsx           # Global notification component
│   │   ├── ErrorBoundary.jsx   # Error boundary (class component)
│   │   └── ProtectedRoute.jsx  # Route guard using Redux auth state
│   ├── pages/
│   │   ├── AuthPage.jsx        # Login with form validation
│   │   ├── SignupPage.jsx      # Signup with multi-field validation
│   │   ├── OnboardPage.jsx     # Genre preference onboarding
│   │   ├── HomePage.jsx        # Hero + content rows
│   │   ├── BrowsePage.jsx      # Search + filter + sort + pagination
│   │   ├── DetailPage.jsx      # Movie/Show detail page
│   │   ├── PlayerPage.jsx      # Video player simulation
│   │   ├── AnalyticsPage.jsx   # Charts dashboard
│   │   └── ProfilePage.jsx     # User profile + watchlist
│   ├── store/
│   │   ├── index.js            # Redux store config
│   │   ├── authSlice.js        # Authentication state
│   │   ├── mediaSlice.js       # Movies, watchlist, filters
│   │   └── toastSlice.js       # Toast notifications
│   ├── hooks/
│   │   └── useToast.js         # Custom toast hook
│   ├── data/
│   │   └── movies.js           # Mock dataset (20 titles)
│   ├── App.jsx                 # Routes + lazy loading
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

---

## 🔑 How to Use

1. Open the app → You'll see the **Login** page
2. Enter any email + password (6+ chars) → Click **Sign In**
3. Or click **Sign Up** → fill form → get redirected to **Onboarding**
4. Select 3+ genres → Continue → **Home page loads**
5. Browse movies, click to see details, add to watchlist
6. Use **Browse** for search/filter/sort
7. View **Analytics** for your watch stats + charts
8. **Profile** shows your watchlist and preferences
9. Toggle 🌙/☀ for dark/light mode

---

## 🎯 Unique Project Differentiators

- **Domain:** Entertainment & Media (not education/finance/healthcare)
- **Features:** AI-style "Because you watched X" recommendations
- **UI:** Custom cinema-dark aesthetic with gradient glows
- **Analytics:** 3 chart types + activity feed
- **State:** 3 Redux slices with async thunks

---

## 📄 Submission Checklist

- [x] GitHub repository
- [x] Live deployed link (Vercel/Netlify)
- [x] Project report (this README)
- [ ] Demo video (optional)
- [ ] Viva / presentation

---

*Built with ❤️ for the Capstone Project — All The Best!*
