# J.A.R.V.I.S. Web Application

## Overview

This is a J.A.R.V.I.S.-inspired AI assistant web application modeled after Tony Stark's AI from the Iron Man/MCU films. The application provides an interactive chat interface with a futuristic, holographic aesthetic featuring real-time Tony Stark activity tracking, biometric scanning displays, and conversational AI that understands Iron Man/MCU references.

**Core Purpose**: A surprise gift application that allows users to interact with their own "Jarvis" - complete with MCU knowledge, Iron Man references, and a cinematic holographic UI that captures the essence of Tony Stark's workshop interfaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for development and production builds.

**UI Component Library**: Radix UI primitives with shadcn/ui component system styled using Tailwind CSS. The design follows a "new-york" style variant with custom theming for the holographic/futuristic aesthetic.

**State Management**: 
- TanStack Query (React Query) for server state management and API data fetching
- Local React state for UI interactions and real-time features
- Query client configured with custom fetch functions for API communication

**Routing**: Wouter for lightweight client-side routing (single-page application with main Jarvis interface).

**Styling Approach**:
- Tailwind CSS with extensive custom configuration for the Iron Man-inspired theme
- Custom fonts: Orbitron/Rajdhani for headings, Inter for body text, JetBrains Mono for technical readouts
- Dark/light theme support with CSS variables and class-based theme switching
- Holographic effects using backdrop blur, translucent backgrounds, and cyan/blue accent colors
- Design guidelines emphasize high contrast, luminous elements, and reactive animations

**Key UI Features**:
- Typewriter text effect for AI responses
- Animated particle background for depth
- Waveform visualization orb for active/speaking states
- Voice input support using Web Speech API
- Real-time biometric scan displays (Stark Scan)
- Interactive globe visualization for Tony Tracker using react-globe.gl
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful endpoints with JSON request/response format:
- `/api/chat` - POST endpoint for conversational AI interactions
- `/api/weather` - GET endpoint for weather data (defaults to Malibu, CA)
- `/api/tony-activity` - GET endpoint for random Tony Stark activity/location
- `/api/stark-scan` - GET endpoint for Tony's real-time biometric data
- `/api/quotes/search?q=<query>` - Search iconic quotes by text, film, context, or character
- `/api/quotes/film?name=<filmName>` - Get all quotes from a specific film
- `/api/quotes/context?name=<contextName>` - Get quotes by thematic context
- `/api/quotes/films` - List all films with available quotes
- `/api/quotes/contexts` - List all available quote contexts

**Development vs Production**:
- Development: Vite dev server middleware integrated with Express for HMR and fast refresh
- Production: Static file serving from pre-built `dist/public` directory

**AI Integration**: Cerebras API for conversational AI with custom system prompts that establish J.A.R.V.I.S. personality, British tone, MCU knowledge, and contextual awareness of Tony's current activity.

**Conversation Management**:
- In-memory storage implementation (MemStorage class) for conversation history
- Conversation history limited to last 10 messages for context window management
- Schema supports future database migration with Drizzle ORM

**Context Enhancement**:
- Web search integration via Tavily API for accurate MCU quotes and references
- Comprehensive local quote database with 50+ iconic Jarvis and Tony Stark quotes
- Stark Scan biometric data generation for contextual responses with climate-aware adjustments
- Weather data integration for environmental context
- Climate-aware biometric system: body temperature, vitals, and outfit adapt to geography (hot climates = elevated temps/reduced O2, cold climates = lower temps/thermal stress)
- Quote system allows natural integration into responses for authentic character dialogue

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Maps and arrays (MemStorage class).

**Database Schema** (Drizzle ORM with PostgreSQL support):
- `users` table: id, username, password (authentication ready)
- `conversations` table: id, role (user/assistant), content, timestamp

**Database Configuration**: 
- Neon Database serverless PostgreSQL configured via DATABASE_URL environment variable
- Drizzle Kit for schema management and migrations
- Connection pooling via `@neondatabase/serverless`

**Migration Path**: Code is structured with storage interface (IStorage) allowing seamless transition from in-memory to PostgreSQL without changing business logic.

### Authentication and Authorization

**Current State**: Authentication schema defined but not actively enforced. User table exists with username/password fields.

**Session Management**: connect-pg-simple configured for PostgreSQL-backed session storage (ready for implementation).

**Future Implementation**: Session-based authentication using Express sessions with PostgreSQL storage backend.

### External Dependencies

**AI & ML Services**:
- **Cerebras API**: Primary LLM for conversational AI (requires CEREBRAS_API_KEY)
  - Configured with custom J.A.R.V.I.S. system prompt
  - Supports conversation history and contextual awareness
  - Processes user messages with MCU knowledge integration

- **Tavily Search API**: Web search for MCU quotes, movie references, and fact-checking (requires TAVILY_API_KEY)
  - Activated for queries about quotes, movies, scenes
  - Provides search context to enhance AI responses

**Weather Data**:
- **OpenWeather API**: Current weather conditions for Malibu, CA (requires OPENWEATHER_API_KEY)
  - Fallback to mock data if API key unavailable
  - Imperial units (Fahrenheit)

**Database**:
- **Neon Database**: Serverless PostgreSQL (requires DATABASE_URL)
  - Currently optional - app uses in-memory storage as fallback
  - Required for production conversation persistence

**Mapping & Visualization**:
- **react-globe.gl**: WebGL-based 3D globe for Tony Tracker feature
  - Client-side only, no API key required
  - Fallback to 2D map display if WebGL unsupported

**Design & UI Libraries**:
- **shadcn/ui + Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library for holographic effects
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling

**Fonts**:
- **Google Fonts**: Orbitron, Rajdhani, Inter, JetBrains Mono
  - Loaded via CDN in HTML

**Build & Development Tools**:
- **Vite**: Frontend build tool and dev server
- **esbuild**: Backend bundling for production
- **TypeScript**: Type safety across frontend and backend
- **Drizzle ORM**: Type-safe database queries and migrations

**Environment Variables Required**:
- `CEREBRAS_API_KEY` - Required for AI chat functionality
- `DATABASE_URL` - Optional (uses in-memory storage as fallback)
- `OPENWEATHER_API_KEY` - Optional (uses mock weather data as fallback)
- `TAVILY_API_KEY` - Optional (disables web search for MCU references as fallback)
- `NODE_ENV` - Set to "production" or "development"