
# Bitcoin Converter Widget

This is a simple Bitcoin price converter widget built using React, TypeScript, and the CoinGecko API. It allows users to enter an amount in USD and see the equivalent amount in Bitcoin (BTC). The widget displays the current price of Bitcoin, allows inputs up to $100,000,000, and shows the last updated timestamp.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Credits](#credits)

## Features
- Fetches the current Bitcoin price from the CoinGecko API.
- Converts any USD input amount up to $100,000,000 to Bitcoin.
- Displays the last updated timestamp.
- Includes a simple and user-friendly UI.
- Shows a pulsating Bitcoin icon as a loading indicator.

## Technologies Used
- **React** for UI components
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **CoinGecko API** to fetch live Bitcoin prices
- **Create React App** 

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Aladefaruk/bitcoin-converter.git
    ```

2. Navigate into the project directory:
    ```bash
    cd bitcoin-converter
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm start
    ```

5. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

## Usage
- Upon loading, the widget will fetch the current Bitcoin price and display it.
- Enter any amount in USD, and the widget will automatically convert it to BTC.
- The last updated time will also be displayed.


## File Structure
```bash
├── src
│   ├── assets           # Images and logos used
│   ├── components       # Reusable UI components
│   ├── App.tsx          # Main component where the Bitcoin converter is implemented
│   ├── Loader.tsx       # Loader with the pulsating Bitcoin icon
│   ├── Logo.tsx         # Logo component with size variants
│   └── index.tsx        # Entry point of the app
├── public               # Static files
├── package.json         # Project dependencies and scripts
└── README.md            # Documentation
```

## Credits
- [CoinGecko API](https://www.coingecko.com/en/api) for the live Bitcoin price.
- [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) for the framework and language.



