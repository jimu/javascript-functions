function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return x == j && y == k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  for (const e of this)
    if (e[0] == cell[0] && e[1] == cell[1])
      return true;
  return false;
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const printCellX = (cell, state) => {
  return contains.call(state, cell) ? 'X' : '-';
};

const corners = (state = []) => {

  if (state.length == 0)
    return {topRight: [0,0], bottomLeft: [0,0]}

  minX = minY = Number.MAX_SAFE_INTEGER;
  maxX = maxY = Number.MIN_SAFE_INTEGER;

  for (const e of state) {
    if (e[0] < minX) minX = e[0];
    if (e[0] > maxX) maxX = e[0];
    if (e[1] < minY) minY = e[1];
    if (e[1] > maxY) maxY = e[1];
  }

  return {topRight: [maxX, maxY], bottomLeft: [minX, minY]}

};

const printCellsX = (state) => {

  const {topRight, bottomLeft} = corners(state);
  const [minX, minY] = bottomLeft;
  const [maxX, maxY] = topRight;

  var output = "";

  for (var y = maxY; y >= minY; --y)
  {
    for (var x = minX; x <= maxX; ++x)
      output += printCellX([x,y], state);
    
    output += "\n";
  }
  return output;
};

const printCells = (state) => {

  const {topRight, bottomLeft} = corners(state);
  const [minX, minY] = bottomLeft;
  const [maxX, maxY] = topRight;

  var output = "";

  for (var y = maxY; y >= minY; --y)
  {
    for (var x = minX; x <= maxX; ++x)
      output += printCell([x,y], state);
    
    output += "\n";
  }
  return output;
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x-1, y-1], [x, y-1], [x+1, y-1],
    [x-1, y  ],           [x+1, y  ],
    [x-1, y+1], [x, y+1], [x+1, y+1],
  ];
};

const getLivingNeighbors_old = (cell, state) => {
  var living = [];
  for (const e of getNeighborsOf(cell))
    if (contains.call(state, e))
      living.push(e);
  return living;
};

const getLivingNeighbors = (cell, state) => {
  var living = [];
  for (const e of getNeighborsOf(cell))
    if (contains.bind(state)(e))
      living.push(e);
  return living;
};

const willBeAlive = (cell, state) => {
  const numNeighbors = getLivingNeighbors(cell, state).length;

  return numNeighbors == 3 ||
         numNeighbors == 2 && contains.call(state, cell);
};

const calculateNext = (state) => {
  const {topRight, bottomLeft} = corners(state);
  const minX = bottomLeft[0] - 1;
  const minY = bottomLeft[1] - 1;
  const maxX = topRight[0] + 1;
  const maxY = topRight[1] + 1;

  var newState = [];

  for (var y = maxY; y >= minY; --y)
    for (var x = minX; x <= maxX; ++x)
      if (willBeAlive([x, y], state))
        newState.push([x, y]);

  return newState;
};

const iterate = (state, iterations) => {
  var states = [state];

  while (iterations--)
    states.push(state = calculateNext(state));

  return states;
};


function output(state) {
  console.log(printCells(state) + "\n");
}


const main = (pattern, iterations) => {
  state = startPatterns[pattern];

  output(state);

  while (iterations--)
    output(state = calculateNext(state));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;
