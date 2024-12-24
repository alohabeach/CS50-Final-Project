<!-- TITLE -->
# Game Hub - CS50 Final Project
This is a simple game hub website built using Express. It includes two games: Connect 4 and Connect Flow. The application serves as a platform to play these games in a web browser.


### Built With
* [![Nodejs][NodeJs]][NodeJs-url]
* [![p5js][p5js]][p5js-url]
* [![Nodemon][Nodemon]][Nodemon-url]
* [![Bootstrap][Bootstrap]][Bootstrap-url]



## Requirements
Before you can run the application, ensure you have the following installed on your computer:
- [Node.js](https://nodejs.org/): This is the runtime environment required to run the Express server.
- [npm](https://www.npmjs.com/): Node Package Manager, included with Node.js, is required to install project dependencies.
- [Git](https://git-scm.com/): Used to clone the repository from GitHub.

## Setup Instructions
1. First, clone the repository to your local machine using the following command:
```bash
git clone https://github.com/alohabeach/CS50-Final-Project
```

2. Open the project folder in your terminal:
```bash
cd CS50-Final-Project
```

3. Run the following command to install all required dependencies:
```bash
npm install
```

4. Once dependencies are installed, you can start the application by running:
```bash
npm start
```

5. After running npm start, the application will launch the webpage. The terminal will display the URL where the game hub can be accessed. Typically, it will be something like:
```bash
Access website via either link:
http://localhost:1000
http://127.0.0.1:1000
```



## Games Included
1. Connect 4: A classic 4-in-a-row game where players take turns dropping discs into a grid in an attempt to connect four of their discs in a row, either horizontally, vertically, or diagonally.

2. Connect Flow: A puzzle game where players must connect pairs of matching numbers on a grid by drawing a path between them, without paths crossing.



## Acknowledgments
The following resources were instrumental in building this project:

* [p5.js](https://p5js.org)
* [Numberlink Generator Repository](https://github.com/abhishekpant93/numberlink-generator)
* [Solving Connect Four - Minimax Algorithm](http://blog.gamesolver.org/solving-connect-four/03-minmax/)



## File Structure and Organization
This project follows a structured layout to ensure modularity, clarity, and maintainability. Here's an overview of the key files and directories:

- **`bin/www`**  
  Acts as the main entry point for the application, setting up the HTTP server.

- **`app.js`**  
  Configures the routes and initializes the application, connecting the server to the appropriate logic and views.

#### Directories:
1. **`views/`**  
   Contains Pug templates, chosen over HTML to allow seamless variable passing from the server to the views. This decision enables dynamic content rendering and reduces redundancy.
   
2. **`routes/`**  
   Defines the routes for navigating between games. For example:
   - `/connect4/ai` leads to the Connect4 game against the ai.
   - `/numberlink` leads to the Connect Flow game.

3. **`public/`**  
   Houses static assets for the project, organized into:
   - **`images/`**  
     Contains graphical assets used across the application.
   - **`stylesheets/`**  
     Includes CSS files for styling the application.
   - **`javascripts/`**  
     This folder is critical as it holds the logic for each game. It is divided into subfolders:
     - **`connect-4/`**  
       - Contains `sketch.js`, the main file leveraging the p5.js library to handle the game's canvas rendering.
       - Includes a `lib/` folder with helper files like `connect4-logic.js` for game mechanics and `connect4-visuals.js` for rendering graphics.
     - **`numberlink/`**  
       - Similarly structured with `sketch.js` as the entry point and a `lib/` folder housing `numberlink-logic.js` for computational logic and `numberlink-visuals.js` for graphical operations.

#### Design Choices:

1. **Use of Pug**  
   Pug was selected over HTML to streamline the integration of server-side data into the views, allowing for more interactive and data-driven templates.
   
2. **Separation of Concerns**  
   By organizing logic (`*-logic.js`) and visuals (`*-visuals.js`) into separate files, the project maintains a clear distinction between game mechanics and their visual representation, facilitating easier debugging and future enhancements.

3. **p5.js Integration**  
   The p5.js library was chosen for its simplicity and robust support for creating graphical interfaces, making it an ideal choice for rendering games like Connect4 and Numberlink.




## Game Mechanics and File Breakdown
These are detailed descriptions of how each game works behind the scenes

### Connect 4
1. `sketch.js`

    This file manages the game's setup, main drawing loop, user interactions, and responsiveness. It initializes the visual and logic components of the game, handles mouse events, and updates the game state in response to user actions.

    - **Game Initialization:**
        - The `setup` function initializes the canvas, sets up the scale handler, and creates instances of the `Connect4Visuals`, `Connect4Logic`, and `Connect4AI` classes.
        - It also sets the default game state and determines the game mode (single-player or local co-op), including handling player information (e.g., usernames and player numbers).
    - **Mouse Interaction:**
        - The `mouseClicked` function listens for mouse clicks and processes player moves. If the user clicks on a valid column, the game state is updated by calling the `game.play` method.
        - In single-player mode, the AI opponent makes its move after the player. In local co-op mode, players take turns making their moves.
        - If the game ends (a win or tie), the `gameOver` method is called to handle the game’s conclusion.
        - The `restartBtn` is clickable and allows the game to reset.
    - **Drawing and Visual Updates:**
        - The `draw` function is the main drawing loop. It continuously updates and draws the game board, player pieces, and other UI elements (such as the restart button).
        - It also changes the mouse cursor to a pointer when hovering over interactive elements.
    - **Window Resizing:**
        - The `windowResized` function is triggered when the window size changes, updating the scale and resizing the canvas to ensure responsiveness.

2. `lib/connect4-logic.js`

    This file handles the core game mechanics in a class called `Connect4Logic`. It stores the state of the game, player moves, win conditions and other key functionalities which include:

    - **Initialization:** The constructor sets up the game board as a 2D array (`pieces`) representing the grid, along with columns, rows, and lists for players and spectators. The board is initially and prepared for new players.
    - **Game State Management:** Methods like `clearGameState` and `updateGameState` reset or modify the current game state, including the positions of pieces and player turns.
    - **Player Actions:** The `play` method allows a player to drop a piece into a column if the move is valid, using `isValidPlay` to ensure the column isn't full.
    - **Win and Tie Detection:** The `checkWin` method evaluates whether the latest move results in a win by checking for four consecutive pieces in any direction (horizontal, vertical, or diagonal). I    also checks for a tie if all columns are filled without a winner. The function doesn't use any fancy bitwise operations. I instead opted to loop through piece in the 2d array containing the game'    state and check all 4 directions from that point to find a 4 in a row.
    - **Debugging:** The `printGameState` method logs the board and game state to the console, providing a visual representation for debugging purposes.

3. `lib/connect4-visuals.js`

    This file handles the visual representation and animations of the Connect4 game in a class called `Connect4Visuals`. It manages the drawing of the game board, player pieces, and game state updates, including:

    - **Board and Piece Initialization:** The constructor sets up the visual elements of the board, including calculating the board size, piece scale, and root position based on the current scale. It also initializes the pieces in their respective positions on the board using a 2D array.
    - **Scale Management:** The `updateScales` method adjusts the scale of the game board and pieces dynamically based on the screen size, ensuring a responsive layout and consistent appearance across different device sizes.
    - **Piece Drawing and Animations:** The `drawAllPieces` method handles drawing the player pieces on the board, while the `play` method animates the movement of a piece as it falls into place. The `animateGameOver` method aniamtes the four-in-a-row winning line.
    - **Turn Display and Game Status:** The `drawTurnDisplay` method shows the current player's turn, including their username and win count. It also handles displaying the game result, such as the winner or a tie, once the game is over.
    - **User Interaction:** The `isMouseOver` method detects if the mouse is hovering over any clickable elements like pieces or buttons. The `updateSelectedColumn` method updates the selected column based on the user's mouse position, enabling them to drop pieces into the board.
    - **Restart Functionality:** The `makeOtherDraws` method creates a restart button which can be clicked to restart the game, resetting the board and pieces. However, the win counts are retained.
    - **Drawing and Visual Effects:** The `drawBorders` method draws the outer border of the game board, while the `drawOthers` method handles additional visual effects, like highlighting the winner’s line and showing the restart button.

4. `lib/ai.js`

    This file introduces the `Connect4AI` class, which implements an AI opponent for Connect4. The AI uses the minimax algorithm with adjustable depth to simulate and evaluate possible moves, striving to make optimal decisions.

    - **Initialization:** The constructor accepts parameters for `depth` (search depth), `columns`, and `rows`, allowing customization of the AI's complexity and compatibility with different board sizes.
    - **Move Calculation:**
        - The `getMove` method determines the best column for the AI to play by using the `minimax` algorithm.
        - The `minimax` algorithm recursively evaluates potential game states up to the specified depth, distinguishing between maximizing (AI’s turn) and minimizing (opponent’s turn) scenarios. It assigns scores to moves based on win, loss, tie, or continued play.
    - **Win and Board State Detection:**
        - The `checkWinner` method identifies a winner by scanning for four consecutive pieces vertically, horizontally, or diagonally.
        - The `isBoardFull` method checks whether the board is completely filled.
        - The `getNextEmptyRow` method identifies the lowest available row (far left) in a given column, enabling valid moves.
    - **Scoring:** The algorithm scores moves like so:
        - **+100** for a winning state for the AI.
        - **-100** for a loss to the opponent.
        - **0** for ties or when the search depth is exhausted.

5. `lib/Arrow.js`

    This file defines the `Arrow` class, which is used to create and animate arrow indicators in the Connect4 game, used for guiding the player’s move selection. The class handles the arrow's position, animation, and visual representation.

    - **Initialization:** The constructor sets the arrow’s initial position based on the `y` coordinate and a scaling factor (`scale_`). The `init` method initializes the arrow's position and sets up the animator.
    - **Animation:**
       - The `animate` method creates a vertical oscillation effect for the arrow using the sine function, making it appear to bounce up and down smoothly. The movement is bounded between `top` and `bottom` points. These points are calculated using the intialized `y` coordinate and half of the arrow's `scale`.
    - **Movement:**
       - The `follow` method allows the arrow to smoothly follow the horizontal position (`tx`) of the mouse, using linear interpolation (`lerp`) for smooth transitions.
    - **Visual Representation:**
       - The `calculateVertices` method calculates the positions of the three points of the arrow based on its `position` and `scale`.
       - The `draw` method handles rendering the arrow on the canvas, drawing a triangle shape that represents the arrow. It is animated and drawn only if the arrow is marked as `visible`.

6. `lib/button.js`

    This file defines the `Button` class, which creates interactive buttons with text and visual feedback in the game. The buttons are drawn on the canvas and respond to mouse interactions.

    - **Initialization:** The constructor sets the button’s text, text size, position (`x`, `y`), and color. If no color is provided, a default gray color is used. The hover color is made by darkening the original color by a factor of 20 using the rgb scale.
    - **Text Handling:**
        - The `setText` method allows the button’s text to be updated dynamically.
        - The `getTextWidth` method calculates the width of the button’s text, which is used for sizing the button’s rectangle to fit the text.
    - **Mouse Interaction:**
        - The `isMouseOver` method determines whether the mouse is hovering over the button by comparing the mouse’s coordinates to the button’s rectangle bounds.
        - The `calculateRectSizes` method calculates the button’s rectangle dimensions based on the text width and height, ensuring the button’s shape adjusts to fit its text content automatically.
    - **Visual Representation:**
        - The `drawRect` method draws the button’s rectangle, changing color when the mouse hovers over it.
        - The `drawText` method renders the button’s text centered inside the button.
        - The `draw` method calls both drawRect and drawText to display the complete button on the canvas.

7. `lib/piece.js`

    This file defines the `Piece` class, which represents the game pieces on the Connect4 board. The class handles the creation, drawing, animation, and interaction of the pieces as they move into place and respond to user actions.

    - **Initialization:** The constructor sets the position (`x`, `y`), diameter, radius, and type (representing player or empty piece) for each piece. It also initializes the easing style used for animations.
    - **Mouse Interaction:**
        - The `isMouseOver` method detects whether the mouse is hovering over the piece by calculating the distance between the mouse and the piece’s position. It returns `true` if the mouse is within the piece's radius.
    - **Animation:**
        - The `animStart` method initiates an animation for the piece, starting from a given position and animating towards an end position with a specified speed.
        - The `animStep` method updates the position of the piece during the animation, using an easing function for a smooth, bouncing effect.
        - The `animEnd` method ends the animation and sets the piece's position to the final destination.
    - **Color Handling:**
        - The `updateColors` method dynamically adjusts the piece's color based on its type (e.g., player 1's piece, player 2's piece, or empty). It also applies a glowing effect to the piece when it has just been played.

    - **Drawing:**
        - The `draw` method updates the piece's color and draws the piece as a circle on the board. If the piece is animating, it updates the position using the animation logic explained above.

8. `lib/scale.js`

    This file defines the `Scale` class, which handles the scaling of the game’s visual elements based on the window dimensions. It ensures that the game's elements are appropriately sized relative to the canvas size.

    - **Initialization:** The constructor accepts the width (`w`) and height (`h`) of the canvas and immediately calls the `update` method to set the initial scaling factor.
    - **Scale Calculation:**
        - The `getScale` method returns the current scale value, which is used by other components to determine the size of visual elements (such as game pieces, buttons, and the board).
    - **Canvas Resizing:**
        - The `update` method resizes the canvas based on the provided width and height. It also calculates the new scale (`scl`) as a factor of the canvas dimensions, ensuring that elements are dynamically scaled according to the window size.


### Connect Flow
1. `sketch.js`

    This file manages the game's setup, drawing loop, user interactions, and puzzle settings for the Numberlink game. It initializes the game logic, handles board drawing, and responds to user inputs such as mouse clicks and drag events.

    - **Game Initialization:**
        - The `setup` function initializes the canvas, sets up the scale handler, and creates instances of the `NumberlinkPuzzle` and `DrawNumberlink` classes.
        - A new puzzle is generated using `generateNewPuzzle`, and the board is initialized with the unsolved puzzle state.
    - **Drawing and Visual Updates:**
        - The `draw` function is the main drawing loop. It continuously updates and draws the game board using the `board.draw` method, which renders the puzzle on the screen.
    - **Window Resizing:**
        - The `windowResized` function is triggered when the window size changes. It updates the scale and resizes the canvas to maintain the correct aspect ratio and responsiveness.
    - **Mouse Interaction:**
        - The `mousePressed`, `mouseDragged`, and `mouseReleased` functions handle mouse events and forward them to the `board` to allow interaction with the puzzle.
    - **Error Handling:**
        - The `displayError` function creates and displays an error message if a puzzle cannot be generated or solved.
    - **Puzzle Settings and Controls:**
        - The `settings` object stores puzzle configurations, such as the maximum and preferred range of pairs for puzzle generation.
        - Event listeners on the "Save Changes" and "New Puzzle" buttons update puzzle settings and generate a new puzzle based on the selected options.
        - The "Solve" button allows the user to animate the solution of the puzzle, updating the board step by step.
    - **Debouncing:**
        - A debounce mechanism is used to prevent multiple rapid requests for puzzle generation or solution animation.

2. `lib/numberlink-logic.js`

    This file provides the classes `NumberlinkSolver`, `NumberlinkGenerator`, and `NumberlinkPuzzle` which are used to either generate a new puzzle with specific conditions or solve an unsolved puzzle with specific conditions. The first 2 classes will be explained in detail while the third one is just a class that combines the other two for ease of use and will have a broader explanation.

    `NumberlinkSolver` **Class**

    This class is responsible for solving a Numberlink puzzle. It has methods for managing the puzzle, checking whether it's solved, and applying various strategies to fill in the puzzle.

    - **Constructor** (`constructor(puzzle)`)
        - **Purpose:** Initializes the solver with a given puzzle.
        - **Process:**
            - The constructor receives a puzzle in the form of a 2D array (e.g., a grid of numbers where some cells are filled with numbers and others are empty).
            - It deep copies the puzzle (to avoid mutating the input directly).
            - It initializes an array of saved states (`savedStates`) to keep track of changes during solving (for backtracking or undoing).
            - It also tracks `lastMovedNumber`, which holds the most recent position of each number.
            - It calculates `rowCount` and `columnCount` based on the puzzle's dimensions and sets up the directions for movement (up, down, left, right).
    - **Main Methods**
        1. `solve(showSteps = false)`:
            - **Purpose:** This is the main solving method. It recursively attempts to solve the puzzle by applying different strategies.
            - **Process:**
                - It first attempts to complete any links that have forced moves (where a link has only one possible continuation).
                - Then, it tries to complete obvious moves (where a link is almost completed).
                - It checks if the puzzle is completed or if there are open spots (i.e., unsolved parts of the puzzle).
                - If the puzzle is solved, it returns either the solved puzzle or the list of steps taken if `showSteps` is `true`.
        2. `isPuzzleCompleted()`:
            - **Purpose:** Checks if all the links in the puzzle are complete.
            - **Process:** Iterates through all the numbers in `linkInfo` and checks if each number’s start and end positions are linked.
        3. `hasOpenSpots()`:
            - **Purpose:** Checks if there are still any empty cells (null values) in the puzzle.
            - **Process:** Iterates through the puzzle to check for `null` values indicating unfilled cells.
        4. `newPos(row, column)`:
            - **Purpose:** A helper method to create a position object from row and column indices.
        5. `getAround(pos)`:
            - **Purpose:** Returns an array of positions around a given cell (up, down, left, right).
            - **Process:** Uses the `directions` array to calculate the neighboring positions and checks if they are within the puzzle bounds.
        6. `doesPathExist(startPos, endPos, number)`:
            - **Purpose:** Checks if a path exists between two positions for a given number.
            - **Process:** Uses recursion to explore all possible paths between the start and end positions, ensuring no previously visited cells are revisited.
        7. `getBestLinkPos()`:
            - **Purpose:** Finds the best position to start solving next, based on the number of empty spots around it.
            - **Process:** It calculates the number of empty spaces around each number that hasn't been completed and selects the position with the most empty spaces to prioritize solving.
        8. `hasForcedMoves(pos)`:
            - **Purpose:** Checks if a number at the given position has any forced moves (i.e., if it can only move to one position).
            - **Process:** It counts the number of adjacent empty spots and determines if there’s exactly one possible move.
        9. `completeForcedMoves(pos)`:
            - **Purpose:** Fills in the forced moves for the number at the given position.
            - **Process:** Recursively fills adjacent empty cells if there’s only one valid move, marking them with the appropriate number.
        10. `completeObviousMoves()`:
            - **Purpose:** Completes moves that are immediately obvious (e.g., where a number is surrounded and can only go in one direction).
            - **Process:** It checks each number’s adjacent cells to see if they can be filled based on surrounding constraints.
        11. `isNumberCompleted(number)`:
            - **Purpose:** Checks if the link for a particular number is completed.
            - **Process:** Recursively checks if there’s a path between the start and end positions for that number, marking it as completed once a valid path is found.
        12. `isSurrounded(pos, number)`:
            - **Purpose:** Checks if a number is surrounded in a way that forces it to move in a specific direction.
            - **Process:** If a number has exactly two adjacent cells that belong to the same number, it checks if those cells are next to the start or end position of the number.
        13. `inBounds(pos)`:
            - **Purpose:** Checks if a given position is within the puzzle’s boundaries.
            - **Process:** Ensures that the row and column are within the bounds of the puzzle.
        14. `saveChanges()`:
            - **Purpose:** Saves the current state of the puzzle to the `savedStates` array.
            - **Process:** It deep copies the current puzzle state to allow backtracking.

    `NumberlinkGenerator` **Class**

    This class is responsible for generating random solvable Numberlink puzzles. It creates both an unsolved board (with empty cells) and a solved board (with completed links).

    - **Constructor** (`constructor(boardSize)`):
        - **Purpose:** Initializes the generator with a given board size.
        - **Process:**
            - Initializes the `unsolvedBoard` and `solvedBoard` as empty boards.
            - Sets up `currentPathColor` to track the current path number and `totalCoveredCells` to track how many cells are filled.
    - **Main Methods**
        1. `createEmptyBoard(size)`:
            - **Purpose:** Creates a new empty board with the given size.
            - **Process:** Returns a 2D array with a size of `size` filled with `null` values.
        2. `countNeighbours(board, rowIndex, columnIndex, color = null)`:
            - **Purpose:** Counts the number of neighboring cells around a given cell.
            - **Process:** Checks the four possible directions (up, down, left, right) and counts how many neighbors are either filled (or of a specific color if provided).
        3. `hasIsolatedSquares(board, rowIndex, columnIndex, color, isLastNode)`:
            - **Purpose:** Checks if a square is isolated (i.e., not part of any other path).
            - **Process:** For each neighboring cell, it checks if it has exactly four neighbors (empty cells) and if the current square is isolated from the path, returning `true` if any neighboring square is isolated.
        4. `getPathExtensionNeighbour(board, rowIndex, columnIndex, color)`:
            - **Purpose:** Attempts to find a valid neighboring cell to extend a path.
            - **Process:** It randomly picks a direction and checks if extending the path in that direction is valid (i.e., the cell is empty, and it does not create isolated squares).
        5. `addPath()`:
            - **Purpose:** Adds a random path to the puzzle.
            - **Process:**
                - It randomly selects a starting point for the path.
                - It then attempts to extend the path, checking for isolated squares and ensuring the path doesn’t overlap with others.
                - It continues extending until the path reaches its maximum length or cannot be extended anymore.
        6. `shuffleColors()`:
            - **Purpose:** Randomizes the path colors (numbers) on the board.
            - **Process:** It shuffles the list of path colors and assigns them to the unsolved board.
        7. `shuffleArray(array)`:
            - **Purpose:** Shuffles an array randomly using the Fisher-Yates method.
            - **Process:** It randomly swaps the elements in the array to achieve a random order.
        8. `generateBoard()`:
            - **Purpose:** Generates a new solvable Numberlink board.
            - **Process:** It repeatedly adds paths until all cells are filled and then shuffles the colors for randomization. The function ensures the puzzle is solvable.
        9. `prettyPrintPuzzle(puzzle)`:
            - **Purpose:** Prints a human-readable version of the puzzle.
            - **Process:** It iterates through the puzzle and prints the numbers (or dots for empty cells) in a grid format.

    `Numberlink` **Class**

    This class serves as the overarching class for managing the puzzle. It encapsulates both puzzle creation and solving by combining the `NumberlinkSolver` for solving puzzles and the `NumberlinkGenerator` for generating random puzzles.

    - **Constructor** (`constructor(boardSize)`):
        - **Purpose:** Initializes a new `NumberlinkPuzzle` instance with a specific board size.
        - **Process:**
            - The constructor accepts the parameter `boardSize` as the size of the board (both rows and columns).
            - It calls the parent class `NumberlinkGenerator` constructor (`super(boardSize)`) to initialize the grid with the specified size.
    - **Main Methods**
        1. `generateNewPuzzle(maxPairs = 10, preferredPairs = false, maxAttempts = 1000)`:
            - **Purpose:** Generates a new puzzle and attempts to meet the criteria of the number of pairs within a set number of attempts.
            - **Process:**
                - This method tries to generate a valid puzzle with the specified number of pairs. It will retry up to `maxAttempts` if the generated puzzle doesn't meet the criteria.
                - Key Steps:
                    - It generates a new board using the `generateBoard()` method (inherited from `NumberlinkGenerator`).
                    - It counts the number of pairs in the puzzle using the `countPairs()` method.
                    - If the number of pairs is within the `maxPairs` limit and optionally matches the `preferredPairs`, the puzzle is considered valid.
                    - If the puzzle doesn't meet the criteria, the method will increment the attempt counter and retry until the maximum attempts are reached.
                    - If a valid puzzle is generated, it updates the `unsolvedBoard` and `solvedBoard`.
        2. `countPairs()`:
            - **Purpose:** Counts the unique numbers in the unsolvedBoard, which represents the number of unique pairs.
            - **Process:**
                - This method iterates through each cell in the `unsolvedBoard` and adds non-null numbers to a `Set`, ensuring uniqueness.
                - The final count of unique numbers in the set is returned as the number of pairs.
        3. `getSolution(showSteps = false)`:
            - **Purpose:** Solves the puzzle and returns the solution, either showing all the steps or just the final solution.
            - **Process:**
                - This method creates a new `NumberlinkSolver` instance, passing the `unsolvedBoard` to it.
                - It calls the `solve()` method on the solver, which either returns the final solved puzzle or an array of puzzle states showing each step of the solution, depending on the value of `showSteps`.
        4. `printUnsolved()`:
            - **Purpose:** Prints the unsolved puzzle to the console in a human-readable format.
            - **Process:**
                - It calls the private `_prettyPrint()` method, passing the `unsolvedBoard` to display the puzzle in a visually appealing way.
        5. `printSolved()`:
            - **Purpose:** Prints the solved puzzle to the console in a human-readable format.
            - **Process:**
                - It calls the private `_prettyPrint()` method, passing the `solvedBoard` to display the completed puzzle.
        6. `_prettyPrint(puzzle)`:
            - **Purpose:** A helper method to print any puzzle (either solved or unsolved) in a readable, visually appealing format.
            - **Process:**
                - This method formats the puzzle in a grid-like structure where:
                    - `null` values are displayed as a dot (`. `).
                    - Numbers are displayed as their value (e.g., `1`, `2`, etc.).
                - The formatted puzzle is then printed to the console for easy visualization.

3. `lib/numberlink-visuals.js`

    This class provides visual representation and interaction for a Numberlink puzzle board, integrating with the `scaleHandler` and `Colors` classes. This class allows users to interact with the grid by clicking, dragging, and linking cells while providing functionality for updating the grid visually.

    - **Constructor** (`constructor(numberlinkBoard, scaleHandler, rootPos)`):
        - **Purpose:** Initializes a new instance of the `DrawNumberlink` class with a specified board, scale handler, and root position.
        - **Parameters:**
            - `numberlinkBoard`: The 2D array representing the current state of the puzzle (each cell has a value, color, and other properties).
            - `scaleHandler`: An object responsible for determining the scale of the drawing (how large or small the cells will appear).
            - `rootPos`: The center of the grid will be placed at this root position
        - **Initialization**:
            - The constructor clones the `numberlinkBoard` to prevent mutating the original.
            - It initializes a `scaleHandler` and gets the current scale using `getScale()`.
            - It calls the `init()` method to process and set up the board visually (assigning colors, setting base numbers, etc.).
    - **Main Methods**
        1. `init()`:
            - **Purpose:** Initializes the `numberlinkBoard` with visual properties like color and position.
            - **Process:**
                - Iterates through each cell in the numberlinkBoard.
                - For each cell:
                    - If it has a value (`currentValue !== null`), assigns it a color using the `Colors` class.
                    - Sets the cell’s properties (`value`, `currentColor`, `isBaseNumber`, `position`).
        2. `updateScales()`:
            - **Purpose:** Updates the scale and grid size based on the current scale and board size.
            - **Process:**
                - Calls `scaleHandler.getScale()` to update the current scale.
                - The `rootPos` is set to the center of the canvas (`width / 2, height / 2`).
                - Calculates `cellSize` based on the grid size and scale.
                - Calculates `gridSize` to determine the full size of the board.
        3. `updateBoard(newBoard, isSolution = false)`:
            - **Purpose:** Updates the board with a new layout and reinitializes its visual properties.
            - **Process:**
                - Clones the `newBoard` to prevent mutation of the original.
                - If the update is related to a solution (`isSolution = true`), updates the colors of each cell according to the solution's values.
                - Otherwise, it updates the `numberlinkBoard` and calls `init()` to reset the visual state.
        4. `getSelectionAtMouse()`:
            - **Purpose:** Determines which cell is being clicked or hovered over based on the current mouse position.
            - **Process:**
                - Adjusts the mouse position relative to the board’s root position.
                - Converts the mouse coordinates into grid indices (`column`, `row`) using the cell size.
                - If the mouse is over a valid grid cell, it returns the corresponding cell and its coordinates.
        5. `getNeighbors(cell)`:
            - **Purpose:** Returns the neighboring cells that are directly adjacent to the given cell.
            - **Process:**
                - Defines four possible directions for neighbors (right, down, left, and up).
                - For each direction, it checks if the neighbor is within bounds and has the same color as the current cell (to maintain the connection).
                - Returns the neighbors as a list.
        6. `getLinks(selectedCell, visited = new Set())`:
            - **Purpose:** Finds all the connected cells (links) starting from the `selectedCell`.
            - **Process:**
                - Recursively explores all connected cells that have the same color as the `selectedCell`, ensuring no cell is revisited by keeping track of visited cells.
                - Returns a list of linked cells.
        7. `hasLinkWithBlacklist(selection, blacklistPosition)`:
            - **Purpose:** Checks whether there is a link with a given blacklist position (a position that should not be linked).
            - **Process:**
                - Finds all the links of the `selection.cell` and checks if any of them match the `blacklistPosition`.
        8. `removeStrandedCells()`:
            - **Purpose:** Removes "stranded" cells (cells that cannot connect to any base number of the same color) by resetting their color.
            - **Process:**
                - Iterates over each cell in the board and checks if it is connected to a base number with the same color.
                - If a cell is not connected to any base number, its color is reset to white (`color(255)`).
        9. `mousePressed()`:
            - **Purpose:** Handles the mouse press event.
            - **Process:**
                - Gets the selected cell at the mouse position.
                - If the selected cell is not a base number and is already empty (`color(255)`), it skips further actions.
                - Otherwise, it starts a drag operation by saving the `startDrag` and `lastDrag` positions.
        10. `mouseReleased()`:
            - **Purpose:** Handles the mouse release event.
            - **Process:**
                - Clears the drag states (`startDrag` and `lastDrag`).
                - Calls `removeStrandedCells()` to clean up the grid after the drag operation.
        11. `mouseDragged()`:
            - **Purpose:** Handles the mouse drag event.
            - **Process:**
                - If no drag operation has started (`startDrag` is null), it returns early.
                - Otherwise, it checks the current and last drag positions to determine whether the drag is valid (either moving horizontally or vertically).
                - Based on the cell states (empty, base, or linked), it performs the necessary actions:
                    - Drag forward: Updates the color of the target cell if the move is valid.
                    - Drag back: Resets the color if dragging back to an already linked base.
                - Calls `removeStrandedCells()` to update the board and ensure that any isolated cells are removed.
        12. `draw()`:
            - **Purpose:** Draws the entire board and its cells to the canvas.
            - **Process:**
                - Adjusts the drawing position using `rootPos` and calculates the offsets (`offsetX`, `offsetY`).
                - Iterates through each cell in the grid and draws a square for each cell at the calculated position (`xPosition`, `yPosition`).
                - If the cell is a base number, it draws the number in the center of the square.

4. `lib/scale.js`

    This file defines the `Scale` class, which handles the scaling of the game’s visual elements based on the window dimensions. It ensures that the game's elements are appropriately sized relative to the canvas size.

    - **Initialization:** The constructor accepts the width (`w`) and height (`h`) of the canvas and immediately calls the `update` method to set the initial scaling factor.
    - **Scale Calculation:**
        - The `getScale` method returns the current scale value, which is used by other components to determine the size of visual elements (such as game pieces, buttons, and the board).
    - **Canvas Resizing:**
        - The `update` method resizes the canvas based on the provided width and height. It also calculates the new scale (`scl`) as a factor of the canvas dimensions, ensuring that elements are dynamically scaled according to the window size.

5. `lib/colors.js`

    This file defines the `Colors` class, which manages the color palette for the Numberlink game. It provides methods for retrieving colors and checking color equality, which are crucial for visualizing the game’s elements and ensuring consistency in the puzzle's design.

    - **Color Palette Initialization:** The constructor initializes an array of predefined colors using the `color()` function, from the `p5.js` graphics library. This set includes various colors like red, green, blue, and others, which are used to represent different numbers in the game.
    - **Color Retrieval:** The `getColorAt` method retrieves a color from the predefined palette based on the provided index. If the index is out of bounds, it returns the default color `color(255)` (white).
    - **Color Equality Check:** The `isEqual` method checks whether two colors are equal by comparing their RGB values. It returns `true` if the colors match and `false` otherwise.


## License
This project is licensed under the [MIT License](https://github.com/alohabeach/CS50-Final-Project?tab=MIT-1-ov-file#).



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Bootstrap]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com

[p5js]: https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5.js&logoColor=FFFFFF
[p5js-url]: https://p5js.org

[Nodemon]: https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD
[Nodemon-url]: https://nodemon.io

[NodeJs]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[NodeJs-url]: https://nodejs.org/en