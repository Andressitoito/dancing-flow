# Database Management

This directory contains the application data stored in JSON format.

## Structure
- \`users.json\`: User accounts and roles.
- \`steps.json\`: Library of dance steps.
- \`choreos.json\`: Saved choreographies.
- \`videos.json\`: Metadata for video tutorials.

## Maintenance Instructions
- **Backups:** Always backup these files before performing bulk updates.
- **IDs:** The application uses Timestamps as string IDs (except for some initial seeds).
- **Updates:** If you manually update IDs, ensure all references (e.g., in \`choreos.json\` referencing steps) are also updated to prevent data inconsistency.
- **Passwords:** Passwords in \`users.json\` are hashed using \`bcryptjs\`.
