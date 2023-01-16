////////////////////////////////////

// 3 premade board numbers to populate the board with. First line is unsolved, second line is filled in with all correct numbers.

let boards = [
  // Easy Board
    [
      "6      7     85 2      1   362    81  96     71  9 4 5 2   651   78    345       ",
      "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
    ],
  // Medium Board
    [
      "  9       4    6 758 31    15  4 36   6   4 8    9       75    3       1  2  3   ",
      "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
    ],
    // Hard Board
    [
      " 1 5       97 42    5    7 5   3   7 6  2 4    8  5   1 4      2 3     9 7    8  ",
      "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
    ]
]

////////////////////////////////////

// Function populates the tiles in the board with the corresponding difficulty selection. 

function populateTiles(diffIndex) {
  let tiles = document.querySelectorAll('.tile')
  tiles.forEach(function(_, n) {
      let tile = document.querySelector(`.tile#t${n} > span`)
      let number = boards[diffIndex][0][n]
      tile.innerHTML = number
      // Add any tiles with no value to a preset class. Class will be called upon later. 
      if (number != ' '){
          tile.classList.add('preset')
      } else {
          tile.classList.remove('preset')  
      } 
  })
}

////////////////////////////////////
