// 3 premade board numbers to populate the board with. First line is unsolved, second line is filled in with all correct numbers.

let boards = [
  // easy Board
    [
      "6      7     85 2      1   362    81  96     71  9 4 5 2   651   78    345       ",
      "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
    ],
  // medium Board
    [
      "  9       4    6 758 31    15  4 36   6   4 8    9       75    3       1  2  3   ",
      "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
    ],
    // hard Board
    [
      " 1 5       97 42    5    7 5   3   7 6  2 4    8  5   1 4      2 3     9 7    8  ",
      "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
    ]
]

 
let diff = document.querySelector('#diff')
let diffIndex = 0
let difficulties = ['Easy', 'Medium', 'Hard']
let difficultyText
let newGame = document.querySelector('#new-game')

// when called, this Function allows for text and the corresponding board layout to change when user clicks on the difficulty button.
// the memory and future arrays are reset when function is called.
function switchDifficulty () {
    diffIndex = (diffIndex+1) % 3
    difficultyText = difficulties[diffIndex]
    diff.innerHTML = difficultyText
    populateTiles(diffIndex)
    memory = []
    future = []
}

// function populates the tiles in the board with the corresponding difficulty selection. 
function populateTiles(diffIndex) {
  let tiles = document.querySelectorAll('.tile')
  tiles.forEach(function(_, n) {
      let tile = document.querySelector(`.tile#t${n} > span`)
      let number = boards[diffIndex][0][n]
      tile.innerHTML = number
      // add any tiles with no value to a preset class. Class will be called upon in tile event listeners. 
      if (number != ' '){
          tile.classList.add('preset')
      } else {
        // when a new game begins the tile is checked again and preset removed if tile has no number.
          tile.classList.remove('preset')  
      } 
  })
}

populateTiles(0)

// listen event for difficulty button.
diff.addEventListener('click', function() {
  if (confirm('This action will start a new game with a different difficulty')) {
    switchDifficulty()
    timerReset()
    errorReset()
    endGame() 
    notesReset()
}
})

// listen event for new game button.
// the memory and future arrays are reset when function is called.
newGame.addEventListener('click', function() {
if (confirm('This action will restart the game')) {
    populateTiles(diffIndex)
    timerReset() 
    errorReset()
    endGame() 
    notesReset()
    memory = []
    future = []
}
})

let memory = []
let errors = 0
let errorCounter = document.querySelector('#error > span')
let tiles = document.querySelectorAll('.tile')

//tileClick function checks a series of conditions to prevent certain actions from taking place.
function tileClick(event) {
    let tile = event.currentTarget
    let span = tile.querySelector('span')
    let span2 = tile.querySelector('span:nth-child(2)')

// isPaused: If game is paused no values can be entered onto the board
// (span.classList.contains('preset'): If a tile contains a 'preset' number then user cannot overwrite it or insert a note
// chosen === null: If user has no number selected but clicks on a tile with a a value, this code then prohibits the user from replacing a number on the board with an empty value
// span.innerHTML === chosen: This prohibits duplicate entries into a tile. 
    if (isPaused || (span.classList.contains('preset') || chosen === null || span.innerHTML === chosen)) {
        return;
    }
    if (noting) {
        // if notes has been turned on then note function is triggered i.e allows notes to be entered onto board.
        noteMode(span2);
    } else {
        // if all conditions are met, number is entered into the board and stored in game memory should undo/redo functions be used by user.
        gameMemory(span, tile);
        
    }
}

// tileClick event listener.
tiles.forEach(function(tile) {
    tile.addEventListener('click', tileClick)
})

// noteMode function allows the user to enter notes onto the board to aid them to complete the game
function noteMode(span2) {
    let existing = span2.querySelector(`.n${chosen}`)
    // if a note is not already present in a tile then the number chosen by the user is entered into the board in note format.
    if (!existing) {
        let div = document.createElement('div')
        div.className = `note n${chosen}`
        div.innerHTML = chosen
        span2.appendChild(div)
        let numbers = [1,2,3,4,5,6,7,8,9]
        // if a note doesn't already exist then the number is entered into the board. If there number is already present, it is removed.
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

// gameMemory function records the number entered onto the board by the user for use with undo and redo functions.
function gameMemory(span, tile) {
    let prev = span.innerHTML
    let id = tile.id
    memory.push({id, prev, chosen})
    span.innerHTML = chosen
    // checks to see if end game conditions have been met.
    endGame()
    let span2 = tile.querySelector('span:nth-child(2)')
    span2.innerHTML = ''
    let index = parseInt(tile.id.substring(1))
    let expected = boards[diffIndex][1][index]
    // if number entered does not match the expected number i.e correct number then an error is recorded.
    if (chosen != expected) {
        tile.classList.add('incorrect')
        errors += 1
        errorCounter.innerHTML = errors
        }
}

// error reset function returns the error counter to zero when called (when new game begins)
function errorReset() {
    errors = 0
    document.querySelector("#error > span").innerHTML = errors
  }

// function removes all notes from the board when called.
function notesReset() {
    tiles = document.querySelectorAll('.tile')
    tiles.forEach(function(note) {
        note = document.querySelector('.note')
        if (note) {
            note.remove()
        }
    })
}

//undo button.
let future = []
let undo = document.querySelector('#undo')

// if clicked first action is to check if game is paused.
// next action is to push the number into the array to be stored. tile location is recorded.
// if nothing can be undone then user is alerted.
undo.addEventListener('click', function(){
    if (isPaused) {
        return
    }
    let prev_action = memory.splice(-1)[0]
    if (prev_action) {
        future.push(prev_action)
        let {id, prev} = prev_action
        let target = document.querySelector(`.tile#${id} > span`)
        target.innerHTML = prev
    } else {
        alert('Nothing to Undo!')
    }
})

// redo button
let redo = document.querySelector('#redo')

// if clicked first action is to check if game is paused.
// next action is to recall the number in the array and is placed in the corresponding tile.
// if nothing can be redone then user is alerted.
redo.addEventListener('click', function(){
    if (isPaused) {
        return
    }
    let prev_action = future.splice(-1)[0]
    if (prev_action) {
        memory.push(prev_action)
        let {id, chosen} = prev_action
        let target = document.querySelector(`.tile#${id} > span`)
        target.innerHTML = chosen
    } else {
        alert('Nothing to Redo!')
    }
})

// timer function
let time = document.querySelector('#timer > span')
let timer = document.querySelector('#timer')
let seconds = 0
let minutes = 0
let timing = 0

// timerIncrement function is called straight away and starts the timer.
function timerIncrement() {
    timing = setInterval(function () {
        seconds++
        if (seconds >= 60) {
            seconds = 0
            minutes += 1
        }
        time.innerHTML = `${minutes}:${String(seconds).padStart(2, '0')}`
    }, 1000)
}
timerIncrement()

// timer reset function resets the timer when function is called.
function timerReset() {
    seconds = -1
    minutes = 0
    time.innerHTML = `0:00`
}

// event listener for timer button
// when clicked game is paused.
// when clicked again timer continues
timer.addEventListener("click", function () {
    if (timing) {
        clearInterval(timing)
        timing = null
        time.innerHTML = "||"
    } else {
        timerIncrement()
    }
})

// pause event listener
let isPaused = false

// when game is paused or unpaused the user is alerted.
timer.addEventListener('click', function() {
    isPaused = !isPaused
    if(isPaused == true) {
        alert('The game is paused. You will not be able to place numbers on the board or use the undo/redo buttons')
    } if (isPaused == false){
        alert('The game is now unpaused')
    }
})

// digit buttons: are the number buttons on the right handside of the game board
let digits = document.querySelectorAll('#digits > .digit-btn:nth-child(n+2)')
let chosen = null
let reset = null
let noting = false

// function to handle the user clicking on the digit buttons
// first action is to check if game is paused
// next action uses the reset digit function which turns the background color red to show it is not selected.
function digitClick(event) {
    if (isPaused) return
    if (reset === event.currentTarget) {
        resetDigit()
    } else {
        // digit button turns green when clicked to show it is active
        resetDigit()
        chosen = event.currentTarget.innerHTML
        event.currentTarget.style.background = 'green'
        reset = event.currentTarget
    }
}
// function designed to return the button to red background instead of green if clicked again
function resetDigit() {
    if (reset) {
        reset.style.background = '#721200'
        reset = null
        chosen = null
    }
}

// event listener for digitClick
digits.forEach(digit => {
    digit.addEventListener('click', digitClick)
})

// turn active class on or off for tiles if clicked. 
let notes = document.querySelector('#notes')
notes.addEventListener('click', function(){
    noting = !noting
    notes.classList.toggle('active')
})

//auto solve function
let autoSolve = document.querySelector('#auto-solve')

// event listener looks for click on autosolve button. 
// when called the event triggers the alert and if confirmed, populates the board with all numbers.
// user is presented with another alert once action is confirmed.
autoSolve.addEventListener('click', function(){
    if (confirm('This action will reveal all answers and end the game')) {
            let answers = boards[diffIndex][1].split('')
            answers.forEach(function(answer, n){
                let solve = document.querySelector(`#t${n} > span`) 
                solve.innerHTML = answer
            } 
            ) 
            alert('Better luck next time. Click New Game or Difficulty buttons to have another go!')
    }})

// how to play button
let playBtn = document.querySelector('#how-to-play')
// presents the user with an alert when the button is clicked.
function howToPlayBtn() {
    playBtn.addEventListener('click', function() {
       if (confirm('You are about to leave this page so any progress you have made will be lost')) {
        location.assign("index.html")
       }
    })
}
howToPlayBtn()

// music button
let audio = new Audio('assets/audio/audio.mp3')
audio.loop = true
let playPauseBtn = document.querySelector('#audio-btn')
let count = 0

// function listens for click on music button
// when clicked music begins
// when clicked again music is paused
function playPause() {
    playPauseBtn.addEventListener('click', function() {
        if (count == 0) {
            count = 1        
            audio.play()
            playPauseBtn.innerHTML = 'Pause Music'
            
        } else {
            count = 0
            audio.pause()
            playPauseBtn.innerHTML = 'Play Music'
        } 
    })
}
 
playPause()


// completed game conditions
// function endGame checks to see if all tiles are still empty.
// if not then function is triggered
// function then checks if the tile values match the expect values i.e correct numbers. 
// if it does then user is congratulated, if not then user is told game over.
function endGame() {
  let allFilled = true
  let allCorrect = true
  tiles.forEach(function(tile) {
      let index = parseInt(tile.id.substring(1))
      let expected = boards[diffIndex][1][index]
      let value = tile.querySelector('span').innerHTML
      if (value === ' ') {
          allFilled = false
      } else {
          if (value !== expected) {
              allCorrect = false
          }
      }
  })
  if (allFilled) {
      if (allCorrect) {
          alert(`Congratulations! You have completed this game of Sudoku!! You completed the ${diff.innerHTML} setting in ${time.innerHTML} with ${errors} errors.`)
      } else {
          alert(`Game Over. You have not been successful on this occasion. Try starting a new game or changing the difficulty level.`)
      }
  }
}       