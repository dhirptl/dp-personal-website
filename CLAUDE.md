# Working rules for Claude

- **Delegate all work to subagents.** The main Claude session plans, coordinates, and reports; it does not edit files, write content, or run build/verification work itself. Every piece of implementation, content writing, asset handling, and verification is contracted to a subagent with a self-contained brief.
- Show changes locally (`npm run dev`, http://localhost:3000) and get the user's approval before anything is committed or pushed. Vercel deploys from GitHub `main` to dhirpatel.ca.
- All site copy lives in `lib/site-data.ts` and is written in lowercase, matching the existing voice.
- Project write-ups focus on engineering thought process: the problem, key design choices and why, what went wrong and how it was fixed, and what was learned. Never invent facts or metrics.
