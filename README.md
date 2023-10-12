# United Way 211

## What is 211?
[211](https://www.211.org/) is a social service run by [United Way](https://www.unitedway.org/) that offers information and referral services to health, human, and social service non-profits. Specifically, we're working with [United Way Greater Knoxville](https://uwgk.org/), who have served 13,000 calls in 2022.

## Repository Overview
This repository offers the following key features:
- [ ] An administrator panel, where 211 staff can easily review information of non-profits and receive notifications of out-of-date info.
- [ ] A super easy way for 211 staff to send non-profits a form to update their info.
- [ ] Revamped information forms that are easier and more engaging to use.
- [ ] Completely redesigned database technology and schema that provides easier data entry and retrieval using [VisionLink](https://www.visionlink.org/211/).
- [ ] A super easy way for 211 staff to enter info into the database once non-profits fill out the info forms.


Empty boxes denote work-in-progress features.

## Getting Started

### Prerequisites

<!-- TODO: Add more prereqs as necessary -->
- [Node.js (v18)](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [Visual Studio Code](https://code.visualstudio.com/)

<!-- Add or modify steps here for getting started as a developer -->

### 1. Clone the repository

```bash
git clone https://github.com/hack4impact-utk/uw-211
```

### 2. Open `UW-211` in VS Code and accept recommended extensions

### 3. Install dependencies

```bash
pnpm install
```

### 4. Set the environment variables

Either ask a project lead for the `.env.local` file or create your own. The `.env.local` file should be in the root directory of the project. You need to have the following variables set:

<!-- Add any other environment variables your project requires to this table. -->

| Variable Name | Description              |
| ------------- | ------------------------ |
| MONGODB_URI   | URI for MongoDB database |

### 5. Run the development server

```bash
pnpm dev
```

## Building for Production

Make sure you have finished all the setup steps in the [Getting Started](#getting-started) section and you can run the development server before building for production.

### 1. Build the project

```bash
pnpm build
```

### 2. Run the project in production mode

```bash
pnpm start
```

## Testing

### Running tests

```bash
pnpm test
```

## Code/PR Workflow

<!-- TODO: Add any project specific workflows in here -->

- Create a new branch in the format `[GITHUB USERNAME]/[SHORT FEATURE DESCRIPTION]-[ISSUE NUMBER]`
  - For example: `hack4impact-utk/add-login-page-1`
- Make changes on your branch, ensuring you adhere to our style guide and best practices (add links here when ready)
- Commit your changes and push them to GitHub
- Create a pull request from your branch to `main`
  - Ensure you diligently follow the pull request template

## Project Structure

- `src/app`: Contains pages for the application using the [NextJS App Router](https://nextjs.org/docs/app)
- `src/components`: Contains React components used across the project
  - There should be a folder for each component with an `index.ts` file that exports the component
- `src/server/actions`: Contains functions that interact with the database through the Mongoose ODM
- `src/server/models`: Contains Mongoose models for the database
- `src/services`: Contains functionality for interacting with external data sources (e.g. APIs)
- `src/types`: Contains TypeScript types and interfaces used across the project
- `src/utils`: Contains utility functions used across the project

## About Hack4Impact
Hack4Impact is a student-led organization that builds software solutions for local non-profits (read more [here](https://utk.hack4impact.org/)).

## License
This repository is licensed under the "The Unlicense" license (read more [here](https://github.com/hack4impact-utk/uw-211/blob/main/LICENSE)).
