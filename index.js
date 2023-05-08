// Definitions
let form = document.querySelector("#user-search")
let userGames = document.querySelector("#user-games")
let userStats = document.querySelector("#user-stats")

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
        name.textContent = data[0].username

        let blitzRating = document.createElement('p')
        blitzRating.textContent = `Blitz Rating: ${data[0].perfs.blitz.rating}`

        userStats.append(name, blitzRating)
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
        games.forEach(game => {
            let gameTitle = document.createElement('h4')
            gameTitle.textContent = `${game.players.white.user.name} vs. ${game.players.black.user.name}`
            userGames.appendChild(gameTitle)
        })
    })
}

// Event Listeners
form.addEventListener('submit', searchUser)
