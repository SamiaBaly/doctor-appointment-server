# 🏥 Doctor Appointment App (Server-Side Rendered)

A modern doctor appointment booking system built with **Next.js App Router**, **Server Components**, and **Authentication support**.

---

## 🚀 Features

- ⚡ Server-side rendering (SSR)
- 🔐 Authentication (session-based)
- 👨‍⚕️ Doctor listing with ratings
- 📅 Appointment management
- 👤 User profile system
- 🎯 Protected routes
- 📦 API integration (REST)

---

## 🛠️ Tech Stack

- Next.js (App Router)
- React Server Components
- Tailwind CSS
- Auth Client (session-based auth)
- REST API (Express / backend server)

---

## 📁 Project Structure

### /app
- page.js
- layout.js
- profile/page.js
- doctors/page.js

### /components
- DoctorCard.jsx
- Navbar.jsx
- PopularDoctor.jsx

### /lib
- auth-client.js
- auth.js

## 🔐 Authentication (Server Side)

We use server session to get user data:

```js
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({
  headers: headers(),
});

```

