/*
Gordon McCreary
Winter 2020
agent.js

This is the code that decides what move Agent Pac-Man should make.
*/



/** This gameboard contains the current state of the game. */
var GAMEBOARD = [];

/** The amount of distance that Pac-Man will try to stay away from ghosts. */
var ghostAvoidDistance = 2;

/** Pac-Man's current position. */
var pacPos;


/**
 * This function is called by the game, allowing Pac-Man to make a move.
 */
function selectMove() {

  // Make sure the game is running.
  if (!PACMAN_DEAD && !GAMEOVER) {

    // Set result to nearest bubble.
    buildGameboard();
    var result = findBubble(pacPos);

    // If there is fruit and all ghosts are scared, get fruit.
    if (FRUIT_CANCEL_TIMER !== null
    && GHOST_INKY_STATE !== 0
    && GHOST_PINKY_STATE !== 0
    && GHOST_BLINKY_STATE !== 0
    && GHOST_CLYDE_STATE !== 0) {

      // If path to fruit is found, set result to that path.
      buildGameboard();
      let fR = findFruit(pacPos);
      if (fR !== null) result = fR;

    } 

    // If result, do result.
    if (result !== null) {

      movePacman(result);
      ghostAvoidDistance = 2;

    // If no result, try to stay alive.
    } else {

      // Allow Pac-Man near ghosts and start to stutter.
      if (ghostAvoidDistance > 0) ghostAvoidDistance--;
      movePacman(((PACMAN_DIRECTION + 1) % 4) + 1);

    }
  }
};


/**
 * Finds a safe path to the nearest bubble if it exists.
 * 
 * @param {object} origin Pac-Man's current position where the 'x' attribute is
 * his x position, while the 'y' attribute is his y position.
 * @returns {*} Returns the path if found, null otherwise.
 */
function findBubble(origin) {

  // Queue used for breadth-first search.
  let searchQueue = new Queue();
  searchQueue.enqueue(origin);

  // The amount of room Pac-Man has.
  let room = 0;

  // While there are unsearched game board cells.
  while (searchQueue.size > 0) {

    // The current game board cell being searched.
    let curCell = searchQueue.dequeue();

    // If there is a bubble, go that way.
    if (!GAMEBOARD[curCell.x][curCell.y].eaten
    && (GAMEBOARD[curCell.x][curCell.y].bubble
      || GAMEBOARD[curCell.x][curCell.y].superBubble)) {

      return curCell.path[0];
    }

    // If no bubble found but there is room, go that way.
    if (searchQueue.size === 0 && room > 0) {
      return curCell.path[0];
    }

    /*
    Check all 4 directions from current cell.
    */

    //Check up.
    if (curCell.y - 1 >= 0
    && GAMEBOARD[curCell.x][curCell.y - 1] !== null
    && !GAMEBOARD[curCell.x][curCell.y - 1].searched) {

      if (ghostFriendly(curCell.x, curCell.y - 1, ghostAvoidDistance)) {
        GAMEBOARD[curCell.x][curCell.y - 1].searched = true;
        let newPath = shallowCopy(curCell.path);
        newPath.push(4);
        room++;
        searchQueue.enqueue({x: curCell.x, y: curCell.y - 1, path: newPath});
      }
    }

    // Check down.
    if (curCell.y + 1 < 29
    && GAMEBOARD[curCell.x][curCell.y + 1] !== null
    && !GAMEBOARD[curCell.x][curCell.y + 1].searched) {

      if (ghostFriendly(curCell.x, curCell.y + 1, ghostAvoidDistance)) {
        GAMEBOARD[curCell.x][curCell.y + 1].searched = true;
        let newPath = shallowCopy(curCell.path);
        newPath.push(2);
        room++;
        searchQueue.enqueue({x: curCell.x, y: curCell.y + 1, path: newPath});
      }
    }

    // Check right.
    if (curCell.x + 1 < 26
    && GAMEBOARD[curCell.x + 1][curCell.y] !== null
    && !GAMEBOARD[curCell.x + 1][curCell.y].searched) {

      if (ghostFriendly(curCell.x + 1, curCell.y, ghostAvoidDistance)) {
        GAMEBOARD[curCell.x + 1][curCell.y].searched = true;
        let newPath = shallowCopy(curCell.path);
        newPath.push(1);
        room++;
        searchQueue.enqueue({x: curCell.x + 1, y: curCell.y, path: newPath});
      }
    }

    // Check left.
    if (curCell.x - 1 >= 0
    && GAMEBOARD[curCell.x - 1][curCell.y] !== null
    && !GAMEBOARD[curCell.x - 1][curCell.y].searched) {

      if (ghostFriendly(curCell.x - 1, curCell.y, ghostAvoidDistance)) {
        GAMEBOARD[curCell.x - 1][curCell.y].searched = true;
        let newPath = shallowCopy(curCell.path);
        newPath.push(3);
        room++;
        searchQueue.enqueue({x: curCell.x - 1, y: curCell.y, path: newPath});
      }
    }

  }

  // Return null if no path.
  return null;
}


/**
 * Checks if a space is ghost friendly.
 * 
 * @param {number} x The x position of the space being checked.
 * @param {number} y The y position of the space being checked.
 * @param {number} distance The distance that is considered to be safe.
 * @returns {boolean} True if the space is ghost friendly.
 */
function ghostFriendly(x, y, distance) {

  result = true;

  // Check if space is safe from Inky.
  if (GHOST_INKY_STATE === 0) { // STATE OF 0 IS DANGER
    let g = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
    result = Math.abs(x - g.x) + Math.abs(y - g.y) > distance;
  }

  // Check if space is safe from Pinky.
  if (result && GHOST_PINKY_STATE === 0) {
    let g = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
    result = Math.abs(x - g.x) + Math.abs(y - g.y) > distance;
  }

  // Check if space is safe from Blinky.
  if (result && GHOST_BLINKY_STATE === 0) {
    let g = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
    result = Math.abs(x - g.x) + Math.abs(y - g.y) > distance;
  }

  // Check if space is safe from Clyde.
  if (result && GHOST_CLYDE_STATE === 0) {
    let g = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
    result = Math.abs(x - g.x) + Math.abs(y - g.y) > distance;
  }

  return result;
}


/**
 * Finds a safe path to the nearest fruit if it exists.
 * 
 * @param {object} origin Pac-Man's current position where the 'x' attribute is
 * his x position, while the 'y' attribute is his y position.
 * @returns {*} Returns the path if found, null otherwise.
 */
function findFruit(origin) {

  // The position of the fruit.
  let fruitPos = getXY(FRUITS_POSITION_X, FRUITS_POSITION_Y);

  // The queue to be used in breadth-first search.
  let searchQueue = new Queue();
  searchQueue.enqueue(origin);

  // While there are unsearched game board cells.
  while (searchQueue.size > 0) {

    // The current game board cell being searched.
    let curCell = searchQueue.dequeue();

    // Check for fruit
    if (curCell.x === fruitPos.x && curCell.y === fruitPos.y) {
      return curCell.path[0];
    }

    /*
    Check all 4 directions from current cell.
    */

    //Check up.
    if (curCell.y - 1 >= 0
    && GAMEBOARD[curCell.x][curCell.y - 1] !== null
    && !GAMEBOARD[curCell.x][curCell.y - 1].searched) {

      GAMEBOARD[curCell.x][curCell.y - 1].searched = true;
      let newPath = shallowCopy(curCell.path);
      newPath.push(4);
      searchQueue.enqueue({x: curCell.x, y: curCell.y - 1, path: newPath});
    }

    // Check down.
    if (curCell.y + 1 < 29
    && GAMEBOARD[curCell.x][curCell.y + 1] !== null
    && !GAMEBOARD[curCell.x][curCell.y + 1].searched) {

      GAMEBOARD[curCell.x][curCell.y + 1].searched = true;
      let newPath = shallowCopy(curCell.path);
      newPath.push(2);
      searchQueue.enqueue({x: curCell.x, y: curCell.y + 1, path: newPath});
    }

    // Check right.
    if (curCell.x + 1 < 26
    && GAMEBOARD[curCell.x + 1][curCell.y] !== null
    && !GAMEBOARD[curCell.x + 1][curCell.y].searched) {

      GAMEBOARD[curCell.x + 1][curCell.y].searched = true;
      let newPath = shallowCopy(curCell.path);
      newPath.push(1);
      searchQueue.enqueue({x: curCell.x + 1, y: curCell.y, path: newPath});
    }

    // Check left.
    if (curCell.x - 1 >= 0
    && GAMEBOARD[curCell.x - 1][curCell.y] !== null
    && !GAMEBOARD[curCell.x - 1][curCell.y].searched) {

      GAMEBOARD[curCell.x - 1][curCell.y].searched = true;
      let newPath = shallowCopy(curCell.path);
      newPath.push(3);
      searchQueue.enqueue({x: curCell.x - 1, y: curCell.y, path: newPath});
    }

  }
  return null;
}


/**
 * Queue data structure.
 */
class Queue {

  /**
   * Default constructor.
   */
  constructor() {
    this._q = [];
    this._f = 0;
    this._size = 0;
  }

  /**
   * Adds item to the queue.
   * @param {*} item The item to be enqueued.
   */
  enqueue(item) {
    this._size++;
    this._q.push(item);
  }

  /**
   * Removes an item from the queue.
   * @returns {*} The item that was dequeued.
   */
  dequeue() {
    this._size--;
    return this._q[this._f++];
  }

  /**
   * @returns {int} The current size of the queue.
   */
  get size() {
    return this._size;
  }

}


/**
 * Help function to create shallow copy of list.
 * @param {*} list The list to be shallow copied.
 * @returns {*} A shallow copy of list.
 */
function shallowCopy(list) {

  let result = [];
  list.forEach((element) => {
      result.push(element);
  });
  return result;
}


/**
 * Helper function to translate game coordinates from the clone to our game
 * board.
 * @param {number} x The x coordinate from the Pac-Man clone.
 * @param {number} y The y coordinate from the Pac-Man clone.
 * @returns {object} The newcoordinates for our game board where attribute 'x'
 * is the new x coordinate and attribute 'y' is the new y coordinate.
 */
function getXY(x, y) {

  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);
  return {x: i, y: j}
}


/**
 * Constructs the game board based on the current game state.
 */
function buildGameboard() {

  // Clear the game board.
  GAMEBOARD = [];
  for (var i = 0; i < 26; i++) {
    GAMEBOARD.push([]);
    for (var j = 0; j < 29; j++) {
      GAMEBOARD[i].push({
        bubble: false,
        superBubble: false,
        inky: false,
        pinky: false,
        blinky: false,
        clyde: false,
        pacman: false,
        eaten: false,
        searched: false,
        path: []
      });
    }
  }

  // Mark all bubble positions.
  for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
    var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
    var y = parseInt(bubbleParams[1]) - 1;
    var x = parseInt(bubbleParams[2]) - 1;
    var type = bubbleParams[3];
    var eaten = parseInt(bubbleParams[4]);
    if (type === "b") {
      GAMEBOARD[x][y].bubble = true;
    } else {
      GAMEBOARD[x][y].superBubble = true;
    }
    if (eaten === 0) {
      GAMEBOARD[x][y].eaten = false;
    } else {
      GAMEBOARD[x][y].eaten = true;
    }
  }

  // Mark all non bubbles as null.
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 29; j++) {
      if (!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble) {
          GAMEBOARD[i][j] = null;
      }
    }
  }

  // Set non-bubble playable areas as valid positions.
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 29; j++) {
      if ((i === 0 && (j === 13))
      || (i === 1 && (j === 13))
      || (i === 2 && (j === 13))
      || (i === 3 && (j === 13))
      || (i === 4 && (j === 13))
      || (i === 6 && (j === 13))
      || (i === 7 && (j === 13))
      || (i === 8 && (j >= 10 && j <= 18))
      || (i === 9 && (j === 10 || j === 16))
      || (i === 10 && (j === 10 || j === 16))
      || (i === 11 && (((j >= 8) && (j <= 10)) || j === 16))
      || (i === 12 && (j === 10 || j === 16))
      || (i === 13 && (j === 10 || j === 16))
      || (i === 14 && (((j >= 8) && (j <= 10)) || j === 16))
      || (i === 15 && (j === 10 || j === 16))
      || (i === 16 && (j === 10 || j === 16))
      || (i === 17 && (j >= 10 && j <= 18))
      || (i === 18 && (j === 13))
      || (i === 19 && (j === 13))
      || (i === 21 && (j === 13))
      || (i === 22 && (j === 13))
      || (i === 23 && (j === 13))
      || (i === 24 && (j === 13))
      || (i === 25 && (j === 13)))  {
        
        GAMEBOARD[i][j] = {
          bubble: false,
          superBubble: false,
          inky: false,
          pinky: false,
          blinky: false,
          clyde: false,
          pacman: false,
          eaten: false,
          searched: false,
          path: []
        };
      }
    }
  }  

  // Mark Inky's position.
  var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].inky = true;
  }

  // Mark Pinky's position.
  p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].pinky = true;
  }

  // Mark Blinky's position.
  p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].blinky = true;
  }

  // Mark Clyde's position.
  p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    GAMEBOARD[p.x][p.y].clyde = true;
  }

  // Mark Pac-Man's position.
  p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) {
    pacPos = {x: p.x, y: p.y, path: []};
    GAMEBOARD[p.x][p.y].pacman = true;
  }

};