## Reporting system for Calauan, Laguna that's specialized for rice farmers

A seamless reporting system built by using Next.js together with other tools

## The working website is:

```bash
https://updated-capstone-brown.vercel.app/
```

## Features:

- Role-Based Access Control
- Mobile-First Access
- Visual Summaries
- Category Filters
- Keyword Search
- Secure Login
- Filtered Downloads

## Introduction

we have 4 role:

- Admin
- Agriculturist
- Farmer Leader
- Farmer

## Sign In

<img width="1917" height="926" alt="Screenshot 2026-01-05 130329" src="https://github.com/user-attachments/assets/4064c67e-e99c-4ecd-ab5a-40514472a9a0" />

this is the landing page where its also a sign in page for farmer and farmer leader

## Sign Up

<img width="1919" height="927" alt="Screenshot 2026-01-05 130528" src="https://github.com/user-attachments/assets/60edb3b8-36e0-4800-8e57-67ee58b9929a" />

this is the sign up page for the new user

## Fill up form after sign in

<img width="1914" height="918" alt="Screenshot 2026-01-05 130855" src="https://github.com/user-attachments/assets/91feb1c9-3e8a-4136-be60-43804e59d84e" />

after the sign up, it will redirect the user to a new page for user information, the user role(normal farmer / farmer leader) will be determined by what the user will select in the organization section, if the user create another organization, it only means that the user is a leader(role), but if the user didnt pick an org(no org) or pick an existing org, the user is a normal farmer(role)

after the user sign up the form, the user will be redirected to the landing page with a notification, meaning the user was done filling up the form. The user need to wait before the user can use the system, because user's account need to be validated by agriculturist(if the user is leader and has no org) or farmer leader(user within an organization)

if the user log in but the form wasnt done yet(e.g. after sign in, the user do something and forget about the user form), the user will be redirected to the form page again

## Farmer Dashboard



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
zzz
