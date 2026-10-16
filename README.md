
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

**Software Prerequisites**

Node.js — required to run the development tools and Vite.

npm — used to install project dependencies and run scripts.

Modern web browser — such as Google Chrome, Safari, or Microsoft Edge.

**Functional Requirements**

**FR-01:** Navigation — Users can navigate between Dashboard, Car Management, and About.

**FR-02:** View Cars — Users can view all cars in a table.

**FR-03**: Add Car — Users can add a car after entering valid information.

**FR-04:** Edit Car — Users can update an existing car's information.

**FR-05:** Delete Car — Users can delete a car.

**FR-06:** Car Validation — The application validates required fields, year, and unique car IDs.

**FR-07:** Car Status — Each car has a status: Available, In Use, or Under Maintenance.

**FR-08:**  Dashboard — The dashboard displays total cars, available cars, and cars under maintenance.

**FR-09:** Automatic Updates — Dashboard counts update when cars are added, edited, or deleted.

**FR-10:** About Page — The page displays all three team members' names and student IDs.

**Non-Functional Requirements**

1. Usability: A simple, clear interface with consistent styling.

2. Responsiveness: The interface works on desktop, tablet, and mobile screens.

3. Performance: Pages and interactions respond quickly.

4. Reliability: Adding, editing, or deleting a car does not break other pages.

5. Data Consistency: All pages use the same shared car collection.

6. Maintainability: Components and functions are organized for easy updates.

7. Testability: The application includes automated tests for functionality and integration.

8. Compatibility: The application works in agreed modern browsers.

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
