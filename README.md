# Car Management System

## Project Overview

The Car Management System is a frontend web application developed using React.js for the SE411 project. It allows users to manage car records and view summary information through a dashboard.

Part 1 focuses on frontend functionality using in-memory data. Backend integration and database functionality are outside the scope of this phase.

## Features

- **Dashboard:** Displays the total number of cars, available cars, and cars under maintenance.
- **Car Management:** Displays car records in a table.
- **Add Cars:** Allows users to add new cars after validating form inputs.
- **Edit Cars:** Allows users to update existing car information.
- **Delete Cars:** Allows users to remove car records.
- **Input Validation:** Checks required fields, validates the year, and prevents duplicate car IDs.
- **Car Status:** Supports Available, In Use, and Under Maintenance.
- **Navigation:** Allows users to navigate between the Dashboard, Car Management, and About pages.
- **About Page:** Displays the team members' names and student IDs.

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

## Application Architecture

The application follows a component-based architecture using React.js. The main `App.jsx` component manages navigation and stores the car collection in shared React state using `useState`.

The application consists of three main pages:

- **Dashboard:** Receives the shared car collection and displays summary information, including total cars, available cars, and cars under maintenance.
- **Car Management:** Displays car records and allows users to add, edit, and delete cars through functions passed down from `App.jsx`.
- **About:** Displays the names and student IDs of the team members.

The car collection is maintained in memory and shared between the relevant components through React state and props. When a car is added, updated, or deleted, the shared state changes and the Dashboard updates automatically.

No backend server or database is used in Part 1.

## Requirements

### Software Prerequisites

- **Node.js:** Required to run the development tools and Vite.
- **npm:** Used to install project dependencies and run scripts.
- **Modern Web Browser:** Google Chrome, Safari, Microsoft Edge, or another compatible browser.

### Functional Requirements

- **FR-01: Navigation** — Users can navigate between Dashboard, Car Management, and About.
- **FR-02: View Cars** — Users can view all cars in a table.
- **FR-03: Add Car** — Users can add a car after entering valid information.
- **FR-04: Edit Car** — Users can update an existing car's information.
- **FR-05: Delete Car** — Users can delete a car.
- **FR-06: Car Validation** — The application validates required fields, year, and unique car IDs.
- **FR-07: Car Status** — Each car has a status: Available, In Use, or Under Maintenance.
- **FR-08: Dashboard** — The Dashboard displays total cars, available cars, and cars under maintenance.
- **FR-09: Automatic Updates** — Dashboard counts update when cars are added, edited, or deleted.
- **FR-10: About Page** — The page displays all three team members' names and student IDs.

### Non-Functional Requirements

1. **Usability:** The application provides a simple, clear interface with consistent styling.
2. **Responsiveness:** The interface works on desktop, tablet, and mobile screens.
3. **Performance:** Pages and interactions respond quickly.
4. **Reliability:** Adding, editing, or deleting a car should not break other pages.
5. **Data Consistency:** All relevant pages use the same shared car collection.
6. **Maintainability:** Components and functions are organized for easy updates.
7. **Testability:** The application includes automated tests for functionality and integration.
8. **Compatibility:** The application works in agreed modern browsers.

## Installation and Setup

### Prerequisites

Install Node.js and npm before running the project.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/221511324/Project_SE411.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Project_SE411
   ```

3. Install the project dependencies:

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

Run ESLint to check code quality:

```bash
npm run lint
```

Build the application for production:

```bash
npm run build
```

The current test suite contains 10 passing tests across 5 test files.

## Data Storage

Car records are stored in React state in memory. The application does not currently use a backend server or database. Car data resets when the page is refreshed or the application state is reinitialized.

## Project Scope

This version covers the frontend phase of the SE411 project. Backend development and database integration are planned for Part 2.

## Repository

[Project_SE411 GitHub Repository](https://github.com/221511324/Project_SE411)

## Team Members

1. Reema Alnamazi — 221511324
2. Roaa Hamdan — 222410471
3. Renad Al Zahrani — 221410628
