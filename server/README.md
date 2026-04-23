# Server Documentation

The backend is a Node.js Express server located in the \`server/\` directory.

## Architecture
- **Monolith:** Serves as both an API and a proxy for development.
- **Routes:** Modularized into \`server/routes/\`.
- **Database:** Flat JSON files in \`db/\`.

## API Endpoints
- \`/backend-service/auth/*\`: Authentication and registration.
- \`/backend-service/steps/*\`: Step management.
- \`/backend-service/choreos/*\`: Choreography management.
- \`/backend-service/videos/*\`: Tutorial videos and file uploads.

## Development
The server runs on port 3001. Vite is configured to proxy \`/backend-service\` to this port.
