// Definitions
let form = document.querySelector("#user-search")
let openingForm = document.querySelector("#opening-search")
let userGames = document.querySelector("#user-games")
let userStats = document.querySelector("#user-stats")
let gameDisplay = document.querySelector("#game-details")
let toggle = document.querySelector("#toggle-form")

// Functions
function toggleForm(e) {
    if (e.target.textContent === 'Filter by Opening') {
        openingForm.className = 'visible'
        e.target.textContent = 'Collapse'
    } else if (e.target.textContent === 'Collapse') {
        openingForm.className = 'hidden'
        e.target.textContent = 'Filter by Opening'
    }
}

function searchUser(e) {
    e.preventDefault()

    userStats.innerHTML = ''
    userGames.innerHTML = ''
    gameDisplay.innerHTML = ''
    
    displayUserStats(e)
    displayUserGames(e)
    toggle.className = 'visible'

    form.reset()
}

function searchOpenings(e) {
    e.preventDefault()

    userGames.innerHTML = ''
    gameDisplay.innerHTML = ''

    displayUserOpenings(e)

    openingForm.reset()
}

function displayUserStats(e) {
    let username = e.target.querySelector('#username').value
    
    fetch(`https://lichess.org/api/user/${username}`, {
        method: 'GET',
        headers: {
            'Accept': "application/x-ndjson"
        }
    })
    .then(res => res.text())
    .then(body => {
        let str = "[" + body.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]"
        return JSON.parse(str)
    })
    .then(data => {
        
        let name = document.createElement('h2')
        let link = document.createElement('a')
        link.id = 'username-display'
        link.href = data[0].url
        link.textContent = data[0].username
        link.target = '_blank'

        name.append(link)

        let blitzRating = document.createElement('p')
        blitzRating.textContent = `Blitz Rating: ${data[0].perfs.blitz.rating}`

        let rapidRating = document.createElement('p')
        rapidRating.textContent = `Rapid Rating: ${data[0].perfs.rapid.rating}`

        let classicalRating = document.createElement('p')
        classicalRating.textContent = `Classical Rating: ${data[0].perfs.classical.rating}`

        let h3 = document.createElement('h3')
        h3.textContent = "Recent Games"

        userStats.append(name, blitzRating, rapidRating, classicalRating, h3)
    })
}

function displayUserGames(e) {
    let username = e.target.querySelector('#username').value
    fetch(`https://lichess.org/api/games/user/${username}?max=5`, {
        method: 'GET',
        headers: {
            'Accept': "application/x-ndjson"
        }
    })
    .then(res => res.text())
    .then(body => {
        let str = "[" + body.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]"
        return JSON.parse(str)
    })
    .then(games => {
        games.forEach(game => {
            let gameObj = {
                number: games.indexOf(game),
                winner: game.winner,
                whiteUser: game.players.white.user.name,
                blackUser: game.players.black.user.name,
                id: game.id
            }
            displayGame(gameObj)
        })
    })
}

function displayUserOpenings(e) {
    let username = document.querySelector('#username-display').textContent
    let color = document.querySelector('#color').value
    let play = document.querySelector('#play').value
    fetch(`https://explorer.lichess.ovh/player?player=${username}&color=${color}&play=${play}&recentGames=5`, {
        method: 'GET',
        headers: {
            'Accept': "application/x-ndjson"
        }
    })
    .then(res => res.text())
    .then(data => {
        let str = "[" + data + "]"
        return JSON.parse(str)
    })
    .then(array => {
        let h3 = document.createElement('h3')
        h3.textContent = "Recent Games"
        userGames.appendChild(h3)
        array[0].recentGames.forEach(game => {
            let gameObj = {
                number: array[0].recentGames.indexOf(game),
                winner: game.winner,
                whiteUser: game.white.name,
                blackUser: game.black.name,
                id: game.id
            }
            displayGame(gameObj)
        })  
    })
}

function displayGame(gameObj) {
    let result
    if (gameObj.winner === 'white') {
        result = '1-0'
    } else if (gameObj.winner === 'black') {
        result = '0-1'
    } else if (gameObj.winner === undefined || gameObj.winner === null) {
        result = '\u00BD - \u00BD'
    }

    let gameTitle = document.createElement('p')
    gameTitle.textContent = `${gameObj.whiteUser} vs. ${gameObj.blackUser} (${result})`
    userGames.appendChild(gameTitle)

    gameTitle.addEventListener('click', function () {
        gameDisplay.innerHTML = ''
        let display = document.createElement('iframe')
        display.src = `https://lichess.org/embed/game/${gameObj.id}?theme=auto&bg=auto`
        gameDisplay.appendChild(display)
    })

    if (gameObj.number === 0) {
        gameTitle.click()
        gameTitle.className = 'selected'
    }
}

function navigateGames(e) {
    let selected = document.querySelector('.selected')
    if (e.code === 'ArrowDown') {
        if (selected.nextSibling) {
            selected.className = ''
            selected.nextSibling.click()
            selected.nextSibling.className = 'selected'
        }
    } else if (e.code === 'ArrowUp') {
        if (selected.previousSibling) {
            selected.className = ''
            selected.previousSibling.click()
            selected.previousSibling.className = 'selected'
        } 
    }
}

// Event Listeners
form.addEventListener('submit', searchUser)
toggle.addEventListener('click', toggleForm)
openingForm.addEventListener('submit', searchOpenings)
document.addEventListener('keyup', navigateGames)
