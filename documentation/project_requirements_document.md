# Project Requirements Document

## 1. Project Overview

This project is a web-based Research Collaboration Platform that helps research authors create and manage calls for co-authors. It is designed to be lightweight and simple, with its look and feel inspired by GitBook.com. The application will allow lead authors to generate project calls with a title, summary, keywords, and specific research roles (based on the static CRediT taxonomy). Once created, a unique URL is generated that is shared automatically on Discord channels, making it easy for interested researchers to apply as co-authors. Additionally, the platform includes a dashboard for managing ongoing research papers, editing details, and adding publication links when a project concludes.

The platform is being built to streamline academic collaboration in a user-friendly and minimally complex environment. Key objectives include secure and smooth Discord integration (including OAuth login and real-time data synchronization), automatic email notifications for application submissions, and future-friendly optional integration with external services like ORCID. Success will be measured by the ease of use for lead authors, the reliability of communications with co-author applicants, and the performance of a lightweight, minimal tech stack.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

*   Discord Authentication: Using Discord OAuth for login and retrieving user data.
*   Research Call Creation: Enabling lead authors to create calls for co-authors with details like title, summary, keywords, and selection from a fixed CRediT taxonomy.
*   Unique URL Generation: Generating a unique URL that remains valid until the research project is closed.
*   Discord Posting & Synchronization: Automatically posting research calls to a designated Discord channel and syncing user data.
*   Co-Author Application Process: Allowing interested researchers to apply, enter their name, email, choose roles, and (optionally) provide their ORCID ID.
*   Lead Author Dashboard: A management interface to view, edit and close research calls, as well as add publication links.
*   Email Notifications: Sending email notifications to the lead author when a co-author application is received.
*   Admin Role: Including administrative oversight with specific permissions for system monitoring.

**Out-of-Scope:**

*   Extensive visual customizations beyond a clean, simple design inspired by GitBook.
*   Complex audit trails or change history for paper management.
*   Real-time analytics or in-depth reporting.
*   External integrations beyond the optional ORCID feature (e.g., full integration with Google Scholar or complex ORCID data importation) in this initial version.
*   Advanced scalability features beyond standard security and lightweight performance requirements.

## 3. User Flow

A new user begins by visiting the platform and is prompted to sign in via Discord OAuth. Upon successful authentication, the system retrieves basic user details (like the Discord username) and syncs this information into its database, ensuring any subsequent interactions (such as co-author applications) come pre-filled with correct data. The user is then directed to the main page where they can either create a new research call (if they are a lead author) or browse active calls for co-authorship.

For lead authors, after logging in, they access a dedicated interface to fill in details (title, summary, keywords, and select static CRediT roles) for generating a research call. After submitting, the system creates a unique URL that is automatically posted on a designated Discord channel and stored in the database. Potential co-authors follow this URL which leads them to a submission page where they can fill in their name, email, and select suitable roles—even having their data auto-populated if already registered. Submitted applications trigger an email notification to the lead author. Finally, the lead author can manage calls, make edits, or close the project through a dashboard, at which point the unique URL is invalidated.

## 4. Core Features

*   **Discord Authentication:**

    *   Implement Discord OAuth to allow users to log in securely.
    *   Retrieve and sync key user details (like Discord username) to reduce repetitive data entry.

*   **Research Call Creation:**

    *   Interface for lead authors to create calls with a preliminary title, summary, keywords, and role selections from a fixed CRediT taxonomy.
    *   Automatically generate a unique URL for each research call that remains active until manually closed.

*   **Discord Posting & Data Synchronization:**

    *   Automatically post the unique URL along with research call details to a designated Discord channel.
    *   Synchronize user profile data from Discord for auto-populating application forms.

*   **Co-Author Application Management:**

    *   Provide a submission interface for potential co-authors to select roles, enter their name, email, and optionally an ORCID ID.
    *   Feature automatic email notifications to the lead author when an application is submitted.

*   **Dashboard for Paper Management:**

    *   Enable lead authors to view and manage their research calls.
    *   Allow editing of research call details after posting and adding publication links upon completion, alongside invalidating the URL when closed.

*   **Administrative Oversight:**

    *   Include an admin role with permissions to manage users, supervise project submissions, and maintain platform security and performance.

## 5. Tech Stack & Tools

*   **Frontend:**

    *   Next.js for building the web application.
    *   Tailwind CSS for a clean, simple, and responsive design inspired by GitBook’s aesthetics.
    *   Typescript for type safety and better maintainability.
    *   Shadcn UI components for a modern, accessible UI.

*   **Backend:**

    *   Node.js with Express for a lightweight web server.
    *   SQLite as the database for simplicity and ease of deployment.
    *   Supabase for backend services if real-time functionalities or additional database features are needed.

*   **Authentication & Integrations:**

    *   Clerk Auth for secure and streamlined user authentication.
    *   Discord OAuth for authentication and channel integration.
    *   Email service integration (to be chosen from a recommended lightweight provider, e.g., SendGrid or Mailgun) for sending notifications.
    *   Optional integration with ORCID to import additional user data.

*   **Development Tools:**

    *   Cursor, an advanced AI-powered coding IDE, for real-time suggestions during development.
    *   CodeGuide Starter Lite as the starter kit, structured as provided in the repository.

## 6. Non-Functional Requirements

*   **Performance:**

    *   The application should load quickly and handle user interactions with minimal delay.
    *   API responses (e.g., generating a unique URL, posting on Discord, email notifications) should occur within a few seconds under normal conditions.

*   **Security:**

    *   Ensure secure authentication via Discord OAuth and Clerk Auth.
    *   Protect user data in both transit and at rest using standard encryption practices.
    *   Implement standard security practices to address common vulnerabilities.

*   **Compliance & Usability:**

    *   The UI should be clean and easy to navigate, aligning with the minimal design inspiration from GitBook.
    *   Follow best practices for accessibility.
    *   Handle user data responsibly and in compliance with relevant data protection regulations.

*   **Reliability:**

    *   The system should provide consistent behavior across major modern browsers and responsive designs for mobile and desktop.
    *   Maintain lightweight system requirements to handle a moderate volume of simultaneous users.

## 7. Constraints & Assumptions

*   **Constraints:**

    *   The project relies on Discord OAuth for authentication and channel posting; thus, the availability and rate limits of Discord API are a dependency.
    *   Email notifications depend on the chosen email service provider, so any limitations or downtime there can affect the notification system.
    *   The system is built on a minimal tech stack focusing on simplicity and lightweight performance, which may limit scalability for very large datasets.

*   **Assumptions:**

    *   The static CRediT taxonomy will not require frequent updates or customizations.
    *   Users have or can create Discord accounts to access the platform.
    *   The target audience is comfortable using minimal interfaces and simple form-based interactions.
    *   The platform will initially support only basic external integrations (with ORCID being optional) without extensive third-party data sync.

## 8. Known Issues & Potential Pitfalls

*   **Discord API Rate Limits and Downtime:**

    *   There's a risk of hitting rate limits when synchronizing user data or posting updates, especially in high-traffic scenarios.
    *   Mitigation: Implement caching strategies and error handling routines to manage API limits gracefully.

*   **Email Notification Dependencies:**

    *   The reliability of email notifications is dependent on the selected email service provider.
    *   Mitigation: Choose a robust email service with a fallback plan and proper error logging to alert for any delivery issues.

*   **Unique URL Management:**

    *   Managing the validity and automatic invalidation of unique URLs upon project closure might be tricky if there’s a lag in the update process.
    *   Mitigation: Clearly define URL lifecycle states in the backend logic and thoroughly test the invalidation process.

*   **Discord Data Synchronization:**

    *   Automated data synchronization from Discord (like fetching usernames) may fail if Discord changes its API response format.
    *   Mitigation: Modularize the Discord integration code so it is easy to update and include error-handling mechanisms.

*   **User Experience Consistency:**

    *   Ensuring the simple, clean design remains intuitive even as features expand is essential.
    *   Mitigation: Follow a design-first approach with regular usability testing, especially when allowing edits to research calls post-publication.

This PRD is intended to serve as the definitive reference for building the Research Collaboration Platform. It covers all main functionalities, technology choices, user flows, and potential pitfalls, ensuring every subsequent technical document can be generated without ambiguity.
