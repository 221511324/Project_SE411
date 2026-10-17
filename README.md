# CarTrack — Company Car Management System

## Project Overview

CarTrack is an academic frontend application developed for SE411 — Part 1.
It helps users manage company car records and monitor fleet availability
through an interactive Dashboard.

The application uses React and stores data in memory. Backend development
and database integration are outside the scope of this phase.

## Features

- **Dashboard:** Displays total cars, available cars, and cars under maintenance.
- **Card and Table Views:** Allows users to switch between two display formats.
- **Add Cars:** Creates new records after validating user input.
- **Edit Cars:** Updates existing records while keeping their IDs unchanged.
- **Cancel Editing:** Discards unsaved changes.
- **Delete Cars:** Removes a selected record after confirmation.
- **Validation:** Checks required fields, valid years, and unique car IDs.
- **Search:** Finds cars by ID, brand, model, or plate number.
- **Filters:** Filters cars by brand and status, with a reset option.
- **Car Images:** Displays configured photos or a placeholder.
- **Navigation:** Connects Dashboard, Car Management, and About.
- **About:** Presents project information and team details.
- **Responsive Styling:** Adapts layouts to different screen widths.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Components and state management |
| JavaScript and JSX | Application logic and component markup |
| HTML | Entry page for the React application |
| CSS | Styling, layouts, and visual effects |
| Vite | Development server and production build |
| Node.js and npm | Development tools and dependency management |
| Vitest | Automated test execution |
| React Testing Library | Component and user-interaction testing |
| jsdom | Simulated browser environment for tests |
| ESLint | Static code analysis |
| Git and GitHub | Version control and collaboration |

## Installation and Setup

### Prerequisites

- Node.js and npm
- Git
- A modern web browser

The project was developed using Node.js 24.1.0 and npm 11.3.0.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/221511324/Project_SE411.git
   ```

2. Open the project directory:

   ```bash
   cd Project_SE411
   ```

3. Install dependencies using the committed lockfile:

   ```bash
   npm ci
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the Local URL displayed in the terminal.

Keep the terminal running while using the application.
Use the server URL rather than opening index.html directly.

### Production Build and Preview

Create a production build:

```bash
npm run build
```

The generated files are saved in the dist directory.

Preview the build locally:

```bash
npm run preview
```

Open the URL printed in the terminal. This previews the build locally;
it does not publish the application online.

## Using CarTrack

### Dashboard

Open Dashboard to view:

- Total cars
- Available cars
- Cars under maintenance

Counts are calculated from the shared car collection.

### Add a Car

1. Open Car Management.
2. Enter the ID, brand, model, year, plate number, color, and status.
3. Select Add Car.

A valid record is added to the collection, and the form clears.
Active filters may hide a newly added car; select Reset to see all records.

### Edit a Car

1. Select Edit on the desired car.
2. Update its details in the form.
3. Select Save Changes, or Cancel to discard the changes.

The ID cannot be edited. Deletion is disabled for the car currently
being edited.

### Delete a Car

1. Select Delete on the desired car.
2. Confirm the action to remove the record.

Cancelling the confirmation preserves the record.

### Search, Filter, and Change View

- Search by ID, brand, model, or plate number.
- Select a brand or status to narrow the results.
- Combine search and filters.
- Select Reset to clear all filters.
- Select Cards or Table to change the display format.

## Application Architecture

CarTrack follows a component-based React architecture.

App.jsx acts as the single source of truth for saved car records.
It stores the car collection and selected page using React state.
CRUD functions update the collection and are passed to child
components through props.

| Component | Responsibility |
|---|---|
| App.jsx | Shared car state, CRUD functions, and navigation |
| Dashboard.jsx | Fleet statistics and banner |
| CarManagement.jsx | Cards/table, search, filters, and edit selection |
| CarForm.jsx | Form inputs, validation, and submission |
| About.jsx | Project description and team information |

### Data Flow

1. App.jsx passes the car collection to relevant components.
2. Users interact with CarManagement.jsx and CarForm.jsx.
3. Callback functions request updates to the shared collection.
4. React renders the updated records.
5. Dashboard counts reflect the current collection when displayed.

Temporary state, including filters, display mode, and form inputs,
is managed within the relevant components.

## Project Structure

```text
Project_SE411/
├── public/
│   └── images/
├── src/
│   ├── assets/
│   ├── test/
│   │   └── setup.js
│   ├── About.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── CarForm.jsx
│   ├── CarManagement.jsx
│   ├── CarManagement.test.jsx
│   ├── CarWorkflow.test.jsx
│   ├── Dashboard.jsx
│   ├── Navigation.test.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
└── vitest.config.js
```

## Data Model

Cars are stored as JavaScript objects in an array.

```js
{
  id: 'CAR-001',
  brand: 'Toyota',
  model: 'Camry',
  year: 2024,
  plateNumber: 'ABC 1234',
  color: 'White',
  status: 'Available'
}
```

| Field | Type | Description |
|---|---|---|
| id | String | Unique car identifier |
| brand | String | Vehicle manufacturer |
| model | String | Vehicle model |
| year | Number | Model year |
| plateNumber | String | Registration plate |
| color | String | Vehicle color |
| status | String | Availability or maintenance status |

Supported statuses:

- Available
- In Use
- Under Maintenance

### Validation Rules

- All car fields are required.
- Text fields cannot contain only whitespace.
- Years must be whole numbers from 1886 through the next calendar year.
- Car IDs must be unique, ignoring letter case and surrounding spaces.
- Newly entered IDs and plate numbers are converted to uppercase.
- Existing IDs remain unchanged during editing.

### Car Images

Image paths are configured separately in the carPhotos mapping inside
CarManagement.jsx. Keys use lowercase brand and model names.

Files stored in public/images are referenced using paths such as:

```text
/images/car-photo.jpg
```

The public folder name is not included in the browser URL.

Cars without a configured photo, or whose photo fails to load, display
a placeholder. Cars with the same brand and model share the configured photo.

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Navigate between Dashboard, Car Management, and About. |
| FR-02 | Display cars in card and table views. |
| FR-03 | Add cars with all required information. |
| FR-04 | Edit car details while preserving the ID, or cancel editing. |
| FR-05 | Delete a selected car after confirmation. |
| FR-06 | Validate required fields and model years. |
| FR-07 | Prevent duplicate IDs regardless of letter case. |
| FR-08 | Support Available, In Use, and Under Maintenance statuses. |
| FR-09 | Search by ID, brand, model, or plate number. |
| FR-10 | Combine brand/status filters with search and reset them. |
| FR-11 | Display configured car photos with an image fallback. |
| FR-12 | Display total, available, and maintenance counts. |
| FR-13 | Keep records and Dashboard statistics consistent through shared state. |
| FR-14 | Display project information and team names and student IDs. |
| FR-15 | Display messages for empty collections and unmatched searches. |

## Non-Functional Requirements

These are quality goals to assess through testing:

- **Usability:** Clear labels, navigation, and validation feedback.
- **Responsiveness:** Layouts adapt to different screen widths.
- **Performance:** Prompt interaction with the sample dataset.
- **Reliability:** Operations affect only intended records.
- **Data consistency:** Relevant pages use the same shared collection.
- **Maintainability:** Reusable components and clear responsibilities.
- **Testability:** Automated tests supported by manual checks.
- **Compatibility:** Correct behavior in the browsers selected for testing.
- **Accessibility:** Labeled controls, keyboard access, visible focus,
  appropriate image alternatives, and text alongside status colors.

## Testing and Verification

Run all automated tests:

```bash
npx vitest run
```

Run ESLint:

```bash
npm run lint
```

Build the application:

```bash
npm run build
```

### Latest Results

The following results were recorded on 17 October 2026:

| Check | Result |
|---|---|
| CarManagement.test.jsx | 7 tests passed |
| CarWorkflow.test.jsx | 6 tests passed |
| Navigation.test.jsx | 5 tests passed |
| Total automated tests | 18 passed across 3 files |
| ESLint | Passed without reported issues |
| Production build | Passed |

### Automated Test Coverage

Tests verify:

- Default card view and switching between cards and a table.
- Car details displayed in the table.
- Case-insensitive plate-number search.
- Combined filters and resetting filters.
- Missing-image and failed-image placeholders.
- Empty collection messages.
- Adding cars and clearing the form.
- Rejecting duplicate IDs.
- Editing selected records and cancelling edits.
- Confirming and cancelling deletion.
- Navigation and the selected-page indicator.
- Initial Dashboard counts.
- Dashboard updates after adding, editing, and deleting cars.
- Preservation of saved changes during navigation.

Tests run in jsdom. Scrolling and confirmation dialogs are mocked
where needed. Image-error tests simulate failures and do not verify
that every image file loads in a real browser.

### Manual Verification

Manual checks during development covered CRUD operations,
required fields, whitespace-only input, invalid years, duplicate IDs,
cancellation, and empty collections.

Actual image loading, responsive appearance, keyboard navigation,
and browser compatibility should also be checked in the final version.

## Data Storage and Limitations

Part 1 uses in-memory React state without a backend or database.

- Refreshing the page restores the initial sample collection.
- Saved changes remain available while navigating between pages.
- Leaving Car Management clears unsaved form input.
- Data is not shared across users or browser sessions.
- There is no authentication or role-based access.
- Photos are configured in source code; there is no upload interface.
- Large-dataset performance has not been established.

## AI Assistance

OpenAI's assistant in Codex supported:

- Planning and requirements drafting.
- React component and application-logic generation.
- Interface design and responsive styling.
- Debugging and configuration guidance.
- Automated test generation.
- Project documentation.

The Dashboard banner was generated using an AI image-generation tool.
Other car photos were supplied separately by the team.

Team members applied the changes, ran verification commands,
and reviewed results. The team remains responsible for the submitted
application and the accuracy of its documentation.

## Future Work

Part 2 will focus on manually developing the backend and connecting
it to the frontend.

Planned work includes:

- Persistent database storage.
- API endpoints for CRUD operations.
- Server-side validation and error handling.

Possible additional enhancements include authentication, photo uploads,
maintenance history, sorting, pagination, data export, and expanded testing.

## Team Members

| Name | Student ID |
|---|---|
| Roaa Hamdan | 222410471 |
| Reema Alnamazi | 221511324 |
| Renad Al Zahrani | 221410628 |

## Repository

[CarTrack project repository](https://github.com/221511324/Project_SE411)