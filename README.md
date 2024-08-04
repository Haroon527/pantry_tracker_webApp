# Pantry Management Application

Welcome to the Pantry Management Application! This app is designed to help you keep track of your pantry items, manage their quantities, and receive recipe suggestions based on the ingredients you have. 

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Keeping track of pantry items can be a daunting task, especially when you have a variety of ingredients with different expiration dates. The Pantry Management Application simplifies this process by allowing you to easily add, edit, and remove items from your pantry. Additionally, it suggests recipes you can make with the ingredients you have on hand, minimizing waste and ensuring you always have meal ideas.

## Features

- **Inventory Management**: Add, edit, and remove pantry items with ease.
- **Quantity Tracking**: Keep track of the quantities of each item in your pantry.
- **Expiration Date Management**: Monitor expiration dates to avoid waste.
- **Recipe Suggestions**: Get recipe suggestions based on the ingredients available in your pantry.
- **Search Functionality**: Easily search for items in your pantry.
- **Smooth User Interface**: Enjoy a sleek and user-friendly interface with smooth scrolling and dark theme.
- **Firebase Integration**: Seamlessly manage and store your pantry data using Firebase Firestore.

## Getting Started

### Prerequisites

To run this application, you will need:

- Node.js
- npm (Node Package Manager)
- A Firebase account with Firestore enabled
- Spoonacular API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pantry-management-app.git
cd pantry-management-app
```

2. Install the dependencies:

```bash
npm install
```

3. Set up Firebase:

   - Create a Firebase project and enable Firestore.
   - Add your Firebase configuration to a `.env` file in the root directory of your project.

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Get a Spoonacular API key:

   - Sign up on Spoonacular and obtain an API key.
   - Add the API key to your `.env` file.

```plaintext
NEXT_PUBLIC_SPOONACULAR_API_KEY=your-spoonacular-api-key
```

5. Run the application:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to view the app.

## Usage

### Adding Items

- Click on the "Add Pantry Item" section.
- Enter the item name, quantity, and expiration date.
- Click "Add Item" to save the item to your pantry.

### Editing Items

- Click the "Edit" button next to the item you want to edit.
- Update the item details and click "Update Item".

### Removing Items

- Click the "Remove" button next to the item you want to remove.

### Searching Items

- Use the search bar to find specific items in your pantry.

### Recipe Suggestions

- View the "Recipe Suggestions" section to see recipes you can make with the items in your pantry.

## Technologies Used

- **Next.js**: React framework for building the user interface.
- **Firebase Firestore**: NoSQL database for storing pantry items.
- **Material-UI**: UI component library for designing the application.
- **Spoonacular API**: API for fetching recipe suggestions based on pantry items.

## Contributing

We welcome contributions to the Pantry Management Application! If you have any suggestions, bug fixes, or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for using the Pantry Management Application! We hope it helps you manage your pantry efficiently and discover new recipes to try. If you have any questions or need assistance, feel free to reach out. Happy cooking!
