# What is this?
This project is a mix of different tools for exploring adventurelands data.js and other data related to adventureland.
The intention for it is for it to live on a public URL, but for now you can run it locally. 

It currently contains
- A WIP gear planner
- A market data renderer (what merchant is selling what?)
- A list of monsters

# Contributing
We welcome any enhancements and additions to the different tools as well as new tools. Simply make a PR with a solid description and we will look it over and accept the changes.

Later we might look into a voting system that can automate accepting PRs so this project becomes entirely community driven.

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## typings
- go to https://github.com/adventureland-community/typed-adventureland
- download the code
- run `npm run build | npm run pack`
- copy the produced .tgz to the root of this project and run the below command to install the types
`npm install --save-dev adventureland@typed-adventureland-<version>.tgz`

## data.js
Most of the tools opreate on the data from `https://adventure.land/data.js` and as such you will need to run the following command to download and convert it to json
 - `npx ts-node update-data.ts`

 Then you just run `npm start` to host it locally.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).