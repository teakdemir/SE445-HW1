# Customer Message Processor (SE445 HW1)

## Homework Goal
Build a simple backend pipeline using this pattern:

**Trigger → Processing Function → External API → AI Completion**

This project is intentionally beginner-friendly and uses plain Node.js + Express only.

<img width="1471" height="402" alt="image" src="https://github.com/user-attachments/assets/dc9abb4f-2b89-4053-86ce-bdbaf02d0339" />

// there is an secret API key that I cannot share in the files.

---

## Workflow Explanation
When you send a request to the API:

1. **Trigger**: `POST /process-message` receives JSON input.
2. **Processing Function**: `processInput(data)` validates and cleans the input.
3. **External API**: Server calls Agify (`https://api.agify.io`) to get an age prediction from the name.
4. **AI Completion**: Server calls OpenAI to summarize the customer's message.
5. Server returns a final JSON response.

---

## Technologies Used
- Node.js
- Express
- dotenv
- axios
- OpenAI official SDK

---

## Installation
1. Clone the repository.
2. Open the project folder.
3. Install dependencies:

```bash
npm install
```

4. Create your `.env` file from `.env.example`:

```bash
cp .env.example .env
```

5. Add your OpenAI API key to `.env`:

```env
OPENAI_API_KEY=your_real_key_here
```

---

## How to Run
Start the server:

```bash
npm start
```

Server runs on:

`http://localhost:3000`

---

## API Endpoint
### `POST /process-message`

Expected input example:

```json
{
  "name": "Tolga",
  "email": "tolga@example.com",
  "message": "I want more information about your services and pricing."
}
```

### curl Test Example

```bash
curl -X POST http://localhost:3000/process-message \
-H "Content-Type: application/json" \
-d '{
  "name": "Tolga",
  "email": "tolga@example.com",
  "message": "I want more information about your services and pricing."
}'
```

Expected output example:

```json
{
  "success": true,
  "input": {
    "name": "Tolga",
    "email": "tolga@example.com",
    "message": "I want more information about your services and pricing."
  },
  "processedData": {
    "cleanName": "Tolga",
    "cleanEmail": "tolga@example.com",
    "cleanMessage": "I want more information about your services and pricing."
  },
  "externalApiResult": {
    "predictedAge": 29
  },
  "aiSummary": "The customer is asking for information about services and pricing."
}
```

---

## Requirement Mapping (Explicit)
- **Trigger** = `POST /process-message`
- **Processing Function** = `processInput(data)` for cleaning/validation
- **External API** = Agify API call (`https://api.agify.io/?name=<name>`)
- **AI Completion** = OpenAI summary generation

---

## Notes for Submission
- No TypeScript
- No database
- No Docker
- No frontend
- No authentication
- No deployment setup
- Minimal file structure for easy explanation in class


