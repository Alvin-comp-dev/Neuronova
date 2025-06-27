# Neuronova - Scientific Discovery Platform

A cutting-edge full-stack web application for scientific discovery in neurotech and healthcare. The platform combines real-time research curation, community engagement, expert insights, and personalized discovery tools.

## 🚀 Features

### Phase 1 - Core Infrastructure ✅
- **Next.js 15** with TypeScript and App Router
- **Express.js** backend with RESTful API
- **MongoDB** with Mongoose ODM
- **Redux Toolkit** for state management
- **JWT Authentication** with secure password hashing
- **Dark/Light Mode** with system preference detection
- **Responsive Design** with Tailwind CSS
- **Rate Limiting** and security middleware

### Upcoming Phases
- **Phase 2**: Research Feed, User Authentication, Search & Filtering
- **Phase 3**: Community Hub, Expert Insights, Q&A System
- **Phase 4**: API Integrations, Email Notifications, Testing & Deployment

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with SSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **next-themes** - Theme switching
- **Heroicons** - Icon library
- **Framer Motion** - Animations (planned)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript** - Type checking
- **Concurrently** - Run multiple commands

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neuronova
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/neuronova
   REDIS_URL=redis://localhost:6379

   # Authentication
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   JWT_EXPIRES_IN=7d
   NEXTAUTH_SECRET=your-nextauth-secret-here
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # External APIs
   PUBMED_API_KEY=your-pubmed-api-key
   RSS_FEED_URL=https://eutils.ncbi.nlm.nih.gov/entrez/eutils

   # Environment
   NODE_ENV=development
   PORT=3001
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or run separately
   npm run dev:frontend  # Frontend only (port 3000)
   npm run dev:backend   # Backend only (port 3001)
   ```

## 🏗 Project Structure

```
neuronova/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # UI components
│   │   └── common/           # Common components
│   ├── lib/                   # Utility libraries
│   │   ├── store/            # Redux store
│   │   └── utils/            # Utility functions
│   ├── context/              # React contexts
│   ├── hooks/                # Custom hooks
│   └── types/                # TypeScript types
├── server/                    # Backend Express server
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   └── app.ts                # Main server file
├── public/                    # Static files
└── docs/                     # Documentation
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password

### Research
- `GET /api/research` - Get research articles with pagination and filtering
- `GET /api/research/search` - Search research articles
- `GET /api/research/trending` - Get trending research articles
- `GET /api/research/categories` - Get available categories
- `GET /api/research/stats` - Get research statistics
- `GET /api/research/:id` - Get single research article
- `POST /api/research/:id/bookmark` - Bookmark research article
- `POST /api/research` - Create new research article (Admin only)

### Health Check
- `GET /api/health` - Server health status

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb)
- **Secondary**: Purple (#7c3aed)
- **Success**: Green (#059669)
- **Warning**: Yellow (#d97706)
- **Error**: Red (#dc2626)
- **Gray Scale**: Tailwind gray palette

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights (600-800)
- **Body**: Regular weight (400)

### Components
- Custom CSS classes in `globals.css`
- Reusable button styles (`.btn-primary`, `.btn-secondary`, `.btn-outline`)
- Form input styles (`.input-field`)
- Card components (`.card`)

## 🎯 Current Status

### ✅ Phase 1 - Core Infrastructure (COMPLETED)
- Project setup with Next.js 15, TypeScript, Tailwind CSS
- Backend API with Express.js and MongoDB
- User authentication system with JWT
- Responsive design with dark/light mode
- Redux state management setup
- Basic routing and navigation

### ✅ Phase 2 - Core Features (COMPLETED)
- **Research Feed Implementation**
  - Comprehensive research article data model
  - MongoDB schema with advanced indexing
  - Full CRUD operations for research data
  - Advanced search with text indexing
  - Multi-filter capabilities (categories, sources, dates)
  - Sorting options (date, trending, citations, views)
  - Pagination support
  - Research statistics dashboard

- **Backend API Features**  
  - 8 research API endpoints
  - Database seeding with sample data
  - Trending score calculation algorithm
  - View count and engagement tracking
  - Error handling and validation

- **Frontend Features**
  - Research feed page with responsive design
  - Search bar with real-time functionality
  - Filter sidebar for categories and sources
  - Research article cards with metadata
  - Statistics display section
  - Mobile-responsive design

### 🔄 Next: Phase 3 - Advanced Features
- Community features (forums, Q&A)
- Expert profiles and insights
- Personalized discovery algorithms
- Advanced analytics and recommendations

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Database
npm run seed            # Seed database with research data

# Building
npm run build           # Build for production
npm start              # Start production build

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format with Prettier

# Git Hooks
npm run prepare        # Setup Husky hooks
```

## 🚦 Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement frontend components
   - Add backend API endpoints
   - Test functionality
   - Submit pull request

2. **Code Quality**
   - ESLint for code linting
   - Prettier for formatting
   - TypeScript for type checking
   - Pre-commit hooks with Husky

3. **Testing Strategy** (Planned)
   - Unit tests with Jest
   - Integration tests for API endpoints
   - E2E tests with Playwright
   - Component testing with React Testing Library

## 🔐 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** with bcryptjs
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Input Validation** and sanitization
- **Error Handling** without sensitive data exposure

## 🌐 Deployment (Planned)

### Frontend
- **Vercel** for Next.js application
- Automatic deployments from Git
- Environment variable management
- CDN and edge optimization

### Backend
- **Railway/Render** for Express.js API
- Environment-based configuration
- Health check endpoints
- Logging and monitoring

### Database
- **MongoDB Atlas** for production
- Automated backups
- Connection pooling
- Security best practices

## 📚 Documentation

- [API Documentation](./docs/api.md) (Coming Soon)
- [Component Library](./docs/components.md) (Coming Soon)
- [Deployment Guide](./docs/deployment.md) (Coming Soon)
- [Contributing Guidelines](./docs/contributing.md) (Coming Soon)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: [Your Name]
- **Frontend Development**: Next.js, TypeScript, Tailwind CSS
- **Backend Development**: Node.js, Express.js, MongoDB
- **UI/UX Design**: Modern, responsive, accessible design

## 🎯 Roadmap

### Current Phase: Core Infrastructure ✅
- [x] Project setup and configuration
- [x] Authentication system
- [x] Dark/light mode toggle
- [x] Responsive layout components
- [x] Redux state management

### Next Phase: Core Features (In Progress)
- [ ] Research feed with mock data
- [ ] Search and filtering functionality
- [ ] User profile management
- [ ] Email verification system

### Future Phases
- [ ] Community features and forums
- [ ] Expert insights and profiles
- [ ] Real API integrations
- [ ] Advanced search and recommendations
- [ ] Mobile app development

---

**Built with ❤️ for advancing scientific discovery in neurotech and healthcare.**
