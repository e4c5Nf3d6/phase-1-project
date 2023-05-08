// Definitions
let form = document.querySelector("#user-search")
let userGames = document.querySelector("#user-games")
let userStats = document.querySelector("#user-stats")
let gameDisplay = document.querySelector("#game-details")

// Functions
function searchUser(e) {
    e.preventDefault()

    displayUserStats(e)
    displayUserGames(e)

    form.reset()
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
        console.log(data)
        userStats.innerHTML = ''
        
        let name = document.createElement('h2')
        let link = document.createElement('a')
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

        userStats.append(name, blitzRating, rapidRating, classicalRating)
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
        userGames.innerHTML = ''
        let h3 = document.createElement('h3')
        h3.textContent = "Recent Games"
        userGames.appendChild(h3)
        games.forEach(game => {
            let gameTitle = document.createElement('p')
            gameTitle.textContent = `${game.players.white.user.name} vs. ${game.players.black.user.name}`
            userGames.appendChild(gameTitle)

            gameTitle.addEventListener('click', function () {
                let display = document.createElement('iframe')
                display.src = `https://lichess.org/embed/game/${game.id}?theme=auto&bg=auto`
                gameDisplay.appendChild(display)
                console.log(game)
            })
        })
    })
}

// Event Listeners
form.addEventListener('submit', searchUser)
