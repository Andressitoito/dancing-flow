# Instruction for AI Agents (Jules)

This repository is configured as a production-ready MVP for "Dancing Flow". To ensure data integrity and prevent regressions in persistence, follow these rules:

## 1. Data Preservation (CRITICAL)
- **DO NOT** overwrite, reset, or delete files in the `db/` directory. These files contain user accounts, choreographies, and steps that must be preserved.
- **DO NOT** commit the `.json` files within `db/` to the repository. They are ignored by Git to prevent production data from being overwritten by local test data.
- **DO NOT** change the structure of `db/*.json` without implementing a migration script in `server/migrations/` (if applicable).

## 2. File Persistence
- The application uses `fs.writeFileSync` for persistence. Ensure any changes to the data logic maintain the atomicity of these writes.
- The `uploads/` directory is for user-uploaded content (images/videos) and must also be ignored and preserved.

## 3. Environment Stability
- When deploying or rebuilding, the `db/` directory must be treated as a volume/persistent storage.
- Always check for the existence of `db/users.json` before attempting to "seed" default users.

## 4. Architectural Integrity
- Maintain the "Dancing Flow" branding and vibrant palette.
- Do not remove diagnostic tools (like the backend status checker) as they are essential for remote debugging on Raspberry Pi environments.
