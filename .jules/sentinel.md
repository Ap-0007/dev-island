## 2026-05-11 - Fixed IDOR/Spoofing in Visit Logging
**Vulnerability:** The POST `/api/visit` endpoint was vulnerable to Insecure Direct Object Reference (IDOR) / spoofing. It trusted the `visitorUsername` provided in the JSON request body without verifying it against the authenticated session, allowing any user to spoof visits from any other user.
**Learning:** Never trust client-provided data for identity. Always verify identity on the server using secure session mechanisms.
**Prevention:** Use server-side authentication functions (e.g., `auth()` from NextAuth) to determine the current user's identity instead of relying on data passed in the request payload.
