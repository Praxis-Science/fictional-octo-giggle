# Backend Structure Document

This document outlines the backend architecture, hosting solutions, and infrastructure components for the Research Collaboration Platform. It is designed to be clear and accessible, ensuring that anyone can understand how the backend is set up, even without a deep technical background.

## 1. Backend Architecture

The backend of our Research Collaboration Platform is designed to be lightweight, scalable, and easy to maintain. Here’s an overview:

*   **Design Patterns & Frameworks**:

    *   Built on a Node.js environment using Express for routing and middleware.
    *   Incorporates robust integration with Supabase for backend services and potential real-time features.

*   **Scalability & Maintainability**:

    *   The architecture is modular, allowing for individual components (like authentication, email handling, and Discord integration) to be updated independently.
    *   Using a combination of SQLite and Supabase, the system can handle low-load scenarios with ease while still allowing for growth as usage increases.

*   **Performance**:

    *   Lightweight services ensure fast response times.
    *   Efficient API design minimizes overhead and supports a smooth user experience.

## 2. Database Management

Our system uses a mix of database technologies to keep things simple while ensuring data is well-organized and secure:

*   **Database Technologies Used**:

    *   **SQLite**: A simple, file-based SQL database used primarily during development and for smaller production loads.
    *   **Supabase**: Provides additional backend services, including real-time capabilities and an interface for managing data and authentication.

*   **Data Structure & Storage**:

    *   Data is stored in structured tables with defined relationships, ensuring consistency and reliability.
    *   User profiles, research calls, application submissions, Discord data syncs, and email notifications are some of the distinct data groups.
    *   Regular backups and clear data management practices ensure that information remains secure and readily accessible.

## 3. Database Schema

### Human Readable Format Description

*   **Users Table**: Contains information about each user including Discord-derived data like username, email, and authentication credentials.
*   **Research Calls Table**: Stores details of research calls created by lead authors including titles, summaries, keywords, selected CRediT taxonomy roles, and unique URLs.
*   **Applications Table**: Records applications by potential co-authors, including their name, email, ORCID ID (if provided), and selected roles.
*   **Admin Table**: Manages administrative roles and permissions for overseeing users and calls.
*   **Integration Table**: Keeps track of Discord and ORCID integration status, synchronizing data across platforms.

### SQL Schema (PostgreSQL Example)

Below is an example of how the schema could be written if migrated to PostgreSQL (SQLite would be similar but with some differences in data types):

`-- Users Table CREATE TABLE users ( id SERIAL PRIMARY KEY, discord_id VARCHAR(255) UNIQUE NOT NULL, username VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Research Calls Table CREATE TABLE research_calls ( id SERIAL PRIMARY KEY, lead_author_id INTEGER REFERENCES users(id), title VARCHAR(255) NOT NULL, summary TEXT, keywords TEXT, roles VARCHAR(255), -- comma-separated list of roles based on CRediT taxonomy unique_url VARCHAR(255) UNIQUE NOT NULL, status VARCHAR(50) DEFAULT 'active', -- active or closed created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Applications Table CREATE TABLE applications ( id SERIAL PRIMARY KEY, research_call_id INTEGER REFERENCES research_calls(id), applicant_name VARCHAR(255) NOT NULL, applicant_email VARCHAR(255) NOT NULL, orcid_id VARCHAR(255), selected_roles VARCHAR(255), submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Admin Table CREATE TABLE admins ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), role VARCHAR(50) DEFAULT 'admin' ); -- Integration Table (to track Discord and ORCID sync details) CREATE TABLE integrations ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), discord_synced BOOLEAN DEFAULT FALSE, orcid_synced BOOLEAN DEFAULT FALSE );`

## 4. API Design and Endpoints

The system uses a RESTful API design to manage communication between the frontend and backend. Some of the key endpoints include:

*   **Authentication Endpoints**:

    *   `/auth/discord`: Handles Discord OAuth login and user data synchronization.
    *   `/auth/clerk`: Works with Clerk Auth for secure authentication sessions.

*   **Research Calls Management**:

    *   `POST /research-calls`: Allows lead authors to create new calls.
    *   `GET /research-calls/:id`: Retrieves details of a specific research call.
    *   `PUT /research-calls/:id`: Enables editing of an active research call.
    *   `DELETE /research-calls/:id` or `POST /research-calls/:id/close`: Marks a research call as closed, invalidating the unique URL.

*   **Application Submission**:

    *   `POST /applications`: For co-authors to apply to a research call.
    *   Automatic email notification triggers to the lead author upon new application submission.

*   **Admin Endpoints**:

    *   `/admin/users`: Allows admin users to manage user data and oversee platform usage.

*   **Integration Endpoints**:

    *   Endpoints to pull and sync data from Discord and ORCID.

## 5. Hosting Solutions

Our backend is hosted on a Linux-based cloud server, offering benefits such as:

*   **Reliability**: Linux servers are known for their stability and uptime.
*   **Scalability**: Cloud hosting allows for scaling resources as the platform grows.
*   **Cost-Effectiveness**: Cloud solutions typically offer flexible pricing models that suit project needs.

## 6. Infrastructure Components

Several key components work together to ensure the platform runs smoothly:

*   **Load Balancers**: Distribute incoming traffic evenly across server instances, improving responsiveness and reliability.
*   **Caching Mechanisms**: Utilized to store frequently accessed data, reducing load times and server strain.
*   **Content Delivery Networks (CDNs)**: Deliver static assets like images and scripts quickly to users around the globe, enhancing the overall performance.
*   **Email Service Provider**: A lightweight service such as SendGrid or Mailgun ensures that notification emails are sent promptly.

## 7. Security Measures

Security is a top priority for the platform. Measures include:

*   **Authentication & Authorization**:

    *   Integration with Clerk Auth and Discord OAuth ensures that only verified users gain access.
    *   Role-based access control differentiates permissions between regular users, lead authors, and admin users.

*   **Data Encryption**:

    *   Sensitive user and call data are encrypted during storage and transit, protecting against unauthorized access.

*   **Standard Security Practices**:

    *   Regular updates, patching, and monitoring help mitigate vulnerabilities.
    *   Error handling mechanisms provide clear, non-sensitive error messages to users without exposing system details.

## 8. Monitoring and Maintenance

To keep the backend running at its best, we employ the following tools and strategies:

*   **Monitoring Tools**:

    *   Logging services and monitoring tools (e.g., Prometheus, Grafana) track system performance and resource usage.
    *   Alerts are configured to notify the team of any unusual behavior or downtime.

*   **Maintenance Strategies**:

    *   Regular code reviews and automated testing ensure that the backend stays secure and efficient.
    *   Scheduled backups and systematic updates help manage data integrity and server performance.

## 9. Conclusion and Overall Backend Summary

The backend structure is carefully designed to support the goals of the Research Collaboration Platform:

*   **Modular and Scalable Architecture**: Using Node.js, Express, SQLite, and Supabase ensures that the platform remains lightweight and adaptable to growth.
*   **Effective Data Management**: Clear SQL schema and structured tables keep user and application data secure and organized.
*   **Robust API Infrastructure**: RESTful endpoints facilitate smooth communication between the frontend and backend, supporting seamless integration with Discord, ORCID, and email services.
*   **Secure and Reliable Hosting**: Linux-based cloud servers, along with load balancers, CDNs, and caching, provide a solid foundation for both current and future needs.
*   **Emphasis on Security and Maintenance**: Ongoing monitoring, regular updates, and clear error handling ensure the platform protects its users and remains up-to-date.

This comprehensive backend structure not only meets the project’s requirements but also sets a strong foundation for future enhancement and scalability, making it a standout solution in research collaboration platforms.
