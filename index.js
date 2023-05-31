// Declarations
let form = document.querySelector("#user-search")
let errorBox = document.querySelector('#error')
let userInfo = document.querySelector("#user-info")
let userLink = document.querySelector('#username-link')
let userStats = document.querySelector("#user-stats")
let userGames = document.querySelector("#user-games")
let gamesErrorBox = document.querySelector('#games-error')
let clearFilterButton = document.querySelector('#clear-filter')
let toggle = document.querySelector("#toggle-form")
let openingForm = document.querySelector("#opening-search")
let gameDisplay = document.querySelector("#game-details")

// Event Listeners
form.addEventListener('submit', searchUser)
document.addEventListener('keyup', navigateGames)
toggle.addEventListener('click', toggleForm)
openingForm.addEventListener('submit', searchOpenings)
clearFilterButton.addEventListener('click', listUserGames)
window.addEventListener("keydown", preventScrolling)

// Callbacks
function searchUser(e) {
    e.preventDefault()
    
    displayUserStats(e)
    listUserGames(e)

    form.reset()
}

function searchOpenings(e) {
    e.preventDefault()

    listGamesByOpening()

    openingForm.reset()
}

function displayUserStats(e) {
    clearUserInfo()

    let username = e.target.querySelector('#username').value
    
    fetch(`https://lichess.org/api/user/${username}`, {
        headers: {
            'Accept': "application/json"
        }
    })
    .then(res => res.json())
    .then(user => {
        let name = document.createElement('h2')
        let link = document.createElement('a')
        link.id = 'username-display'
        link.href = user.url
        link.textContent = user.username
        link.target = '_blank'

        name.append(link)
        userLink.append(name)

        let ratingsHeader = document.createElement('h3')
        ratingsHeader.textContent = 'Ratings'

        let ratingsList = document.createElement('ul')

        let hasRating = false

        if (user.perfs.bullet.games > 0) {
            let bulletRating = document.createElement('li')
            bulletRating.textContent = `Bullet: ${user.perfs.bullet.rating}`
            ratingsList.append(bulletRating)
            hasRating = true
        }

        if (user.perfs.blitz.games > 0) {
            let blitzRating = document.createElement('li')
            blitzRating.textContent = `Blitz: ${user.perfs.blitz.rating}`
            ratingsList.append(blitzRating)
            hasRating = true
        }

        if (user.perfs.rapid.games > 0) {
            let rapidRating = document.createElement('li')
            rapidRating.textContent = `Rapid: ${user.perfs.rapid.rating}`
            ratingsList.append(rapidRating)
            hasRating = true
        }

        if (user.perfs.classical.games > 0) {
            let classicalRating = document.createElement('li')
            classicalRating.textContent = `Classical: ${user.perfs.classical.rating}`
            ratingsList.append(classicalRating)
            hasRating = true
        }

        if (user.perfs.correspondence.games > 0) {
            let correspondenceRating = document.createElement('li')
            correspondenceRating.textContent = `Correspondence: ${user.perfs.correspondence.rating}`
            ratingsList.append(correspondenceRating)
            hasRating = true
        }

        if (user.perfs.puzzle) {
            if (user.perfs.puzzle.games > 0) {
                let puzzleRating = document.createElement('li')
                puzzleRating.textContent = `Puzzles: ${user.perfs.puzzle.rating}`
                ratingsList.append(puzzleRating)
                hasRating = true
            }
        }

        if (hasRating === true) {
            userStats.append(ratingsHeader, ratingsList)
            toggle.className = 'visible'
        }

        userInfo.className = 'visible'  
    })
    .catch(() => {
        errorBox.textContent = `It looks like ${username} doesn't like to play chess.`
        errorBox.className = 'visible'
    })
}

function listUserGames(e) {
    clearGames()
    if (toggle.textContent === 'Hide Filter') {
        toggleForm()
    }

    let username
    if (e.type === 'submit') {
        username = e.target.querySelector('#username').value
    } else if (e.type === 'click') {
        username = document.querySelector('#username-display').textContent
    }

    fetch(`https://lichess.org/api/games/user/${username}?max=8`, {
        headers: {
            'Accept': "application/x-ndjson"
        }
    })
    .then(res => res.text())
    .then(data => {
        return data.trim().split('\n').map(game => JSON.parse(game))
    })
    .then(games => {
        games.forEach(game => {
            if (game.players.white.user && game.players.black.user) {
                let gameObj = {
                    number: games.indexOf(game),
                    winner: game.winner,
                    whiteUser: game.players.white.user.name,
                    blackUser: game.players.black.user.name,
                    id: game.id
                }
                displayGame(gameObj)
            }
        })
    })
    .catch(() => {
        gamesErrorBox.textContent = `${username} has not played any games.`
        gamesErrorBox.className = 'visible'
    })
}

function listGamesByOpening() {
    clearGames()
    toggleForm()

    let username = document.querySelector('#username-display').textContent
    let color = document.querySelector('#color').value
    let play = document.querySelector('#play').value
    
    fetch(`https://explorer.lichess.ovh/player?player=${username}&color=${color}&play=${play}&recentGames<=8`, {
        headers: {
            'Accept': "application/nd-json"
        }
    })
    .then(readStream(data => {
        let openingTitle = document.createElement('h4')
        openingTitle.textContent = `Opening: The ${data.opening.name}`

        let openingSubtitle = document.createElement('h5')
        openingSubtitle.textContent = `${username} with the ${color} pieces`

        userGames.append(openingTitle, openingSubtitle)

        if (data.recentGames.length > 0) {
            data.recentGames.forEach(game => {
                let gameObj = {
                    number: data.recentGames.indexOf(game),
                    winner: game.winner,
                    whiteUser: game.white.name,
                    blackUser: game.black.name,
                    id: game.id
                }
                displayGame(gameObj)
            })
        } else { 
            gamesErrorBox.textContent = `${username} has not played the ${data.opening.name} with the ${color} pieces.`
            gamesErrorBox.className = 'visible'
        }

        clearFilterButton.className = 'visible'
    }))
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

        let header = document.createElement('h2')
        header.textContent = gameTitle.textContent

        let iframe = document.createElement('iframe')
        iframe.src = `https://lichess.org/embed/game/${gameObj.id}?theme=auto&bg=auto`

        gameDisplay.append(header, iframe)

        document.querySelectorAll('.selected').forEach(title => title.className = '')
        gameTitle.className = 'selected'
    })

    if (gameObj.number === 0) {
        gameTitle.click()
    }
}

function clearUserInfo() {
    userInfo.className = 'hidden'
    toggle.className = 'hidden'
    errorBox.className = 'hidden'
    userLink.innerHTML = ''
    userStats.innerHTML = ''
}

function clearGames() {
    gamesErrorBox.className = 'hidden'
    clearFilterButton.className = 'hidden'
    userGames.innerHTML = ''
    gameDisplay.innerHTML = ''
}

function toggleForm() {
    if (toggle.textContent === 'Filter by Opening') {
        openingForm.className = 'visible'
        toggle.textContent = 'Hide Filter'
    } else if (toggle.textContent === 'Hide Filter') {
        openingForm.className = 'hidden'
        toggle.textContent = 'Filter by Opening'
    }
}

function navigateGames(e) {
    let selected = document.querySelector('.selected')
    if (e.code === 'ArrowDown') {
        if (selected.nextSibling) {
            selected.className = ''
            selected.nextSibling.click()
        }
    } else if (e.code === 'ArrowUp') {
        if (selected.previousSibling) {
            selected.className = ''
            selected.previousSibling.click()
        } 
    }
}

function preventScrolling(e) {
    if(["ArrowUp", "ArrowDown"].includes(e.code)) {
        e.preventDefault();
    }
}

const readStream = processLine => response => {
    const stream = response.body.getReader()
    const matcher = /\r?\n/
    const decoder = new TextDecoder()
    let buf = ''
  
    const loop = () =>
        stream.read().then(({done, value}) => {
            if (done) {
                if (buf.length > 0) processLine(JSON.parse(buf))
            } else {
                const chunk = decoder.decode(value, {
                    stream: true
                });
                buf += chunk
  
                const parts = buf.split(matcher)
                buf = parts.pop()
                for (const i of parts.filter(p => p)) processLine(JSON.parse(i))
                return loop()
            }
        })
    return loop()
}
