# FE-2024-12-i - ESA Task Two 

A modern Next.js application with Apollo Client integration and comprehensive form handling.

## Tech Stack

- `Frontend Framework`
  - Next.js 15.1.6
  - React ^19.0.0
  - TypeScript ^5

- `Data Management`
  - Apollo Client ^3.12.8
  - GraphQL ^16.10.0

- `Form Handling`
  - React Hook Form ^7.54.2
  - Zod Validation ^3.24.1
  - React Phone Number Input ^3.4.11

- `Styling`
  - TailwindCSS ^3.4.1
  - CLSX ^2.1.1
  - Tailwind Merge ^3.0.1

- `Testing`
  - Vitest ^3.0.5
  - Testing Library
    - React ^16.2.0
    - Jest DOM ^6.6.3
    - User Event ^14.6.1

## Project Structure

- `src/`
  - `app/`
    - `(protected)/`
      - `companies/`
      - `company/`
      - `layout.tsx`
      - `page.tsx`
    
  - `components/`
    - `form/`          # Form-specific components
    - `form-steps/`    # Multi-step form components
    - `reusables/`     # Shared components
    - `ui/`           # UI primitives
    
  - `icons/`
    - Social media icons (Facebook, LinkedIn)
    
  - `lib/`            # Utility functions
  
  - `providers/`
    - `ApolloProvider.tsx`
    
  - `tests/`          # Test files
  
  - `theme/`
    - `globals.css`
    - `phone-input.css`
    
  - `types/`          # TypeScript definitions
  
  - `utils/`
    - `classNames.ts`
    - `storage.ts`
    - `middleware.ts`

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- PNPM package manager

### Installation

```bash
pnpm install
```

### Development

```bash
# Start development server with Turbopack
pnpm dev

# Run linter
pnpm lint

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Generate test coverage
pnpm test:coverage

# Watch mode for tests
pnpm test:watch
```

### Build

```bash
pnpm build
pnpm start
```

## Features

- Protected routes with authentication
- GraphQL integration via Apollo Client
- Form handling with validation
- Phone number input with formatting
- Social media integration
- Responsive UI components
- Comprehensive test coverage

## Testing

The project uses Vitest with React Testing Library for testing. Test files are colocated with their components using the `.test.tsx` extension.

## Code Quality

- ESLint with Next.js configuration
- TypeScript for type safety
- Prettier for code formatting
- Vitest for unit and integration testing