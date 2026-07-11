## 2025-01-20 - [Fix Identity Spoofing in Visit API]
**Vulnerability:** Identity spoofing vulnerability in `/api/visit`. The API trusted the client-provided `visitorUsername` payload to determine the visitor's identity, allowing malicious users to arbitrarily record visits as another user.
**Learning:** Client payloads should never be trusted for authentication or identity purposes. Even minor endpoints like visit counters are susceptible to abuse and can pollute data integrity.
**Prevention:** Rely on securely validated server-side session data (`auth()`) to determine user identity instead of parsing request bodies for user identification fields.
