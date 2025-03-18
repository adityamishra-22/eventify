---

# Eventify

**Eventify** is a web application built with **Next.js** and **React**, designed to streamline the process of creating, managing, and booking team activities. It allows users to input activity details, location information, and contact details. The app also provides form validation, confirmation modals, and stores activities in-memory for a smooth user experience.

## Features

- **Create Activities**: Easily input details like activity name, category, description, and type.
- **Location Management**: Provide activity-specific location details, including address, city, state, and contact information.
- **Responsive Design**: Built with **Tailwind CSS** for a clean and responsive UI.
- **Validation**: Form validation ensures that all required fields are filled before submission.
- **Confirmation Modal**: Upon successful form submission, users are shown a confirmation modal.
- **In-Memory Database**: Activities are stored in an in-memory database, making it fast and easy to manage activities.

## Tech Stack

- **Frontend**:  
  - **Next.js**: React-based framework for server-side rendering and static site generation.
  - **React**: JavaScript library for building UI components.
  - **Tailwind CSS**: Utility-first CSS framework for styling.
  - **TypeScript**: Provides type safety for the codebase.
  - **React Phone Number Input**: For formatting and validating phone numbers.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adi22mishra/eventify.git
   ```

2. Navigate to the project directory:
   ```bash
   cd eventify
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Features Breakdown

### 1. **Activity Form**
- **Fields**: Activity Name, Category, Description, Type, Location, Minimum Members, and Maximum Members.
- **Validation**: Ensures that all fields are filled and that the minimum number of members is less than the maximum.

### 2. **Location Form**
- **Fields**: Address Line 1, Address Line 2, ZIP Code, City, State, Contact Number, Contact Name.
- **Phone Number Input**: Uses `react-phone-number-input` to validate and format phone numbers.

### 3. **Modals**
- **Confirmation Modal**: After the form submission, a modal appears confirming the activity has been successfully added.

### 4. **Database Simulation**
- Activities are stored in an in-memory array, allowing you to add, retrieve, and manage activities on the go.

## Usage

1. **Add an Activity**: Enter details such as the activity name, category, and number of members.
2. **Provide Location Details**: After submitting the activity, provide location-specific details like address and contact information.
3. **Submit**: Upon successful submission, a modal will appear confirming your entry.

## Contributing

If you want to contribute to the development of **Eventify**, you are welcome to submit issues and pull requests. Here's how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Commit your changes and push to your fork.
5. Create a pull request with a clear description of the changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
