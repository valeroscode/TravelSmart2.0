# TRAVEL SMART

A platform that enables users to find the best places in multiple cities here and abroad while planning their trips.
You can visit Travel Smart at https://travelsmart2-0.onrender.com/

## Technology Used
REACT | JS | FIREBASE

### Table of Contents
1. Technology
   \t1a. Architecture
2. Features Overview
   \t2a. Landing 
   \t2b. Home
   \t2c. Planning
   \t2d. Place
   \t2e. Results
3. Coming soon
   \t3a. Goals
   \t3b. Technology
   \t3c. Features


## Technology
### `a. Architecture`
\t\t This project follows a component-based architecture, consisting of reusable components and eliminating redundancy thanks to the power of React.  
###  `b. Components`
\t\t **Frontend:** The frontend implements the UI using React with client side rendering. These React components communicate with the firestore database and call exported functions from the firebase.js file to read and write to the database. There are a number of plain JS files in this project that provide reusable functions for many components at various stages of the UX. The Miami.js file in particular is an exception to this because it's main purpose is to contain the google maps code which helps to declutter the Travelsmart.jsx file which would have otherwise been thousands of lines longer.
\t\t **Database:** The database comes with it's own backend and is non-relational. The structure is as follows: each user has a document within the database assigned to them, it's accessed when they log in. This document stores non-sensative information like first and last name, a list of favorite places, and a map of maps (or, array of objects) that contains their planned trips, budgets for each trip, and other details. Sensative information like passwords are stored securely in firebase's built in authentication service. 

## Features Overview

### `a. Landing Page`
\t\t This is a landing page that serves to inform users about the platform and convince them to create an account or login to an existing one. 

### `b. Home Page`
\t\t This page is the most feature rich and has the most code acting within it. 



The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
