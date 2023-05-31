# Lichess Search

Lichess Search is a single-page application that utilizes the [Lichess API](https://lichess.org/api) to allow a user to search for Lichess players by username and see their ratings and recent games. This application allows a user to see all of a player's recent games together, regardless of time format.

### Features

- Displays a player's ratings
- Displays a player's recent games
- When a game is selected, an interactive board is displayed
- Games can be filtered by the opening that was played

### [Visit Lichess Search](https://e4c5nf3d6.github.io/phase-1-project/)

One of endpoints that I used streams its responses as NDJSON. [This post](https://dev.to/e4c5nf3d6/complications-and-simplifications-creating-a-chess-application-3hef) addresses some of the challenges that this presented during the development of this application, as well as how they were ultimately resolved.

## Example

![Example GIF](media/example-gif.gif)

## Technologies
- JavaScript
- HTML
- CSS

## Acknowledgements

- Thank you to Thibault Duplessis, founder of Lichess, for [code that reads an NDJSON stream](https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e) and for creating a free, open-source chess server.