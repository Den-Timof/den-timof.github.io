const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

// const wordle = "SUPER"
const wordle = "ВЕТКА"

// const keys = [
// 	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'ВВОД', 'СТЕРЕТЬ'
// ]
const keys = [
	'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я', 'ВВОД', 'СТЕРЕТЬ'
]

const guessRows = [
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

guessRows.forEach((guessRow,guessRowIndex) => {
	const rowElement = document.createElement('div')
	rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
	guessRow.forEach((guess, guessIndex) => {
		const tileElement = document.createElement('div')
		tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
		tileElement.classList.add('tile')
		rowElement.append(tileElement)
	})
	tileDisplay.append(rowElement)
})



keys.forEach(key => {
	const buttonElement = document.createElement('button')
	buttonElement.textContent = key
	buttonElement.setAttribute('id', key)
	buttonElement.addEventListener('click', () => handlerClick(key))
	keyboard.append(buttonElement)
})

const handlerClick = (letter) => {
	console.log('clicked', letter)
	if(letter === 'СТЕРЕТЬ') {
		deleteLetter()
		console.log('guessRows', guessRows);
		return
	}
	if(letter === 'ВВОД') {
		checkRow()
		console.log('guessRows', guessRows);
		return
	}
	
	addLetter(letter)
	console.log('guessRows', guessRows);
}

const addLetter = (letter) => {
	if(currentTile < 5 && currentRow < 6) {
		const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
		tile.textContent = letter
		guessRows[currentRow][currentTile] = letter
		tile.setAttribute('data', letter)
		currentTile++
	}
}

const deleteLetter = (letter) => {
	if( currentTile > 0 ) {
		currentTile--
		const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
		tile.textContent = ''
		guessRows[currentRow][currentTile] = ''
		tile.setAttribute('data', '')
	}
}

const checkRow = () => {
	const guess = guessRows[currentRow].join('')

	if(currentTile > 4) {
		console.log('guess is ' + guess, 'wordle is ' + wordle);
		flipTile()
		if(wordle == guess) {
			showMessage('Magnificent!')
			isGameOver = true
			return
		} else {
			if(currentRow >= 5) {
				isGameOver = false
				showMessage('Game Over')
				return
			}
			if(currentRow < 5) {
				currentRow++
				currentTile = 0
			}
		}
	}
}

const showMessage = (message) => {
	const messageElement = document.createElement('p')
	messageElement.textContent = message
	messageDisplay.append(messageElement)
	setTimeout(() => messageDisplay.removeChild(messageElement), 2000)
}

const addColorToKey = (keyLetter, color) => {
	const key = document.getElementById(keyLetter)
	key.classList.add(color)
}

const flipTile = () => {
	const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
	let checkWordle = wordle
	const guess = []

	rowTiles.forEach(tile => {
		guess.push({
			letter: tile.getAttribute('data'), 
			color: 'grey-overlay'
		})
	})

	guess.forEach((guess, index) => {
		if(guess.letter == wordle[index]) {
			guess.color = 'green-overlay'
			checkWordle = checkWordle.replace(guess.letter, '')
		}
	})

	guess.forEach(guess => {
		if(checkWordle.includes(guess.letter)) {
			guess.color = 'yellow-overlay'
			checkWordle = checkWordle.replace(guess.letter, '')
		}
	})

	console.log('guess', guess);

	rowTiles.forEach((tile, index) => {
		setTimeout(() => {
			tile.classList.add('flip')
			tile.classList.add(guess[index].color)
			addColorToKey(guess[index].letter, guess[index].color)
		}, 500 * index);
	})
}