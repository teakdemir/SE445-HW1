import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";

// Load values from .env file
// Example: OPENAI_API_KEY=...
dotenv.config();

const app = express();
const port = 3000;

// Let Express read incoming JSON body
app.use(express.json());

// Create OpenAI client using environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Processing Function:
 * Cleans and normalizes input data for later steps.
 */
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

// Trigger: POST endpoint
app.post("/process-message", async (req, res) => {
  try {
    const input = req.body;

    // Basic validation: name and message are required
    if (!input?.name || !input?.message) {
      return res.status(400).json({
        success: false,
        error: "'name' and 'message' are required fields."
      });
    }

    // Step 1: Processing Function (clean input)
    const processedData = processInput(input);

    // Validate again after trimming
    if (!processedData.cleanName || !processedData.cleanMessage) {
      return res.status(400).json({
        success: false,
        error: "'name' and 'message' cannot be empty."
      });
    }

    // Step 2: External API call (Agify)
    const agifyUrl = `https://api.agify.io/?name=${encodeURIComponent(processedData.cleanName)}`;
    const agifyResponse = await axios.get(agifyUrl);
    const externalApiResult = {
      predictedAge: agifyResponse.data?.age ?? null
    };

    // Step 3: AI Completion (OpenAI summary)
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

    const aiSummary = aiResponse.choices?.[0]?.message?.content?.trim() || "No summary generated.";

    // Final response
    return res.json({
      success: true,
      input: {
        name: input.name,
        email: input.email || "",
        message: input.message
      },
      processedData,
      externalApiResult,
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
