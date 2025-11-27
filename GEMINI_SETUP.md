# Google Gemini AI Chatbot Setup Guide

## ✅ Implementation Complete

The Google Gemini AI chatbot has been successfully integrated into MoneyWise! Here's what was implemented:

## 📁 Files Created/Modified

### Backend (Express Server)

- ✅ `gemini-chatbot-api/server.js` - Express server with Gemini API integration
- ✅ `gemini-chatbot-api/package.json` - Updated with dependencies (cors, express, @google/genai)
- ✅ `gemini-chatbot-api/README.md` - API documentation

### Frontend

- ✅ `src/pages/AICompanion.tsx` - Updated to use Gemini API (replaced mock implementation)
- ✅ `src/App.tsx` - Added `/ai-companion` route
- ✅ `src/components/Layout.tsx` - Added "AI Companion" to navigation, removed Elfsight widget
- ✅ `src/vite-env.d.ts` - Added `VITE_CHAT_API_URL` type definition

## 🚀 Setup Instructions

### 1. Backend Setup

Navigate to the backend folder:

```bash
cd gemini-chatbot-api
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```bash
# Create .env file with:
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

Start the server:

```bash
npm start
# Or for development:
npm run dev
```

The API will run on `http://localhost:3001`

### 2. Frontend Setup

Create/update `.env` file in the root directory:

```env
VITE_CHAT_API_URL=http://localhost:3001/chat
```

For production, update to your deployed API URL:

```env
VITE_CHAT_API_URL=https://your-api-domain.com/chat
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Add it to `gemini-chatbot-api/.env`

## 🎯 Features

- ✅ Real-time chat with Google Gemini AI
- ✅ Conversation history support (maintains context)
- ✅ Financial assistant personality (focused on budgeting and savings)
- ✅ Loading states and error handling
- ✅ Quick action buttons for common questions
- ✅ Personality settings (Supportive, Strict, Analytical)
- ✅ Clean, modern chat interface

## 📝 Usage

1. **Start the backend server:**

   ```bash
   cd gemini-chatbot-api
   npm start
   ```

2. **Start the frontend:**

   ```bash
   npm run dev
   ```

3. **Access the AI Companion:**

   - Navigate to `/ai-companion` in your app
   - Or click "AI Companion" in the sidebar

4. **Chat with the AI:**
   - Type your question in the input field
   - Click "Send" or press Enter
   - The AI will respond with financial advice

## 🔧 API Endpoints

### POST `/chat`

Send a message to the chatbot.

**Request:**

```json
{
  "message": "How can I save more money?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}
```

**Response:**

```json
{
  "response": "Here are some tips..."
}
```

## 🚢 Deployment

### Backend Deployment

Deploy the `gemini-chatbot-api` folder to:

- Heroku
- Railway
- Render
- Vercel (as serverless functions)
- Any Node.js hosting

Set environment variables:

- `GEMINI_API_KEY`
- `PORT` (optional)
- `NODE_ENV=production`

### Frontend Deployment

Update `.env` or environment variables:

```env
VITE_CHAT_API_URL=https://your-deployed-api.com/chat
```

Then build and deploy:

```bash
npm run build
```

## ⚠️ Important Notes

1. **API Key Security:**

   - Never commit `.env` files to Git
   - Use environment variables in production
   - The API key should only be on the backend

2. **CORS:**

   - CORS is enabled for frontend communication
   - In production, restrict CORS to your frontend domain

3. **Rate Limits:**

   - Google Gemini API has rate limits
   - Monitor usage in Google AI Studio

4. **Cost:**
   - Check Google's pricing for Gemini API
   - Free tier available with limits

## 🐛 Troubleshooting

**API not responding:**

- Check if backend server is running
- Verify `GEMINI_API_KEY` is set correctly
- Check browser console for errors

**CORS errors:**

- Ensure CORS is enabled in `server.js`
- Check `VITE_CHAT_API_URL` is correct

**Messages not appearing:**

- Check browser console for errors
- Verify API endpoint is accessible
- Check network tab in browser DevTools

## 📚 Next Steps

- [ ] Deploy backend to production
- [ ] Update frontend environment variables
- [ ] Test all features
- [ ] Monitor API usage and costs
- [ ] Add rate limiting if needed
- [ ] Add user authentication for chat history

---

**Status:** ✅ Ready to use!
**Last Updated:** $(date)
