# Dynamic Form App

A modern, flexible React application built with TypeScript and a modular component-based architecture. This app allows
dynamic rendering of form fields based on configurable input schemas, making it ideal for building adaptable and
reusable form-driven interfaces.

## Getting Started

### Prerequisites

- Node.js (>= 18 recommended)
- npm (comes with Node)
- dynamic-form backend server must be running

Check your versions:

```bash
node -v
npm -v
```

### Frameworks 

- Tailwind css
- Primereact components
-Vite

### Installation

1. Clone the repository

```bash
git clone https://github.com/luiz-bonfioli/dynamic-form-web.git
cd dynamic-form-web
```

2. Install dependencies

```bash
npm install
```

3. Run the App (Development)

```bash
npm run dev
```

4. Access the App in localhost at http://localhost:5173/

### Execute Unit Tests
Execute the unit tests running the command below:
```shell
npx jest
```
Expected result:
```
PASS  tests/Container.test.tsx
PASS  tests/App.test.tsx
PASS  tests/Sidebar.test.tsx

Test Suites: 3 passed, 3 total
Tests:       3 passed, 3 total
```

### Build for Production

```bash
npm run build
```