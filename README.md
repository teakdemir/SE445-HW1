# Customer Ticket Processor (SE445 HW1)

## Homework Goal
Build a beginner-friendly backend + simple UI with this workflow:

**input -> validation -> Google Sheets -> AI response**

This project uses plain Node.js + Express and is easy to explain in class.

---

## Final Workflow
1. User fills the frontend form (`name`, `email`, `message`).
2. Frontend sends `POST /process-message`.
3. Backend runs validation and `processInput(data)`.
4. Backend generates a short AI summary.
5. Backend saves ticket data to Google Sheets.
6. Backend returns JSON.
7. Frontend shows success/error and AI summary.

---

## Technologies Used
- Node.js
- Express
- dotenv
- googleapis
- OpenAI SDK

---

## Project Structure
- `index.js`
- `package.json`
- `.env.example`
- `.gitignore`
- `README.md`
- `public/index.html`
- `public/style.css`
- `public/script.js`

---

## Setup Instructions
1. Install dependencies:

```bash
npm install
```

2. Create your `.env` file:

```bash
cp .env.example .env
```

3. Update `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_SHEETS_ID=your_google_sheet_id_here
```

4. Add your Google service account key file in the project root:

`google-service-account.json`

5. Make sure your Google Cloud / Sheet setup is ready:
- Google Sheets API must be enabled in Google Cloud.
- A service account JSON key is required.
- The target Google Sheet must be shared with the service account email.

---

## How to Run
Start the app:

```bash
npm start
```

Open browser:

`http://localhost:3000`

---

## Frontend Behavior
The UI includes:
- Title: **Create Ticket**
- Subtitle with short explanation
- Fields: `name`, `email`, `message`
- Submit button
- Result box

On submit:
- Sends JSON to `POST /process-message`
- Shows loading state on button
- Shows success with AI summary, or error message

---

## API Endpoint
### `POST /process-message`

### Example Input
```json
{
  "name": "Tolga",
  "email": "tolga@example.com",
  "message": "I want information about your services and pricing."
}
```

### Example Output
```json
{
  "success": true,
  "input": {
    "name": "Tolga",
    "email": "tolga@example.com",
    "message": "I want information about your services and pricing."
  },
  "processedData": {
    "cleanName": "Tolga",
    "cleanEmail": "tolga@example.com",
    "cleanMessage": "I want information about your services and pricing."
  },
  "savedToGoogleSheets": true,
  "aiSummary": "The customer is asking for information about services and pricing."
}
```

---

## Homework Requirement Mapping
- **input** = frontend form / POST body
- **validation** = required field checks + `processInput(data)`
- **Google Sheets** = append row to `Sheet1!A:D`
- **AI response** = OpenAI short summary sentence

---

## Fallback Behavior Note
If OpenAI quota (or API call) fails, the backend does not crash.
It returns this fallback summary:

`AI summary could not be generated because API quota is unavailable.`
