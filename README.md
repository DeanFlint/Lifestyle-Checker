# Lifestyle Checker

A Next.js 16 app that lets users validate their NHS details and complete a short lifestyle questionnaire. 
Successful login reveals the questionnaire and returns tailored guidance based on age- and answer-weighted scoring.

## Stack
- Next.js 16 (App Router) with React 19
- TypeScript, CSS modules
- Jest + Testing Library for unit/UI tests

## Prerequisites
- Node.js 20+
- npm
- Access to the upstream API endpoint and subscription key

## Environment
Create `.env.local` with:
```
API_BASE_URL=https://al-tech-test-apim.azure-api.net/tech-test/t2/patients
API_KEY=your-key-here
```
These are injected into the `/api/login` route for server-side fetches.

## Local Development
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Tests
```bash
npm test
```

## Docker
Production-style image:
```bash
docker compose up --build
# serves on http://localhost:3000
```

Hot-reload dev container (swap into `docker-compose.yml` when needed):
```yaml
services:
  web:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "npm install && npm run dev -- --hostname 0.0.0.0 --port 3000"
    ports:
      - "3000:3000"
    environment:
      API_BASE_URL: https://al-tech-test-apim.azure-api.net/tech-test/t2/patients
      API_KEY: your-key-here
      # CHOKIDAR_USEPOLLING: "1"  # enable if file changes aren't detected
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
```

## Test users
There are 5 patients configured, which should allow you to test various scenarios

Nhs Number | Name | Age | DOB |
-----------|------|-----|----|
111222333  | DOE, John | 18 | 14/01/2007
222333444  | SMITH, Alice| 25 | 02/03/2000
333444555  | CARTER, Bob | 46 | 20/05/1979
444555666  | BOND, Charles | 70 | 18/07/1955
555666777  | MAY, Megan | 14 | 14/11/2011

## App Flow
1) User enters NHS number, surname, and DOB.
2) `/api/login` calls `API_BASE_URL/{nhsnum}` with `API_KEY` and checks NHS number, surname, and DOB match.
3) If eligible (16+), the questionnaire appears; scoring uses age brackets and answer weights to decide whether to recommend an appointment.

## Key Scripts
- `npm run dev` start dev server
- `npm run build` production build
- `npm start` run built app
- `npm test` run Jest suite

## Project Structure
- `src/app/page.tsx` entry shell tying login + questionnaire
- `src/app/login` login UI and validation
- `src/app/questionnaire` questionnaire UI and scoring
- `src/app/api/login/route.ts` server-side login proxy to upstream API

## Future Work
### With the time given, I wanted to focus on the following:
**[Link to project KANBAN board used](https://github.com/users/DeanFlint/projects/2/views/1)**
- Functional login form (with basic validation)
- API Routing to authenicate user
- Questionnaire for authenticated user
- Questionnaire logic to determine outcome based on user age and their answers
- Introductory tests
- Styling from the NHS styling package
- Portability considered by adding ability to run via Docker

### Given more time, here are the parts I would focus on next:
- Add more form validation for the user login
- Add more tests scenarios
- Use of accessibility tools such as Wave and Lighthouse
- Ability to see questionnaire answers once user has submitted (and option to reset without logging out)
- Use the NHS.UK React component library: https://main--65aa76b29d00a047fe683b95.chromatic.com/?path=/docs/welcome--docs
- Add an option to toggle dark/light mode

## Part Three
How could the code be implemented in such a way that the scoring mechanism could be altered without requiring the code to be recompiled and re-deployed?
This could be a change to age groups or scores for individual questions.

- **Config file (JSON/YAML):** Load config/scoring.json (age bands + weights) at runtime (Validate on load). We can make edits the file and restart the container (no rebuild/redeployment).
- **Remote config/API:** Serve scoring from an internal endpoint (e.g., /api/scoring which is backed by a DB). Client fetches it at startup. We can update via the data store and the app picks it up on next fetch/cache expiry.
