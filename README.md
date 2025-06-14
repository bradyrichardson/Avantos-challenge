# Form Blueprint Visualizer

This is my submission for the Avantos-challenge, it is a React/Typescript/Vite project that uses the provided API (https://github.com/mosaic-avantos/frontendchallengeserver) to get data which is then visualized in a manner similar to the project docs.

## Features

- Interactive node-based form visualization
- Form prefill editing capabilities
- Data mapping between forms
- Real-time form relationship updates
- Canvas-based edge visualization
- Context-based state management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

## Getting Started

1. Clone the repository:
```bash
git clone [git@github.com:bradyrichardson/Avantos-challenge.git]
cd [Avantos-challenge]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Clone the server repo
```bash
git clone [git@github.com:mosaic-avantos/frontendchallengeserver.git]
```

5. Run the server
```bash
cd [frontendchallengeserver] && npm start
```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # react components
│   ├── helpers/       # utility functions and context
│   └── ...           # main components
├── i_forms/          # typeScript interfaces
├── tests/            # test files
└── App.tsx          # root component
```

## Key Patterns and Architecture

### 1. State Management
- Uses React Context for global state management
- Implements a form context system for managing form relationships
- Follows a unidirectional data flow pattern

### 2. Component Architecture
- Modular component design with clear separation of concerns
- Reusable components for form editing and visualization
- Canvas-based visualization for form relationships

### 3. Type Safety
- Comprehensive TypeScript implementation
- Strong typing for form data structures
- Interface-driven development

## Extending the Application

### Adding New Data Sources

1. While the current solution works for the challenge and for the sample data sources provided by the nodes in the API response, you can edit the data source interface in `i_forms/`:
```typescript
interface NewDataSource {
  id: string;
  name: string;
  // add more required fields
}
```

2. If you want more control over what the components use in the context, you can edit the form context itself:
```typescript
interface BlueprintContext {
  [key: string]: {
    key: string;
    form: Form;
    node: FormNode;
    prefill: boolean;
    // add new data source properties or other properties
  }
}
```

It should already map the nodes without issue.

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

The project uses Vitest for testing with React Testing Library for component testing.

## Key Patterns to Pay Attention To

1. **Context Management**
   - The application uses a context-based state management system
   - Pay attention to how form data is propagated through the context
   - Understand the relationship between global and local state

2. **Component Communication**
   - Components communicate through props and context
   - Event handling follows a consistent pattern
   - State updates are managed through setter functions

3. **Data Flow**
   - Unidirectional data flow from parent to child components
   - State updates trigger re-renders in a predictable manner
   - API calls are centralized and managed through axios

4. **Type Safety**
   - TypeScript interfaces define the shape of data
   - Props are strictly typed
   - Context values are type-checked
