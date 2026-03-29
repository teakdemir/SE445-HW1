import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import { google } from "googleapis";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Processing function: trims incoming input
function processInput(data) {
  const cleanName = (data.name || "").trim();
  const cleanEmail = (data.email || "").trim();
  const cleanMessage = (data.message || "").trim();

  return {
    cleanName,
    cleanEmail,
    cleanMessage
  };
}

// Google Sheets client using local service account JSON file
function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "google-service-account.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({ version: "v4", auth });
}

app.post("/process-message", async (req, res) => {
  try {
    const input = req.body || {};

    // Step 1: process/clean input
    const processedData = processInput(input);

    // Step 2: validation
    if (!processedData.cleanName || !processedData.cleanMessage) {
      return res.status(400).json({
        success: false,
        error: "'name' and 'message' are required fields."
      });
    }

    // Step 3: AI response generation with safe fallback
    let aiSummary = "";

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional assistant. Summarize the customer's message in one short professional sentence."
          },
          {
            role: "user",
            content: processedData.cleanMessage
          }
        ],
        temperature: 0.2
      });

      aiSummary =
        aiResponse.choices?.[0]?.message?.content?.trim() ||
        "AI summary could not be generated because API quota is unavailable.";
    } catch (aiError) {
      console.error("OpenAI error:", aiError.message);
      aiSummary =
        "AI summary could not be generated because API quota is unavailable.";
    }

    // Step 4: save to Google Sheets
    const sheets = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      return res.status(500).json({
        success: false,
        error: "GOOGLE_SHEETS_ID is missing in .env"
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sayfa1!A:D",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          processedData.cleanName,
          processedData.cleanEmail,
          processedData.cleanMessage,
          aiSummary
        ]]
      }
    });

    return res.json({
      success: true,
      input: {
        name: input.name || "",
        email: input.email || "",
        message: input.message || ""
      },
      processedData,
      savedToGoogleSheets: true,
      aiSummary
    });
  } catch (error) {
    console.error("Error in /process-message:", error.message);

    return res.status(500).json({
      success: false,
      error: "Something went wrong while processing the message."
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
