# Internship Regulations Assistant - Architecture Documentation

## Overview

An AI-powered chatbot that helps students understand university internship regulations. Users can load regulation documents via URL, then ask questions in natural language.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Lovable Cloud (Supabase Edge Functions) |
| AI | Lovable AI Gateway (GPT-4o-mini) |
| Web Scraping | Firecrawl API |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  UrlInput   │  │  ChatInput  │  │    ChatMessage      │  │
│  │  Component  │  │  Component  │  │     Component       │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘  │
│         │                │                                   │
│         ▼                ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  useChat Hook                        │    │
│  │    (manages messages, loading state, API calls)      │    │
│  └──────────────────────┬──────────────────────────────┘    │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Lovable Cloud Backend                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │  scrape-regulations │    │         chat                │ │
│  │   Edge Function     │    │    Edge Function            │ │
│  │                     │    │                             │ │
│  │  • Receives URL     │    │  • Receives messages +      │ │
│  │  • Calls Firecrawl  │    │    context                  │ │
│  │  • Returns markdown │    │  • Calls Lovable AI Gateway │ │
│  │                     │    │  • Streams response         │ │
│  └──────────┬──────────┘    └──────────────┬──────────────┘ │
└─────────────┼───────────────────────────────┼───────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐    ┌─────────────────────────────┐
│     Firecrawl API       │    │   Lovable AI Gateway        │
│  (Web/PDF Scraping)     │    │      (GPT-4o-mini)          │
└─────────────────────────┘    └─────────────────────────────┘
```

---

## Data Flow

### 1. Loading Regulations

```
User enters URL → UrlInput → scrape-regulations Edge Function → Firecrawl API
                                        ↓
                              Markdown content returned
                                        ↓
                              Stored in React state (context)
```

### 2. Asking Questions

```
User types question → ChatInput → useChat hook → chat Edge Function
                                                        ↓
                                              Lovable AI Gateway
                                                        ↓
                                              Streaming response
                                                        ↓
                                              ChatMessage renders
```

---

## Component Documentation

### Pages

#### `src/pages/Index.tsx`
Main page component that orchestrates the entire chat interface.

| Prop/State | Type | Description |
|------------|------|-------------|
| `context` | `string` | Scraped regulation content |
| `isLoaded` | `boolean` | Whether regulations are loaded |
| `isLoadingUrl` | `boolean` | URL loading state |

**Responsibilities:**
- Manages regulation context state
- Handles URL loading via scrape function
- Renders chat interface components
- Provides clear/reset functionality

---

### Components

#### `src/components/UrlInput.tsx`
URL input field for loading regulation documents.

| Prop | Type | Description |
|------|------|-------------|
| `onLoadUrl` | `(url: string) => Promise<void>` | Callback to load URL |
| `isLoading` | `boolean` | Loading state indicator |
| `isLoaded` | `boolean` | Whether content is loaded |

**Features:**
- URL validation and formatting
- Loading spinner during fetch
- Success state indication

---

#### `src/components/ChatInput.tsx`
Text input for sending chat messages.

| Prop | Type | Description |
|------|------|-------------|
| `onSendMessage` | `(message: string) => void` | Send message callback |
| `isLoading` | `boolean` | Disables input while loading |
| `disabled` | `boolean` | Disables when no context |

**Features:**
- Enter key to send
- Auto-focus on mount
- Disabled states for loading/no context

---

#### `src/components/ChatMessage.tsx`
Renders individual chat messages.

| Prop | Type | Description |
|------|------|-------------|
| `role` | `'user' \| 'assistant'` | Message sender |
| `content` | `string` | Message text |

**Features:**
- Different styling for user/assistant
- Monospace font for assistant responses
- Responsive layout

---

### Hooks

#### `src/hooks/useChat.ts`
Custom hook for managing chat state and API communication.

| Return Value | Type | Description |
|--------------|------|-------------|
| `messages` | `Message[]` | Chat history |
| `isLoading` | `boolean` | API request in progress |
| `sendMessage` | `(input: string) => Promise<void>` | Send a message |
| `clearMessages` | `() => void` | Reset chat history |

**Features:**
- Streaming response handling
- Error management
- Context injection for AI

---

## Edge Functions

### `supabase/functions/scrape-regulations/index.ts`

Scrapes web pages and PDFs using Firecrawl API.

| Input | Output |
|-------|--------|
| `{ url: string }` | `{ success: boolean, data: { markdown: string } }` |

**Features:**
- Auto-prepends `https://` if missing
- PDF detection with extended timeouts
- CORS headers for browser requests

**Environment Variables:**
- `FIRECRAWL_API_KEY` - Firecrawl API authentication

---

### `supabase/functions/chat/index.ts`

Handles AI chat completions via Lovable AI Gateway.

| Input | Output |
|-------|--------|
| `{ messages: Message[], context: string }` | Server-Sent Events stream |

**Features:**
- Specialized system prompt for internship advice
- Streaming responses
- Context injection from scraped regulations

**Environment Variables:**
- `LOVABLE_API_KEY` - Auto-configured by Lovable Cloud

---

## Configuration Files

### `supabase/config.toml`
Edge function configuration.

```toml
[functions.chat]
verify_jwt = false  # Public access

[functions.scrape-regulations]
verify_jwt = false  # Public access
```

### `tailwind.config.ts`
Custom design system with IBM Plex fonts.

### `src/index.css`
Design tokens and CSS variables for theming.

---

## Security Considerations

- **No authentication required** - Public chatbot
- **API keys stored as secrets** - Never exposed to frontend
- **CORS enabled** - For browser access to edge functions
- **No user data persistence** - Stateless design

---

## Future Improvements

- [ ] Add PDF upload support (not just URLs)
- [ ] Persist chat history with authentication
- [ ] Multiple regulation sources
- [ ] Export conversation to PDF
- [ ] Rate limiting for API calls
