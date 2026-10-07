# Omnifood: Healthy Meal Subscription Website

A responsive, multi-page front-end for a meal-subscription business, with a working **admin dashboard** (recipe and user management).

**Live demo:** _add your Netlify / GitHub Pages link_ · **Code:** _add your GitHub link_

## Features
- Responsive landing page (hero, how it works, meals, pricing, testimonials, gallery, sign-up form)
- Sticky navigation, smooth scrolling, mobile menu (IntersectionObserver, vanilla JS)
- Plan selection with demo checkout (UPI / card tabs, no real payments or stored card data)
- Admin dashboard: create, edit, delete recipes and users; search, filter, pagination; live stats (total recipes, users, average rating); toast notifications; duplicate-email validation
- Recipes added in admin appear instantly on the public Meals section (shared `localStorage` data)
- Output escaping to prevent HTML injection from admin-entered text

## Tech stack
HTML5, CSS3 (Grid, Flexbox, responsive media queries), JavaScript (ES6+, DOM, localStorage), PWA manifest

## Run locally
Open `index.html` in a browser (or use the VS Code Live Server extension). Admin panel: `admin/index.html`.

## Project structure
```
index.html        public site
admin/            admin dashboard
css/  js/  img/   styles, scripts, assets
```

## Roadmap
- Node/Express + database backend (auth, orders)
- Analytics page: orders, revenue and diet popularity charts

## Credits
Original landing-page design from Jonas Schmedtmann's HTML & CSS course. Admin dashboard, data layer, validation and all JavaScript functionality built by me.
