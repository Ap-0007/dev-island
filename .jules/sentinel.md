## 2025-03-09 - [Broken Access Control in Island Visit Logging]
**Vulnerability:** The `POST /api/visit` endpoint was trusting the user-provided `visitorUsername` from the JSON body to log who visited an island. This allowed any user to spoof visits and impersonate others by modifying the API request.
**Learning:** In a mixed client-server Next.js architecture, API endpoints often forget to validate identity if they were initially designed to just take input from a client-side form or fetch request.
**Prevention:** Always rely on server-side session validation (`await auth()`) to determine the authenticated user's identity rather than trusting data sent from the client, especially for actions that affect records or attribute activity to a user.
