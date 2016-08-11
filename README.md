# Soccer Game Simulation

## Running the game

[>> Run the game here!](http://crssn.info/game-challenge/?moveInterval=10)  
*Note: you can edit the ?moveInterval query parameter in your browser url to change the speed of the game simulation.*

Or download the repo and open index.html in any modern browser and click Start Game. 

A 'moveInterval' query parameter can be added to the url in order to speed up the game simulation. The value assigned here should be in milliseconds. Eg: ?moveInterval=1000 will move the players 1 second at a time.

## Requirements

A playing area is 100m x 100m. A game has a referee and 10 players. A player moves 1m every second and starts out in a 
random place on the playing area. A referee gives a yellow card to a player if that player moves within 2m of another 
player. It is the player that moves to within 2m of another player, that gets the yellow card. If a player gets 2 yellow 
cards, the player is ejected from the game for 10 seconds. When a player is sent off the player needs to ask the referee 
if they are eligible to play again. The referee will let the player return to playing the first time this happens, but 
not subsequent times. The last player left playing is the winner. Write an application that simulates these game 
requirements. Please document all assumptions or decisions you’ve made, that helped ensure you delivered a working 
result in the time provided.

## Assumptions

* Players move randomly but should stay within the playing area
* When a player is returned to the game the first time, they are permitted 2 additional yellow cards before they are 
sent off completely

## Description

The game is implemented using HTML5 canvas and accompanying app.js with a number of JavaScript Objects to represent
objects required to simulate the game:

* Game sets up the playing area and handles the creation of Players and the animation interval to keep the Game in play
* Player handles the positioning and movement of the Players as well as card counts
* Referee keeps track of Player's movements and issues cards while keeping track of the which Players have received 
cards and the time they were issued

