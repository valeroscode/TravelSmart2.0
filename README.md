# TRAVEL SMART

A platform that enables users to find the best places in multiple cities here and abroad while planning their trips. This READ.ME dives into Travel Smart from a technical perspective. It also summerizes on Travel Smart's major features but does not account for every single detail.
To get all the details, please visit Travel Smart at https://travelsmart2-0.onrender.com/

## Technology Used
REACT | JS | FIREBASE

### Table of Contents
1. Technology
   a. Architecture
2. Features Overview
   2a. Landing 
   2b. Home/Dashboard 
   2c. Planning
   2d. Place
   2e. Results
3. Coming soon
   3a. Goals
   3b. Technology

## Technology
### `1. Architecture`
This project follows a component-based architecture, consisting of reusable components and eliminating redundancy thanks to the power of React.  

###  `Components`
**1a. Frontend:** The frontend implements the UI using React with client side rendering. These React components communicate with the firestore database and call exported functions from the firebase.js file to read and write to the database. There are a number of plain JS files in this project that provide reusable functions for many components at various stages of the UX. The Miami.js file in particular is an exception to this because it's main purpose is to contain the google maps code which helps to declutter the Travelsmart.jsx file which would have otherwise been thousands of lines longer.
**1b. Database:** The database comes with it's own backend and is non-relational. The structure is as follows: each user has a document within the database assigned to them, it's accessed when they log in. This document stores non-sensative information like first and last name, a list of favorite places, and a map of maps (or, array of objects) that contains their planned trips, budgets for each trip, and other details. Sensative information like passwords are stored securely in firebase's built in authentication service. 

### `2. Features Overview`
**2a. Landing:** The landing page for Travel Smart closely follows the spotify design landing page design and exists to inform prospective users about the platform. 

**2b. Home/Dashboard:** The home page is like a dashboard for users. It has two parts: the main section and the map section. The main section contains a list of all currently avaliable cities on the platform, a list of all of the users trips, and a list of all places within the selected city (the default city is Miami). From here users can go into other pages of the website were they can plan their trip or learn more about a specific venue or place. There's also a search bar avaliable that lets users search more specific kinds of places within a selected city (such as Mexican restaurants in Miami or Upscale places in Chicago or techno clubs in Barcelona). By clicking the Map button that's fixed to the bottom of the screen, users can access a google map with pins on each place within a city. From here they can change the city and get a bird's eye view thanks to google maps. They can also use filters to consolidate the pins on screen. Say for example, a user wants to find the coffee shops that are the most affordable but also highly rated, they would choose the "start your day", "inexpensive", and "best" filters. If the user clicks on a pin or one a place on the left panel, they get a card pop-up on the right side of the screen that gives them more information about the selected place. This quick information includes phone number, address, opening times, and more. Within both of these sections users can add places to a trip and add places to their list of favorites. This is accomplished with functions that are exported from the getPlaceInfo.mjs file and these functions are used throughout other pages on the platform. 

**Home/Dashboard Page Technology Overview:** As mentioned, much of the code operating on the home page comes from the Miami.mjs file and provides the functionality for the map section. The google maps api is connected via a script tag in the HTML and a google maps instance is initialized in the Miami.mjs file. This file also contains the filtering logic for the map and uses other google apis to give users place information. The Travelsmart.jsx file contains another large majority of the code operating on this page. This file also calls a function within the firebase.js file that gets user data from the database. Code within the Travelsmart.jsx file uses this data to dynamically populate the frontend and it passes this data to the homeheader and trips components. The homeheader component is where the header lives which contains the seachbar logout button, create trip button, and displays the users name. The trips component can be found around the middle of the page and it's purpose is to display the users trips, amount of time from the current day to the trip, access to a seperate page to edit the trip, and access to delete the trip. The homeheader and trips components use data passed down from the Travelsmart component simply to avoid repetition within the codebase and cut down the costs of reading the database.   

**2c. Planning Page:** This page enables users to plan their trips, add places to the trip, and set budgets. All of the code comes from the planner component. 

**Planning Page Technology Overview:** Again, functions from the firebase.js file are exported to read and write to the database. Users can add new places to their trip along with an optional budget and time for the place. By clicking the add a place button in the list of dates a panel comes up on the right of the page and favorite places within that city will be shown. 

**2d. Place Page:** Using a function from the getPlaceInfo.mjs file the user is redirected to a seperate page whenever they click a 'learn more' button. Place information is stored in local storage, a seperate function is called to generate a list of similar places the user might like, and then the user is redirected. Using the information on local and session storage the page is populated and the google places api is called to get reviews on the place. From here users can navigate to one of the similar places under 'Suggestions', look at reviews, post a review, read information about the place, add the place to a trip within it's city, add the place to their favorites, or using the navigation bar do a number of other things. These most noteably include navigating to any other place within the city via the search bar and by hovering over (or touching on mobile) the filters button they can get a dropdown of all categories of places, types of places, and areas of places within the city. They can freely check off any of these options and then click search to be redirected to the results page. The code for this navigation bar exists in the placehome.jsx file and the code for the page itself lives in the placecontent.jsx file. 

**2e. Results Page:** The results page exists to show users a list of their search results split into 3 difference sections. The highest rated places, the most budget friendly places, and finally a list of all places that match their search results. 

**Results Page Technology Overview:** The results page's code lives in the filteredresults.jsx file and uses filtering logic along with an instance of the google places API to deliver important information to the user. 

### 3. Coming Soon
**3a. Goals:** Travel Smart currently exists as a big project but will eventually become a platform that is hopefully very useful to real users. While real users are able to make an account and plan their trips, Travel Smart does not have enough information on enough cities to really scale. So, the goal is to scale the data so that it can be useful to a wider population, along with other features like allowing users to email their itineraries. 

**3b. Technology:** In order to scale the data quickly, adding new places needs to be automated. This will be achieved through code that will get place information from google maps, dynamically generate an object with key value pairs containing place data which will then be pushed into the database. Scale in data might also mean scale in cost, particularly when using firebase services. For this reason Travel Smart will move to a Java backend using the spring boot framework and eventually migrate to a postgres database. 

##Thank you
Thank you for taking the time to learn about Travel Smart. If you'd like to learn more please visit Travel Smart at https://travelsmart2-0.onrender.com/ I'd love to hear your feedback or suggestions for Travel Smart. Please feel free to connect with me on LinkedIn:

https://www.linkedin.com/in/alex-valero-3416b52a1/


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
