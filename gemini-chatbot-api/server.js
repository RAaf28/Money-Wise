require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get API key from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-pro",
  systemInstruction: "You are a specialized financial assistant for the MoneyWise app. Your goal is to help users with budgeting, savings, and personal finance questions. Be concise, polite, and helpful. Do not give investment advice. Focus on budgeting, saving money, tracking expenses, and financial planning."
});

// Chat endpoint with conversation history support
app.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Convert history to the format expected by Gemini API
    let chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Ensure history starts with a user message
    if (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
      chatHistory = chatHistory.slice(1);
    }

    // Start a chat session
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        // Your generation configuration
      },
      safetySettings: [
        // Your safety settings
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      response: text
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ 
      error: "An error occurred with the AI service.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gemini-chatbot-api' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gemini Chatbot API server running on port ${PORT}`);
});

