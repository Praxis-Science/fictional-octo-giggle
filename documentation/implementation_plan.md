# Implementation plan

## Phase 1: Environment Setup

1.  Create a new repository using the CodeGuide Starter Lite template. Instruct the user to visit the CodeGuide Starter Lite repository and click “Use Template” to generate a new repo. (Development Notes)
2.  Verify that Node.js is installed on your system. If not, install Node.js (version as required by the CodeGuide Starter Lite, if unspecified use the latest LTS). **Validation**: Run `node -v` in the terminal. (Tech Stack: Core Tools)
3.  Install Next.js 14 explicitly (Note: Use Next.js 14 because it is better suited with current AI coding tools and LLM models). **Validation**: Run `npx create-next-app@14 --version` to confirm installation. (Tech Stack: Frontend)
4.  Initialize Tailwind CSS, Typescript, and install Shadcn UI components as specified in the tech stack. **Validation**: Verify installation by checking the configuration files (e.g., `tailwind.config.js` and `tsconfig.json`). (Tech Stack: Frontend)
5.  Set up the project directory structure by creating a `/src` folder with subdirectories: `/src/pages`, `/src/components`, and `/src/services` for frontend code. Also, create a `/backend` directory for modular backend code (e.g., Discord integration, email services). (Project Overview, Development Notes)
6.  Create a `.env` file at the project root to store environment variables such as Supabase connection details, Discord API credentials, email service API keys, and Clerk Auth configuration. **Validation**: Check that the file is present and variables are referenced properly in code. (Tech Stack: Backend & Integrations)

## Phase 2: Frontend Development

1.  Create the landing page at `/src/pages/index.tsx` with a clean, GitBook-inspired design. (Project Overview: Visual Design)
2.  Develop a login page and/or component at `/src/pages/login.tsx` that integrates Discord OAuth for user authentication. (Project Overview: Discord OAuth)
3.  Build a reusable DiscordLogin component in `/src/components/DiscordLogin.tsx` to handle Discord OAuth redirection and call the backend Discord callback endpoint. **Validation**: Test the OAuth flow in a development browser. (Project Overview: Discord Integration)
4.  Create a research call creation form component at `/src/components/CallForm.tsx` for lead authors. The form should include fields for title, summary, keywords, and selection of static CRediT taxonomy roles. **Validation**: Use client-side form validation and ensure form submissions are prevented on invalid input. (Project Overview: Core Functionality)
5.  Implement the Lead Author Dashboard at `/src/pages/dashboard.tsx` where lead authors can view, edit, and update their research calls, including adding publication links and modifying details. **Validation**: Check that changes persist by reloading the page. (Project Overview: Paper Management)
6.  Build a Co-Author Application component at `/src/components/CoAuthorApplication.tsx` to allow potential co-authors to apply for a call. **Validation**: Submit a test application and verify proper data capture. (Project Overview: Co-author application process)
7.  Create a service file at `/src/services/api.ts` to centralize API calls (e.g., POST to `/api/calls`, GET from `/api/calls/[slug]`). **Validation**: Write a simple test using a tool like Postman or in-code tests to check endpoint connectivity. (Project Overview, App Flow)

## Phase 3: Backend Development

1.  In the `/backend` directory, create a file named `discordIntegration.ts` to encapsulate all Discord API logic. This module should handle OAuth callbacks, automatic posting of call URLs to a Discord channel, and caching/retry logic for Discord API rate limits. **Validation**: Write unit tests to simulate Discord API responses. (Project Overview: Discord Integration, Development Notes)
2.  Create an API endpoint at `/src/pages/api/calls.ts` (using Next.js API routes) to handle the creation of research calls. The endpoint should generate a unique URL for each call, save call details in SQLite (via Supabase if needed), and trigger Discord posting as well as email notifications. **Validation**: Use `curl -X POST http://localhost:3000/api/calls` with sample payload and confirm a 200 response with a unique URL. (Project Overview: Core Functionality & Unique URLs)
3.  Develop an API endpoint in `/src/pages/api/calls/[slug].ts` to retrieve call details by the unique URL slug. **Validation**: Test with a GET request to ensure the correct call details are returned. (Project Overview: Paper Management)
4.  Build a Discord OAuth callback endpoint in `/src/pages/api/discord/callback.ts` that processes the OAuth redirect, retrieves user data from Discord, and synchronizes this data with your system. **Validation**: Simulate OAuth login and check that the user’s Discord details are logged or stored. (Project Overview: Discord Integration)
5.  Implement Clerk Auth integration middleware in the backend endpoints to secure API routes. (Tech Stack: Backend; Project Overview: Security & Scalability)
6.  In the `/backend` directory, create `emailService.ts` to integrate an email service (recommend using SendGrid as a starting recommendation) for sending email notifications when a new co-author application is received or when a call is posted. **Validation**: Use a test email API call and verify the email is sent to a designated test inbox. (Project Overview: Email Notifications)
7.  Create an API endpoint at `/src/pages/api/applications.ts` for handling co-author applications. This should allow creation of new applications and, if needed, updating of application status. **Validation**: Test using API tools and verify responses are as expected. (Project Overview: Core Functionality)

## Phase 4: Integration

1.  Modify the frontend CallForm component to call the `/api/calls` endpoint upon submission, capturing the returned unique URL. **Validation**: Submit a test call and check that the unique URL is displayed or stored. (Project Overview: Unique URLs)
2.  Connect the DiscordLogin component to the `/api/discord/callback` endpoint so that after successful Discord OAuth, the user’s data is synced and auto-populated in the dashboard. **Validation**: Complete a test login and ensure user details appear correctly. (Project Overview: Discord Integration)
3.  Integrate the email notification functionality into the call creation and application submission flows. Ensure that after a new call is created or a co-author applies, the corresponding email notification is sent. **Validation**: Trigger these actions and check the recipient’s inbox. (Project Overview: Email Notifications)
4.  Ensure that the backend logic correctly manages URL lifecycle states; when a project is closed, the unique URL becomes invalid. **Validation**: Attempt fetching a closed project URL and verify an appropriate error message is returned. (Project Overview: Unique URLs)

## Phase 5: Deployment

1.  Prepare a Dockerfile (or equivalent deployment configuration) tailored for a Linux-based cloud server, ensuring that both frontend (Next.js 14) and backend code are containerized. **Validation**: Build the Docker image locally and run it to confirm the application starts without errors. (Tech Stack: Deployment, Hosting)
2.  Configure environment variables on the deployment server to include Supabase credentials, Discord API keys, email service API keys, and Clerk Auth settings. **Validation**: Check that the running application can access these values correctly. (Tech Stack: Backend & Integrations)
3.  Set up a CI/CD pipeline (e.g., via GitHub Actions) to automate builds and tests before deployment to the production Linux-based server. **Validation**: Commit a change and verify that the CI/CD pipeline runs successfully and deploys to a staging environment. (Development Notes)
4.  Perform end-to-end testing by launching the deployed instance and running through test cases covering Discord OAuth login, call creation, co-author applications, email notifications, and unique URL invalidation. **Validation**: Use automated E2E tests (e.g., with Cypress) and manual testing to ensure all flows function as expected. (Project Overview: Core Functionality, Q&A)
5.  Monitor logs and set up alerting to catch any errors related to Discord API rate limits, email delivery failures, or database issues after deployment. **Validation**: Simulate API rate limit errors and verify that caching/retry logic in `discordIntegration.ts` is working as intended. (Project Overview: Discord Integration, Development Notes)
