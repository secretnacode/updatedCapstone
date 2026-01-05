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

<img width="1918" height="924" alt="Screenshot 2026-01-05 222837" src="https://github.com/user-attachments/assets/2504bb39-26aa-4c62-bfd2-7987245aca86" />

this is the farmer dashboard where it will be show a simple info about the user report and crop status

## Farmer Report page

<img width="1918" height="925" alt="Screenshot 2026-01-05 223024" src="https://github.com/user-attachments/assets/d2b0042b-aed2-4559-b2d3-21eaaba5d4f4" />

this is the table where it will show all the passed reports of the user

the user can create a report by pressing the "Gumawa button" 

if you dont have a information about the crop, you cant make a report yet, crop info is needed when making a report, so you need to make a crop info first(refer to the farmer crop page)

after you press "Gumawa button" a modal will pop up

<img width="1919" height="918" alt="Screenshot 2026-01-05 225024" src="https://github.com/user-attachments/assets/38146707-820d-41ce-9c45-dd6c70b44172" />

the first field shows all the existing crop of the user, first crop will be the default selected crop. the 2nd field shows all the possible report type the user can create

## Farmer Report page(Planting)

<img width="1915" height="917" alt="Screenshot 2026-01-05 225552" src="https://github.com/user-attachments/assets/e02c89d0-9cb9-41c8-8524-6b1ee17f1923" />

"pagtatanim" (planting) report is where the user can create a report after the user plant its crops, this will make the crop status into "nataniman" (planted) status, for validation, the user cant pass a "pagtatanim" report of the crop if the crop is not a new crop, not "bakante" (vacant) status, or not "naani" (harvested) status yet, meaning you cant make another "pagtatanimg report" if you already pass a "pagtatanim" report, and you can only make a "pagtatanim" report if you passed a "pag-aani" report meaning the crop is already harvested and new crop can be planted again

## Farmer Report page(Damage)

<img width="1916" height="924" alt="Screenshot 2026-01-05 225647" src="https://github.com/user-attachments/assets/5773ea39-d3f7-4c19-aa53-b0e8ee2ba000" />

"pagkasira" (damage) report is where the user can create a damage report when a calamity or pest damage the user crops, there's a button "Buong tinataniman" which signifies that all of the crop was destroyed, the user dont need to add amount of hectares of damage if the user pick this button, if the user pass this kind of damage report(the user select the "buong tinataniman" button), the crop status will change into "bakante" (vacant) status, for validation, the user cant make a "pagkasira" report if the crop status is not "nataniman" (planted) status yet, meaning the crop is not planted yet so there's no crop that is damage yet

## Farmer Report page(Harvest)

<img width="1919" height="928" alt="Screenshot 2026-01-05 231534" src="https://github.com/user-attachments/assets/978a1c5c-3912-4895-b5cd-44e7bd72e8ed" />

"pag-aani" (harvest) report is where the user can create harvest report when the crop of the farmer is harvested, for validation, the user can only pass a "pag-aani" (harvest) report if the pass a "pagtatanim" report 3 months ago, this is just to make sure that a crop was planted before it was even harvest and to make sure an early harvest was avoided

the farmer report will be redirected to farmer leader if the user has an organization for validation of report before passing the report to the agriculturist, but if the user has no organization, it will be redirected to the agriculturist directly but the report will be marked as not validated

## Farmer Crop page

<img width="1918" height="923" alt="Screenshot 2026-01-05 223913" src="https://github.com/user-attachments/assets/4973d193-debe-4e4e-866b-24db66a59665" />

the crop page is where you can make and edit a crop info

to add a crop info, press the "Mag dagdag ng pananim" button

<img width="1919" height="922" alt="Screenshot 2026-01-05 224531" src="https://github.com/user-attachments/assets/4e11a0fc-82de-426c-a81f-ccc2246e1903" />

a modal will pop up where the user can add the information

## Profile page

<img width="1919" height="917" alt="Screenshot 2026-01-05 232632" src="https://github.com/user-attachments/assets/038ab670-4613-461a-ab88-28ffdd7f2cc8" />

a profile page where the user info is included and can be edited

<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/845f834c-906a-4a24-bef3-2c176d0f1358" />

you can change your organization in "Organisasyon na Kinabibilangan", but after you change your organization, you need to be verified again, because the user authenticity need to be confirmed by the user leader or the agriculturist(e.g. youre currently no org farmer but you want to go into another org, means your report will be redirected to the leader instead of the agri, so for validation, the leader need to verify your acc first so prove that your account was accepted to that organization)

<img width="1919" height="923" alt="image" src="https://github.com/user-attachments/assets/c4b80bd3-19c5-4876-93f0-01bf935296a9" />

the user can change its current password in the "Magpalit ng Password" section

## Farmer Leader Dashboard

<img width="1918" height="921" alt="image" src="https://github.com/user-attachments/assets/96eca847-3b7d-4d30-a4b0-3a6079da41fe" />

this is the farmer leader dashboard where it will be show a simple info about the member report and user crop status

## Farmer Leader Report page

has the same function as farmer report page

BUT the farmer leader report will be directly passed to the agriculturist

## Farmer Leader Crop page

has the same function as farmer crop page

## Farmer Leader Member Report page

<img width="1918" height="923" alt="image" src="https://github.com/user-attachments/assets/697ad0be-ec10-41b1-a00c-75190fac407b" />

this is a page where the leader can validate the member's report 

## Farmer Leader Farmer Member page

<img width="1919" height="919" alt="image" src="https://github.com/user-attachments/assets/99a90340-7242-4528-abc8-ff1b66d5fd04" />

a page where you can manage the account of your member, you can verify, block, and delete member account of the leader

## Farmer Leader Profile page

has the same function as farmer Profile page

## Agriculturist and Admin Dashboard 

<img width="1912" height="916" alt="image" src="https://github.com/user-attachments/assets/95891c99-440d-4556-810d-c1448c93045e" />

dashboard of admin and agri where it will shows a breif data about all the farmers report

## Agriculturist and Admin Report Page 

<img width="1918" height="924" alt="image" src="https://github.com/user-attachments/assets/f6ac6be9-2f38-409d-a593-b0d0555cf86c" />

Report page where it will see all the report of the farmer

<img width="1917" height="913" alt="image" src="https://github.com/user-attachments/assets/8b2f3257-7941-4ec9-9760-1218999fbd4d" />

the agri and admin can also download the report base on the filtered option

## Agriculturist and Admin Crop Page 

<img width="1918" height="918" alt="image" src="https://github.com/user-attachments/assets/a49f9678-2414-4292-b745-9cc8ead3820a" />

the user can see all the crop location of all farmer

## Agriculturist and Admin Farmer User Page 

<img width="1917" height="920" alt="image" src="https://github.com/user-attachments/assets/9a21a888-dda6-4f52-ae19-c6a18c76bed5" />

the user can block or delete any farmer user

if the user press the profile button, it will redirect the user to another page where it will show the user profile info and org info 

<img width="1917" height="924" alt="image" src="https://github.com/user-attachments/assets/d496f92d-3f66-4d8b-ae41-4f91ddfb8bcf" />

## Agriculturist and Admin Verify User Page 

<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/62127a15-72c2-4fd7-970d-19527d4d0b09" />

this is the page where the user can verify the user acount that is leader role or user that has no org

## Agriculturist and Admin Organization Page 

<img width="1919" height="926" alt="image" src="https://github.com/user-attachments/assets/e5c87afe-37f6-4850-a4a1-e016cf796e59" />

the user will see all the existing organization

if the user press the View Org, the user will be redirected to another page where it will show all the member in that organization 

<img width="1913" height="923" alt="image" src="https://github.com/user-attachments/assets/e35ed6e5-49fb-4e8b-b270-cd58e1ddc0e7" />

## Agriculturist Create Link Page

<img width="1919" height="924" alt="image" src="https://github.com/user-attachments/assets/67c6c3fd-c096-40d4-9d08-63ecfa37df48" />

the create link page is where all the link created will be shown, the admin will only see all the created link for password reset link, this link is used to make a new password for the user who forgets their password, this process is like this, press the button Create first, after the click action, a modal will appear

<img width="1914" height="914" alt="image" src="https://github.com/user-attachments/assets/3a900358-7d47-42cf-9a31-66ce74e5525c" />

this modal is consist of all farmer user's account, just find the user that request to change thier password then press the "reset password" at the right side of the name of the farmer in the modal. this link will contain the user info that you picked like the user id, so it means as long as the user who goes to the link and change its password, it will be the new password of the user that is indicated in that link

## Agriculturist Create Link Page

<img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/716f9b0f-ea81-481e-82b2-8d69f29fbbd8" />

this is where the admin and agriculturist differ, the admin has additional option in create link which is the Create Agriculturist, this means the user who will sign up in that link will automatically be a agriculturist 

## Admin Create Link Page

<img width="1919" height="930" alt="image" src="https://github.com/user-attachments/assets/9d2a9d5d-6bac-49e7-8a44-5fbdad7fb897" />

this page is where the admin will 

## Teck Stack

FronEnd:
- Next.js
- Tailwind
- Lucide-React
- Clerk
- MUI React Charts
- React Maplibre

BackEnd:
- Next.js(server action)
- Zod
- PG(PostgreSQL command)
- Neon DB
- Turf.js
- Upstash Redis
- Weather API

## Getting Started

clone my report

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
