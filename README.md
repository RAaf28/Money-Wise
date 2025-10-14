# Money Wise - AI-Powered Financial Management

Money Wise is an innovative digital money management application that combines traditional financial tracking with AI-powered insights and social accountability features.

## 🚀 Features

### Core Features

- **AI Financial Companion** with adaptive personality (Supportive, Strict, Analytical)
- **Emotional Spending Tracker** - Tag transactions with emotions to understand spending patterns
- **Smart Budgeting** with real-time tracking and alerts
- **Goal-Based Savings** with visual progress tracking
- **Social Accountability Circles** - Connect with friends for mutual financial support
- **Financial Health Score** - Comprehensive scoring system (0-100)

### Innovative Features

- **Adaptive AI Personality** - AI learns your behavior and adjusts communication style
- **Emotional Context Analysis** - Understand why you spend money
- **Social Challenges** - Create and participate in financial challenges with friends
- **Future Self Visualization** - See the impact of your financial decisions
- **Micro-Investment Suggestions** - AI-powered investment recommendations

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd money-wise
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard with overview
│   ├── Transactions.tsx # Transaction management
│   ├── Budget.tsx      # Budget tracking and management
│   ├── Goals.tsx       # Financial goals management
│   ├── AICompanion.tsx # AI assistant interface
│   ├── SocialCircles.tsx # Social features
│   └── Settings.tsx    # User settings and preferences
├── store/              # State management
│   └── index.ts        # Zustand store configuration
├── types/               # TypeScript type definitions
│   └── index.ts         # Application types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎯 Key Features Explained

### AI Financial Companion

The AI companion adapts its personality based on your financial behavior:

- **Supportive**: Encouraging and gentle guidance for beginners
- **Strict**: Direct and disciplined approach for overspenders
- **Analytical**: Data-driven insights for strategic planners

### Emotional Spending Tracker

Track not just what you spend, but how you feel when spending:

- Tag transactions with emotions (happy, stressed, bored, sad, excited, anxious)
- AI analyzes patterns to identify emotional spending triggers
- Get personalized suggestions to manage emotional spending

### Social Accountability Circles

- Create small groups (3-5 people) with similar financial goals
- Share progress without revealing exact amounts
- Participate in weekly challenges
- Support each other's financial journey

### Financial Health Score

Comprehensive scoring system that considers:

- Budget adherence
- Savings rate
- Goal progress
- Spending patterns
- Financial discipline

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Money Wise
VITE_API_URL=http://localhost:3001
```

### Customization

- Modify colors in `tailwind.config.js`
- Update default data in `src/store/index.ts`
- Customize AI personality responses in `src/pages/AICompanion.tsx`

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- Progressive Web App (PWA) ready

## 🔒 Privacy & Security

- **End-to-end encryption** for all financial data
- **Local AI processing** for sensitive data
- **No data selling** - your information stays private
- **Granular privacy controls** - choose what data to share

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/)

## 📞 Support

For support, email support@moneywise.app or join our Discord community.

---

**Money Wise** - Making financial management intelligent, social, and emotionally aware. 💰✨
