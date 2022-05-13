# Tic-Tac-Toe
A Tic-Tac-Toe web application that allows users to play against our AI server. This is the front-end side of the application bult using ReactJS with TypeScript. Test files use React Testing Library and Jest. Most styling comes from bootstrap. 

## Table of Contents
- [File Structure](#file-structure)
- [Components](#components)
    - [Board](#board)
    - [Header](#header)
    - [Loading](#loading)
    - [Sign Up Form](#sign-up-form)
- [Screens](#screens)
    - [Sign Up](#sign-up)
    - [Game](#game)
    - [Page Not Found](#page-not-found)
- [AI Server](#ai-server)
    - [Authentication](#authentication)
    - [Game Engine](#game-engine)
- [Run App](#run-app)
    - [npm start](#npm-start)
    - [npm test](#npm-test)
    - [npm run build](#npm-run-build)
    - [npm run eject](#npm-run-eject)

## File Structure
The application follows the typical react pattern a root directory and pulic and src folders within the root.
-  **Root**: Contains _README.md_, _package.json_, _.gitignore_, and _.env_
    - _.env_: Does store `REACT_APP_AI_URL_DEV` variable which is equal to the dev server url mentioned below. Application assumes `REACT_APP_AI_URL_PROD` url would be stored in hosting application's environment variables.
    - **/public**: Contain _index.html_, _manifest.json_, _robots.txt_, and application icons. 
        - _robots.txt_: Allow all robots complete access
    - **/src**: Contain typical _index.css_, _index.tsx_, _App.tsx_, _App.test.tsx_, and remaining folders for application including our images, components, screens, and datasources.
        - _/components_: Contains a folder for each component type which will include the component file itself and may also include it's corresponding .test and .css files. If the application scaled up and component files became more cumbersome would consider adding .type.ts files to the folder to store corresponding types for that component. For now theey remain in line with component .tsx files. Components are generally stateless and rely on props from screen and are mostly for styling and rendering content. See [Components](#components) for more details on each components.
        - _/datasources_: contains API files that would handle axios calls and typing for each API request and response. In this application we only use the `AI Server` api. See [AI Server](#ai-server) for more details.
        - _/images_: contains image files used throughout application
        - _/screens_: contains the application pages screens. Screen folder contains screen components may may include corresponding .test and .utils file for said component. Screen components for the most part handle the state for the page and pass down to children page components to render and do not handle much if any of the styling. See [Screens](#screens) for more details.

## Components

### Board - `/board`

Renders the actual Tic Tac Toe Board on the Game screen at main path `/`. Receives the Board state from - [Game Screen](#game) as well on the handle click event for when a game board square is selected by user. 

#### Board.tsx
Maps through board rows to render bootstrap styled. Then maps through row's squares to render all 9 squares [BoardSquare.tsx](#boardsquare.tsx). Only state this component handles itself is the hover state of the row and columns on hover of a square. 

#### BoardSquare.tsx
Receives player value of square and hover state from parent [Board.tsx](#boardsquare.tsx). Sets the board styles of the game board itself. 

### Header - `/header`
Renders simple header at all possible application paths including possible not found paths. Logo image and text will always navigate user back to main game path `/`. 

### Loading - `/loading`
Renders simple loading spinner. Used on [Game Screen](#game) when authenticating user or waiting for AI game play and on [Sign Up Screen](#sign-up) when authenticating user. 

> With additional time would ideally like to improve component to possibly overlay a top screen with maybe opaque background but that you can still see the screen as is so it is not as disruptive user to see flashing of components.

### Sign Up Form - `/signupForm`
Renders sign up form on [Sign Up Screen](#sign-up). Receives input values and possible errors to render from parent. All form validation is also done in parent screen.  

> Used bootstrap form which could have handle email validation automatically with built in styling as well. But for sake of assignment, needed to avoid using livrary that would do validation and showed that custome validation could be handled by application.


## Screens

### Sign Up - `/signup`

Simple form on screen that requests users' email and posts to the server (POST /auth), see [AI Server - Authentication](#authentication).
Server will respond with a bearer token that will be used for requests to the game engine (POST /engine), see [AI Server - Game Engine](#game-engine).

#### Page Specifications:
- Validates users email before sending to the /auth API
- Stores the token in the session storage, the game engine (a protected route) will redirect to the signup page if lost.

#### Stretch Goals:
> For the sake of this small application wrote fairly simple regex test to validate email input. For completeness, can research RFC 2822 compliant regex and use instead if desired. Could also confirm with API server which regex they are using to validate emails before providing token and use same validation for symmetry. 

> New token is received every time form is submitted. We could aviod hitting AI Server if session token already exists. However, leaving in without knowing more details of AI server like if tokens are only valid for a certain period of time or if new tokens are required for each email user.

### Game - `/game`

This screen is the game screen (if you don’t know this game, read the [wiki](https://en.wikipedia.org/wiki/Tic-tac-toe)). The user always starts and they are the “X” and the API always goes second with “O”. 

The board is posted as a two-diamention matrix with strings “X”/”O”/””(empty), see api docs for examples
(POST /engine), [AI Server - Game Engine](#game-engine). Every successful request the AI returns a new board state (same as the input board structure).

#### Page Specifications:
- Mouse Hover - When the user’s mouse hovers above a cell the whole row and columns are highlighted.
- On any API request a disable/loading spinner is present.
- API requests to the game engine includes the bearer token in the Authorization header (example “bearer ${token}”).
- The client side validates server’s response board and announces “You win” / “AI win” or “Draw”. If this is the case the user is  able to “reset” the board and start a new game.

#### Logic Notes: 

The board is built using a 2x2 matrix with the player's value `{ board: ("X"|"O"|"")[][] }`.
So example board would look as follows:
```
[ [ "X", "X", "" ],
  [ "O", "O", "X" ],
  [ "O", "", "X" ] ]
```
When a user clicks on an empty square we know that user's position at `{rowIndex: number, colIndex: number}` or corresponding `board[rowIndex][colIndex]`. We update the board value according. 

Besides board value we will also track the global variable of `gameMoves` . `gameMoves` is an integer starting at 0 which is incremented by `1` every time the user or AI makes a move. If at any point after updating user and we have reached the last game move with no winner we know we have reached a "DRAW" and do not have to proceed with AI call. 

Lastly we track the "Tally Count" of the rows, columns, and diagonals for the User and AI every time a player makes a move.
```
let rowTally = [[0, 0, 0], [0, 0, 0]];
let colTally = [[0, 0, 0], [0, 0, 0]];
let d1Tally = [0, 0];
let d2Tally = [0, 0];
```
The 0th indexed item of every Tally variable array is the User's squares and the 1st indexed items is the AI's squares. The row and column Tally variables of each player tracks each row/column by it's index as there are 3 possible rows/columns to fill. So `[0,0,0,]` is `[<row Oth count>, <row 1 count>, <row 2 count>]`.

Each time a player makes a move the player's corresponding row/column/diagonal tally will increment by `1`. If at any time one of the Tally counts hits `3` we know 3 squares of the player have filled a corresponding row/column/diagonal and a WINNER has been found.

> I chose to use this tally count checker logic in this way to minimize the run time as much as possible. Whenever a user makes a move the winner check time is down to `O(1)` because we are simple checking direct variable values at a given index as opposed to say mapping through some potential possible winning array combination. The space is `O(k)` where k is the contant of the number of rows, columns, and diagonals. When the AI makes a move the same run time to check the winner applies but an added run time to find the AI's position is `O(n)` where n is the length of the game board.

Then order of events proceeds as follows: 

1) Update board state with user's choice. `board[user.rowIndex][user.colIndex]`

So say we start with empty board `[[ "", "", "" ], [ "", "", "" ], [ "", "", "" ]]` and user selects first square `[0,0]`. Board is updated to `[[ "X", "", "" ], [ "", "", "" ], [ "", "", "" ]]`. `gameMoves` is also incremented by `1`.

If after user moves we reach max game moves `gameMoves === 9` we have hit a DRAW and logic ends here. 

2) Update our Tally Counts for position of User (index of 0) and check if winner.

So in above example where user selects first square `[0,0]`. Tally counts are updated to:
```
rowTally = [[1, 0, 0], [0, 0, 0]];
colTally = [[1, 0, 0], [0, 0, 0]];
d1Tally = [1, 0];
d2Tally = [0, 0];
```
Because square `[0,0]` is in the 0th row, the 0th col, and the first `\` diagonal. 
We check if correspondong 0th row, 0th col, and first `\` diagonal reached `3`. If so USER WINS and logic ends here. If not game proceeds.

3) Update board state with AI's choice after user has selected.

We call AI Server API and receive a new board including AI's new value. 

For example say, `[[ "X", "O", "" ], [ "", "", "" ], [ "", "", "" ]]`. Game board is directly updated with new value. `gameMoves` is also incremented by `1`.

We do check for AI API errors and if error thrown the board value that was sent to AI (aka user board) is returned as AI's response. So if ai board and user board are one in the same we know an error occurred. When this happens we reset the game board back to the state it was _before_ the **user** played, `gameMoves` is also deccremented by `1`, and the player can attempt to make the move again to retrigger API attempt. An error message is displayed to user.

4) Update our Tally Counts for position of AI (index of 1) and check if winner

In order to update Tally Counts we need to deteremine what the AI's position was from the board response. We do this by going through AI's board response values and check each square value against previous user board's corresponding square value. When they don't match we know the AI's position by the mapped row and col index. 

So in above example where AI selected `[0,1]`. Tally counts are updated to:
```
rowTally = [[1, 0, 0], [1, 0, 0]];
colTally = [[1, 0, 0], [0, 1, 0]];
d1Tally = [1, 0];
d2Tally = [0, 0];
```
Because square `[0,1]` is in the 0th row, the 1st col, and no diagonals. 
We check if correspondong 0th row, 1st col, and any diagonal reached `3`. If so AI WINS. If not, game repeats at step 1 until a winner is found or all squares are filled resulting in a DRAW. 

#### Stretch Goals:
> Add a "suggest move" button that will help the user pick his next move.

> Highlight the winning squares.

> Add a signout button in the header that removes the token from session storage and navigates user to signup page.

> Add tests for all loading spinner states. For sake of assignment did not add test to AI calls as likely in real>time app API calls and other actions requiring loading state should take a short enough time that spinner disrupts user experience more then it helps. Ideally would only use spinner on actions over say 2 seconds.
> Add tests for AI Engine and resulting board, winner, and reset button updates. 
> Add tests for resetting game board.

### Page Not Found - `/*`

Simple screen for any other invalid paths potentially entered into url by user. Has a link on page prompting users to go back to main path `/` to play game. 

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
