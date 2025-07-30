<a href="https://demo-nextjs-with-tealbase.vercel.app/">
  <img alt="Next.js and tealbase Starter Kit - the fastest way to build apps with Next.js and tealbase" src="https://demo-nextjs-with-tealbase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and tealbase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and tealbase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-tealbase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- tealbase-ssr. A package to configure tealbase Auth to use cookies
- Password-based authentication block installed via the [tealbase UI Library](https://tealbase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [tealbase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-tealbase.vercel.app](https://demo-nextjs-with-tealbase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a tealbase account and project.

After installation of the tealbase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-tealbase&project-name=nextjs-with-tealbase&repository-name=nextjs-with-tealbase&demo-title=nextjs-with-tealbase&demo-description=This+starter+configures+tealbase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-tealbase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-tealbase&demo-image=https%3A%2F%2Fdemo-nextjs-with-tealbase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a tealbase project which can be made [via the tealbase dashboard](https://database.new)

2. Create a Next.js app using the tealbase Starter template npx command

   ```bash
   npx create-next-app --example with-tealbase with-tealbase-app
   ```

   ```bash
   yarn create next-app --example with-tealbase with-tealbase-app
   ```

   ```bash
   pnpm create next-app --example with-tealbase with-tealbase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-tealbase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_tealbase_URL=[INSERT tealbase PROJECT URL]
   NEXT_PUBLIC_tealbase_ANON_KEY=[INSERT tealbase PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_tealbase_URL` and `NEXT_PUBLIC_tealbase_ANON_KEY` can be found in [your tealbase project's API settings](https://tealbase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://tealbase.com/docs/guides/getting-started/local-development) to also run tealbase locally.

## Feedback and issues

Please file feedback and issues over on the [tealbase GitHub org](https://github.com/tealbase/tealbase/issues/new/choose).

## More tealbase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [tealbase Auth and the Next.js App Router](https://github.com/tealbase/tealbase/tree/master/examples/auth/nextjs)
