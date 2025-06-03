# Demo App

### Key Pages & Functionality
- **Terms & Conditions** - Multi-language support (Swedish/English)
- **Product Pricelist** - Responsive table with CRUD operations
- **Authentication** - Login/Register with form validation (only frontend)

## 🛠 Technology Stack

### Frontend
- **React** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Vanilla CSS** - Custom design system with CSS variables
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Fastify** - Fast and low overhead web framework
- **Sequelize** - Promise-based ORM for PostgreSQL
- **PostgreSQL** - Robust relational database with connection string support
- **bcrypt** - Password hashing
- **JWT** - JSON Web Tokens for authentication
- **Joi** - Schema validation
- **Pino** - High-performance logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

\`\`\`
demo/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state stores
│   │   ├── services/       # API client and services
│   │   ├── index.css       # Vanilla CSS with design system
│   │   ├── main.jsx        # Application entry point
│   │   └── ...
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Fastify backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   ├── database/       # Database connection
│   │   └── ...
│   └── package.json
└── README.md
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/pawandai/demo.git
   cd ./demo
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm run install:all
   \`\`\`

3. **Set up environment variables**
   
   Create `.env` file in the backend directory based on `.env.example`

4. **Start the development servers**
   \`\`\`bash
   # Start both frontend and backend
   npm run dev

   # Or start individually
   npm run dev:frontend  # Frontend on http://localhost:3000
   npm run dev:backend   # Backend on http://localhost:8000
   \`\`\`

### Deployment Options
- **Vercel** - Recommended for frontend deployment
- **Railway/Heroku** - For full-stack deployment with PostgreSQL
- **Docker** - Containerized deployment
- **VPS** - Self-hosted deployment
