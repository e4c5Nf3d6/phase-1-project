// Definitions
let form = document.querySelector("#user-search")
let userInfo = document.querySelector("#user-info")

// Functions
function searchUser(e) {
    e.preventDefault()

    // displayUserInfo(e)
    displayUserGames(e)

    form.reset()
}

// function displayUserInfo(e) {

// }

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
            let gameTitle = document.createElement('h4')
            gameTitle.textContent = `${game.players.white.user.name} vs. ${game.players.black.user.name}`
            userInfo.appendChild(gameTitle)
        })
    })
}

// Event Listeners
form.addEventListener('submit', searchUser)
