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

// When called, this Function allows for text and the corresponding board layout to change when user clicks on the difficulty button. 
let diff = document.querySelector('#diff')
let diffIndex = 0
let difficulties = ['Easy', 'Medium', 'Hard']
let difficultyText
let newGame = document.querySelector('#new-game')

function switchDifficulty () {
    diffIndex = (diffIndex+1) % 3
    difficultyText = difficulties[diffIndex]
    diff.innerHTML = difficultyText
    populateTiles(diffIndex)
    memory = []
    future = []
}

////////////////////////////////////

// Function populates the tiles in the board with the corresponding difficulty selection. 

function populateTiles(diffIndex) {
  let tiles = document.querySelectorAll('.tile')
  tiles.forEach(function(_, n) {
      let tile = document.querySelector(`.tile#t${n} > span`)
      let number = boards[diffIndex][0][n]
      tile.innerHTML = number
      // Add any tiles with no value to a preset class. Class will be called upon in tile event listeners. 
      if (number != ' '){
          tile.classList.add('preset')
      } else {
          tile.classList.remove('preset')  
      } 
  })
}

populateTiles(0)

////////////////////////////////////

// Listen events for difficulty button and new game button

diff.addEventListener('click', function() {
  if (confirm('This action will start a new game with a different difficulty')) {
    switchDifficulty()
} else {
    switchDifficulty()
} 
})

newGame.addEventListener('click', function() {
if (confirm('This action will restart the game')) {
    populateTiles(diffIndex)
} else {
    populateTiles(diffIndex)
} 
})

////////////////////////////////////

//Tile click event listeners.

/* 
The forEach method is iterating through each tile adding a click event. 
When a tile is clicked, the code checks if the tile  does not contain a preset class in its inner span element.
If true, the code then checks if noting is false.
If true, code checks if chosen is not null. 
If conditions are met, code then does the following:
1. Stores the previous innerHTML span element in memory array
2. Sets the tile to chosen 
3. Calls the endGame function (which checks to see if conditions have been met for ending the game)
4. Removes any notes that might have been present in the tile
5. Checks if the user entered the correct number into the tile. If not, the error counter increments by 1. 
If noting is true, div element with class note n${chosen} and append the div element to the second inner span element of tile, 
and append the note to the inner span element in numerical order. If there is already a note with the same number, it will remove it.
*/

let memory = []
let errors = 0
let errorCounter = document.querySelector('#error > span')
let tiles = document.querySelectorAll('.tile')

tiles.forEach(function(tile) {
    tile.addEventListener('click', function(event) {
         if (!this.querySelector('span').classList.contains('preset')) {
            if (!noting) {
                if (chosen != null) {
                    let prev = this.querySelector('span').innerHTML
                    let id = this.id
                    memory.push({id, prev, chosen})
                    this.querySelector('span').innerHTML = chosen
                    endGame()
                    future = []
                    let span2 = this.querySelector('span:nth-child(2)')
                    span2.innerHTML = ''
                    let index = parseInt(this.id.substring(1))
                    let expected = boards[diffIndex][1][index]
                    if (chosen != expected) {
                        this.classList.add('incorrect')
                        errors += 1 
                        errorCounter.innerHTML = errors
                    }
                }
            } else {
                let span2 = this.querySelector('span:nth-child(2)')
                let existing = span2.querySelector(`.n${chosen}`)
                if (!existing) {
                    let div = document.createElement('div') 
                    div.className = `note n${chosen}`
                    div.innerHTML = chosen
                    span2.appendChild(div)
                    let numbers = [1,2,3,4,5,6,7,8,9]
                    numbers.forEach(function(n) {
                        let note = span2.querySelector(`.note.n${n}`)
                        if (note) {
                            span2.appendChild(note)
                        }
                    })
                } else {
                    existing.remove()
                }
            }
        }
    })
})

///////////////////////////////////////////

//Undo button

let future = []
let undo = document.querySelector('#undo')

undo.addEventListener('click', function(){
    let prev_action = memory.splice(-1)[0]
    if (isPaused) {
        return;
    }
    if (prev_action) {
        future.push(prev_action)
        let {id, prev} = prev_action
        let target = document.querySelector(`.tile#${id} > span`)
        target.innerHTML = prev
    } else {
        alert('Nothing to Undo!')
    }
})

// Redo button

let redo = document.querySelector('#redo')
redo.addEventListener('click', function(){
    let prev_action = future.splice(-1)[0]
    if (isPaused) {
        return;
    }
    if (prev_action) {
        memory.push(prev_action)
        let {id, chosen} = prev_action
        let target = document.querySelector(`.tile#${id} > span`)
        target.innerHTML = chosen
    } else {
        alert('Nothing to Redo!')
    }
})

/////////////////////////////////////////

// Digit buttons and Note buttons
let digits = document.querySelectorAll('#digits > .digit-btn:nth-child(n+2)')
let chosen = null
let reset = null

digits.forEach(function(digit) {
  digit.addEventListener('click', function() {
      if (isPaused) {
          return;
      }
      if (noting == false) {
          if (reset == this) {
              this.style.background = '#721200'
              chosen = null
              reset = null
          } else {
              if (reset) {
                  reset.style.background = '#721200'
              }
              chosen = this.innerHTML
              this.style.background = 'green'
              reset = this
          }
      } else {
          if (reset == this) {
              this.style.background = '#721200'
              reset = null
              chosen = null
          } else {
              if (reset) {
                  reset.style.background = '#721200'
              }
              chosen = this.innerHTML
              this.style.background = 'skyblue'
              reset = this
          }
      }
  })});

////////////////////////////////////////////
