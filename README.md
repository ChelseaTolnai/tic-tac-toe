# Tic-Tac-Toe
A Tic-Tac-Toe web application that allows users to play against our AI server. This is the front-end side of the application bult using ReactJS with TypeScript.

## Table of Contents
- [Screens](#screens)
    - [Sign Up](#sign-up)
    - [Game](#game)
-  [AI Server](#ai-server)
    - [Authentication](#authentication)
    - [Game Engine](#game-engine)
-  [Run App](#run-app)
    - [npm start](#npm-start)
    - [npm test](#npm-test)
    - [npm run build](#npm-run-build)
    - [npm run eject](#npm-run-eject)

## Screens

### Sign Up - `/signup`

Simple form on screen that requests users' email and posts to the server (POST /auth), see [AI Server - Authentication](#authentication).
Server will respond with a bearer token that will be used for requests to the game engine (POST /engine), see [AI Server - Game Engine](#game-engine).

Page Specifications:
- Validates users email before sending to the /auth API
- Stores the token in the session storage, the game engine (a protected route) will redirect to the signup page if lost.

### Game - `/game`

This screen is the game screen (if you don’t know this game, read the [wiki](https://en.wikipedia.org/wiki/Tic-tac-toe)). The user always starts and they are the “X” and the API always goes second with “O”. 

The board is posted as a two-diamention matrix with strings “X”/”O”/””(empty), see api docs for examples
(POST /engine), [AI Server - Game Engine](#game-engine). Every successful request the AI returns a new board state (same as the input board structure).

Page Specifications:
- Mouse Hover - When the user’s mouse hovers above a cell the whole row and columns are highlighted.
- On any API request a disable/loading spinner is present.
- API requests to the game engine includes the bearer token in the Authorization header (example “bearer ${token}”).
- The client side validates server’s response board and announces “You win” / “AI win” or “Draw”. If this is the case the user is  able to “reset” the board and start a new game.

## AI Server

LIVE open API documentation can be found here:
[https://d9u7x85vp9.execute-api.us-east-2.amazonaws.com/production/api-docs/#/](https://d9u7x85vp9.execute-api.us-east-2.amazonaws.com/production/api-docs/#/)

|Environment|Sever|
|-----------|-----|
|local      |`http://localhost:4444/`|
|dev        |`https://zrp7d8y3q4.execute-api.us-east-2.amazonaws.com/dev/`|
|production |`https://d9u7x85vp9.execute-api.us-east-2.amazonaws.com/production/`|

### Authentication

**POST `/auth`** - Retrieve a JWT token

**Parameters**: No parameters
**Request body (*required*)**: `{ email: string }`
example:
```
{ "email": "test@test.com" }
```
**Response**: `{ success: boolean; token: string } | { error: string }`
code `200` example:
```
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lQHRlc3QuY29tIiwiaWF0IjoxNjEwNzIwNjQ2fQ.neIqTt4NXt9D8DLGmW__so6oVEbJ9Qg9jhs441PaFfI"
}
```
default  --> Unexpected error, such as 500
code `500` examples:
`{ "error": "Validation error: \"email\" is required" }`
`{ "error": "Validation error: \"email\" must be a valid email" }`


### Game Engine

**POST `/engine`** - Send and receive next move

**Parameters**: No parameters
**Request Headers**: ```{ Authorization: `bearer ${string}` }``` where the `${string}` is the token received from the /auth API.
example: 
```
{ "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lQHRlc3QuY29tIiwiaWF0IjoxNjEwNzIwNjQ2fQ.neIqTt4NXt9D8DLGmW__so6oVEbJ9Qg9jhs441PaFfI" }
```
**Request body (*required*)**: `{ board: ("X"|"O"|"")[][] }`
example:
```
{
  "board": [
    [ "X", "X", "" ],
    [ "O", "O", "X" ],
    [ "O", "", "X" ]
  ]
}
```
**Response**: `{ success: boolean; board: ("X"|"O"|"")[][] } | { error: string | any }`
code `200` example:
```
{
  "success": true,
  "board": [
    [ "X", "X", "O" ],
    [ "O", "O", "X" ],
    [ "O", "", "X" ]
  ]
}
```
default  --> Unexpected error, such as 500
code `500` examples:
`{ "error": {} }`
`{ "error": "Validation error: \"board\" must contain at least 3 items" }`
`{ "error": "Validation error: \"2\" must contain at least 3 items" }`
`{ "error": "Validation error: \"0\" must be one of [O, X, ]" }`

## Run App

This is a working project that can be run locally on a laptop/desktop. 

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
