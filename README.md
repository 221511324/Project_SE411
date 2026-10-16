
# Car Management System
## Project Overview
The Car Management System is a frontend web application developed using React.js. It allows users to manage car records and view summary information through a dashboard.

This project is developed for SE411. Part 1 focuses on frontend functionality using in-memory data. Backend integration and database functionality are outside the scope of this phase.

## Features

- **Dashboard:** Displays the total number of cars, available cars, and cars under maintenance.
- **Car Management:** Displays car records in a table.
- **Add Cars:** Adds new cars after validating the form inputs.
- **Edit Cars:** Updates existing car information.
- **Delete Cars:** Removes car records.
- **Input Validation:** Checks required fields, validates the year, and prevents duplicate car IDs.
- **Car Status:** Supports Available, In Use, and Under Maintenance.
- **Navigation:** Allows users to navigate between the Dashboard, Car Management, and About pages.

## Technologies Used

- React.js
- JavaScript
- HTML
- CSS
- Vite
- Vitest
- React Testing Library
- ESLint
- Git and GitHub

## Requirements

- Node.js
- npm

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/221511324/Project_SE411.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Project_SE411
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in the terminal.

## Testing

Run the automated tests:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Build the application for production:

```bash
npm run build
```

The current test suite contains 10 passing tests across 5 test files.

## Data Storage

Car records are stored in React state in memory. The application does not currently use a backend server or database. Data resets when the application state is reinitialized or the page is refreshed.

## Project Scope

This version covers the frontend phase of the project. Backend and database integration are planned for a later phase.

## Repository

[GitHub Repository](https://github.com/221511324/Project_SE411.git)

## Team Members
1. Reema Alnamazi — 221511324
2. Roaa Hamdan — 222410471
3. Renad Al Zahrani — 221410628
