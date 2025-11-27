# Gemini Chatbot API

Express.js backend server for the MoneyWise AI Companion powered by Google Gemini AI.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

3. **Add your Gemini API key:**

   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add it to `.env`:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Start the server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### POST `/chat`

Send a message to the AI chatbot.

**Request:**

```json
{
  "message": "How can I save more money?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help you?" }
  ]
}
```

**Response:**

```json
{
  "response": "Here are some tips to save more money..."
}
```

### GET `/health`

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "service": "gemini-chatbot-api"
}
```

## Environment Variables

- `GEMINI_API_KEY` (required): Your Google Gemini API key
- `PORT` (optional): Server port, defaults to 3001
- `NODE_ENV` (optional): Environment (development/production)

## Deployment

For production deployment:

1. Set environment variables on your hosting platform
2. Make sure `GEMINI_API_KEY` is set
3. Update `VITE_CHAT_API_URL` in frontend `.env` to point to your deployed API URL

## Notes

- The API uses conversation history to maintain context
- System instruction is set to make the AI a financial assistant
- CORS is enabled for frontend communication
