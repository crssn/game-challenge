//  Soccer Game Simulation
//  @author: https://github.com/crssn

(function (){

    var players = [];
    var directions = ['N','S','E','W'];
    var animationInterval;
    var moveInterval = getParameterByName('moveInterval') || 100;
    var commentary = document.getElementById('commentary');
    var startButton = document.getElementById('startButton');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var Game = function () {

        this.playersCount = 10;
        this.moveInterval = moveInterval;
        this.playingAreaWidth = 1000;
        this.playingAreaHeight = 1000;
        this.gridPixelSize = 10;
        this.timeToWait = 10;
        this.color = 'gray';

        this.renderPlayingArea = function () {
            context.save();
            context.lineWidth = 0.5;
            context.strokeStyle = game.color;

            // horizontal grid lines
            for(var i = 0; i <= game.playingAreaHeight + 10; i = i + game.gridPixelSize)
            {
                context.beginPath();
                context.moveTo(0, i);
                context.lineTo(game.playingAreaWidth + 10, i);
                context.closePath();
                context.stroke();
            }
            // vertical grid lines
            for(var j = 0; j <= game.playingAreaWidth + 10; j = j + game.gridPixelSize)
            {
                context.beginPath();
                context.moveTo(j, 0);
                context.lineTo(j, game.playingAreaHeight + 10);
                context.closePath();
                context.stroke();
            }
            context.restore();
        };

        this.clearCommentary = function() {
            commentary.value = "Players added to the playing area at random\n";
            commentary.value = "Players ready\n" + commentary.value;
        };

        this.createPlayers = function () {

            for (var i = 1; i <= game.playersCount; i++) {
                var player = new Player(i);
                player.draw();
                players.push(player);
            }
        };

        this.movePlayers = function () {

            animationInterval = setInterval(function() {
                referee.gameTimer += 1;
                _.each(players, function (player) {

                    if (player.eligible) {
                        player.move();
                        referee.checkPlayerInfractions(player);
                    }
                    if (player.redCardCount < 2) {
                        referee.isPlayerEligible(player);
                    }

                });
            }, game.moveInterval);
        };


    };

    var Player = function (id) {

        this.id = id;
        this.posX = randomCoords(0, game.playingAreaWidth, game.gridPixelSize);
        this.posY = randomCoords(0, game.playingAreaWidth, game.gridPixelSize);
        this.yellowCardCount = 0;
        this.redCardCount = 0;
        this.eligible = true;
        this.color = 'blue';
        this.direction = directions[Math.floor(Math.random()*directions.length)];

        this.move = function() {

            context.clearRect(this.posX, this.posY, game.gridPixelSize, game.gridPixelSize);

            if (this.direction === 'N') {
                this.posY -= 10;
            }
            if (this.direction === 'S') {
                this.posY += 10;
            }
            if (this.direction === 'E') {
                this.posX += 10;
            }
            if (this.direction === 'W') {
                this.posX -= 10;
            }

            if (this.posX <= 0 || this.posX >= game.playingAreaWidth || this.posY <= 0 || this.posY >= game.playingAreaHeight) {
                this.turnRight();
            } if (this.posX === randInt() || this.posY === randInt()) {
                this.turnRight();
            }

            this.draw();
        };

        this.draw = function(color) {
            context.beginPath();
            context.rect(this.posX, this.posY, game.gridPixelSize, game.gridPixelSize);
            context.lineWidth = 1;
            context.fillStyle = color || this.color;
            context.strokeStyle = game.color;
            context.fill();
            context.stroke();
            context.closePath();
        };

        this.reverseDirection = function() {
            if (this.direction === 'N') {
                this.direction = 'S';
            } else if (this.direction === 'S') {
                this.direction = 'N';
            } else if (this.direction === 'E') {
                this.direction = 'W';
            } else if (this.direction === 'W') {
                this.direction = 'E';
            }
        };

        this.turnRight = function() {
            if (this.direction === 'N') {
                this.direction = 'E';
            } else if (this.direction === 'S') {
                this.direction = 'W';
            } else if (this.direction === 'E') {
                this.direction = 'S';
            } else if (this.direction === 'W') {
                this.direction = 'N';
            }
        };

        this.returnToGame = function() {
            this.eligible = true;
            this.draw('red');
            referee.ejectedPlayers = _.without(referee.ejectedPlayers, this.id);
            logToConsole(commentary, "Player no. " + this.id + " has been returned to the game");
        };
    };

    var Referee = function () {

        this.gameTimer = 0;
        this.ejectedPlayers = [];

        this.checkPlayerInfractions = function(player) {

            var ejectedPlayers = this.ejectedPlayers;

            // Check for winner
            if (ejectedPlayers.length === game.playersCount - 1) {
                this.stopGameAndAnnounceWinner();
            }

            _.each(players, function (opponent) {

                if (player.id != opponent.id && opponent.eligible) {

                    var diffX = Math.abs(player.posX - opponent.posX);
                    var diffY = Math.abs(player.posY - opponent.posY);

                    if (diffX <= 20 && diffY <= 20) {

                        player.yellowCardCount += 1;

                        var yellowCardString = player.yellowCardCount === 1 ? " yellow card" : " yellow cards";
                        logToConsole(commentary, "Player no. " + player.id + " has " + player.yellowCardCount + yellowCardString);

                        if (player.yellowCardCount == 2 || player.yellowCardCount == 4) {

                            // Remove the player from the playing area
                            context.clearRect(player.posX, player.posY, game.gridPixelSize, game.gridPixelSize);

                            player.eligible = false;
                            player.redCardCount += 1;
                            var redCardString = player.redCardCount === 1 ? " red card" : " red cards";
                            logToConsole(commentary, "Player no. " + player.id + " has been ejected from the game. (" + player.redCardCount + redCardString + ")");

                            var obj = {
                                playerID: player.id,
                                timeEjected: referee.gameTimer
                            };
                            ejectedPlayers.push(obj);
                        }

                        if (player.redCardCount >= 2) {
                            logToConsole(commentary, "Player no. " + player.id + " has been sent off");
                        }

                        player.reverseDirection();

                    }
                }
            });
        };

        this.isPlayerEligible = function(player) {

            // get player from ejectedPlayers to access timeEjected
            var ejected = _.find(this.ejectedPlayers, function(obj) {
                return obj.playerID === player.id;
            });

            if (ejected) {
                var timeElapsed = referee.gameTimer - ejected.timeEjected;

                // return player to game if they have waited the allocated number of moves
                if (timeElapsed >= game.timeToWait) {
                    player.returnToGame();
                    this.ejectedPlayers = _.filter(this.ejectedPlayers, function(obj){
                        return obj.playerID != player.id;
                    });
                }
            }
        };

        this.stopGameAndAnnounceWinner = function () {
            //stop movement of players
            clearInterval(animationInterval);

            // find winner based on the last eligible player
            var winner = _.find(players, function (player) {
                return player.eligible == true;
            });
            alert("Player no. " + winner.id + " is the winner!");
            logToConsole(commentary, "Player no. " + winner.id + " is the winner!");
        };
        
    };


    var game = new Game();
    var referee = new Referee();

    game.renderPlayingArea();
    game.clearCommentary();
    game.createPlayers();

    startButton.disabled = false;
    startButton.addEventListener('click', function() {
        startButton.disabled = true;
        startGame();
    }, false);

    function startGame() {
        game.movePlayers();
    }

})();
