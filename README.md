# Research Collaboration Platform

A web-based platform that helps research authors create and manage calls for co-authors. Built with a clean, minimalist design inspired by GitBook.

## Features

- Discord Authentication: Secure login via Discord OAuth
- Research Call Creation: Create calls with title, summary, keywords, and CRediT taxonomy roles
- Unique URL Generation: Each call gets a unique URL valid until project closure
- Discord Integration: Automatically post calls to Discord channel
- Co-Author Application: Simple form for interested researchers to apply
- Lead Author Dashboard: Manage and track research calls
- Email Notifications: Get notified when co-authors apply

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, TypeScript, Shadcn UI
- **Backend**: Supabase, Clerk Auth, SQLite 
- **Integrations**: Discord OAuth, SendGrid for email

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Discord Developer Account (for OAuth setup)
- Supabase Account
- Clerk Auth Account
- SendGrid Account (for email notifications)

### Environment Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and fill in the required environment variables
3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Application routes (Next.js App Router)
- `/src/components`: Reusable UI components
- `/src/services`: Service modules for API integration
- `/backend`: Backend logic for third-party integrations

## Contributing

Please read the implementation plan in the documentation folder for details on our development process.

## License

This project is private and proprietary.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
