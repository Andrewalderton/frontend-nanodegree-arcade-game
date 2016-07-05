'use strict';

/*** Enemy Class ***/

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.y = y;
    this.x = x;
    this.speed = speed;
    this.height = 48; // Height and width set for collision detection.
    this.width = 55;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x < 550) {
        this.x += dt * this.speed;
    } else {
        // Reset enemy position and generate a new speed.
        this.x = -150;
        this.randomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Generate random speed for each enemy.
Enemy.prototype.randomSpeed = function() {
    this.speed = 80 * (Math.floor(Math.random() * 10) + 1);
};


/*** Player Class ***/

// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
    this.height = 50; // Height and width for collision detection.
    this.width = 40;
    this.score = 0; // Set the initial score to be updated.
};

Player.prototype.handleInput = function(keyCode) {
    // Switch statement to handle keyboard inputs and keep the player within game bounds.
    switch (keyCode) {
        case 'left' :
            if (this.x > 0) {
                this.x -= 101; // 101 is the width of one tile as specified in engine.js.
            }
            break;
        case 'right':
            if (this.x < 400) {
                this.x += 101;
            }
            break;
        case 'up':
            if (this.y > 0 ) {
                this.y -= 83; // 83 is the height of one tile as specified in engine.js.
            }
            break;
        case 'down':
            if (this.y < 380) {
                this.y += 83;
            }
            break;
    }
};

Player.prototype.update = function() {
    // Detect when player reaches water with gem, update score and reset positions.
    if (this.y <= 10 && (gem.y === 600)) {
        this.reset(202, 380);
        this.scoreUpdate(20);
        gem.reset();
    }
    // Alternative scoreUpdate for reaching water without gem.
    else if (this.y <= 10) {
        this.reset(202, 380);
        this.scoreUpdate(10);
    }

    this.checkCollisions();
    gem.collectGem();
    this.drawText();
};

// Render the player character on the screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player position reset.
Player.prototype.reset = function(x, y) {
    this.x = x;
    this.y = y;
};

// Collision detection for enemy and player.
Player.prototype.checkCollisions = function(){
    allEnemies.forEach(function(enemy) {
        if ((this.x <= enemy.x + enemy.width && this.x + this.width >= enemy.x) && (this.y <= enemy.y + enemy.height && this.height + this.y >= enemy.y)) {
            // Reset player position and reduce score.
            this.reset(202, 380);
            this.scoreUpdate(-10);
        }
    }.bind(this));
};

// Update the player's score.
Player.prototype.scoreUpdate = function(scoreUpdate) {
    this.score = this.score += scoreUpdate;
};

// Display the current score onscreen.
Player.prototype.drawText = function() {
    ctx.clearRect(0, 0, 120, 20);
    ctx.font = '20px Helvetica';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + this.score, 8, 18);
};


/*** Gem Class ***/

var Gem = function() {
    this.gemX = [25, 126, 227, 328, 429]; // All possible gem positions stored in gemX and gemY.
    this.gemY = [113, 196, 279];
    this.gemColor = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
    this.height = 40; // Height and width for collision.
    this.width = 76;
    this.reset(); // Set a random position and color.
};

// Draw the gem on the screen.
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Detect when player collects a gem.
Gem.prototype.collectGem = function() {
    if(player.x === this.x - 25 && player.y === this.y - 65) {
        this.y = 600; // Move the gem offscreen
    }
};

// Reset gem with random position and color.
Gem.prototype.reset = function() {
    this.sprite = this.gemColor[Math.floor(Math.random() * this.gemColor.length)];
    this.x = this.gemX[Math.floor(Math.random() * this.gemX.length)];
    this.y = this.gemY[Math.floor(Math.random() * this.gemY.length)];
};


/*** Instantiate Objects ***/

// Place the player object in a variable called player
var player = new Player(202, 380);

var gem = new Gem();

var allEnemies = [];

var posY = [60, 143, 226]; // All possible Y locations for enemies.

// Create enemies and push them into allEnemies array.
posY.forEach(function(posY){
    var x = Math.floor((Math.random() * 5 - 100));
    var enemy = new Enemy(x, posY);
    allEnemies.push(enemy);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Prevent window from scrolling when arrow keys are pressed.
window.addEventListener("keydown", function(e) {
    if ([38, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
