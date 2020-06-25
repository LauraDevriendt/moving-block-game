////----DEFINE VARIABLES----////
let rulesShown = false;
let startTime = new Date();
const jerry = document.querySelector('.jerry');
const toms = document.querySelectorAll('.tom');
const playfield = document.querySelector('.playfield');
const livesContainer = document.querySelector('.livesContainer');
let moveInterval

////----SET THE SIZE OF THE PLAYER AND ENEMIES----////
let blockSizeJerry = 50;
let blockSizeTom = 100;
let numOfLives = 3;


////----DEFINE FUNCTIONS----////
const generateLives = (numOfLives) => {
    livesContainer.innerHTML = '';
    for (let i = 0; i < numOfLives; i++) {
        livesContainer.innerHTML += `   <div class="live"><img src="resources/img/cheese.png" alt="live"></div>`;
    }
}

generateLives(numOfLives);
let lives = document.querySelectorAll('.live');


const setTimer = () => {
    if (lives.length > 0) {
        let now = new Date();
        let timeElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);

        let second = 0, minute = 0, hour = 0;
        if (timeElapsed >= 3600) {
            hour = Math.floor(timeElapsed / 3600);
            let remain = timeElapsed - hour * 3600;
            if (remain >= 60) {
                minute = Math.floor(remain / 60);
            } else {
                second = remain;
            }
        } else if (timeElapsed >= 60) {
            minute = Math.floor(timeElapsed / 60);
            second = timeElapsed - minute * 60;
        } else {
            second = timeElapsed;
        }

        document.querySelector('.second').innerHTML = (second < 10) ? `0${second}` : second;
        document.querySelector('.minute').innerHTML = (minute < 10) ? `0${minute}` : minute;
        document.querySelector('.hour').innerHTML = (minute < 10) ? `0${hour}` : hour;


    }
}


const setBlock = (nameOfBlock, left, top) => {
    nameOfBlock.style.cssText = `
            width: ${blockSizeTom}px;
            height: ${blockSizeTom}px;
            display: block;
            left: ${left}px;
            top: ${top}px;
            `;
}
const setBlockJerry = (nameOfBlock, left, top) => {
    nameOfBlock.style.cssText = `
            width: ${blockSizeJerry}px;
            height: ${blockSizeJerry}px;
            display: block;
            left: ${left}px;
            top: ${top}px;
            `;
}

const showPlayer = () => {
    setBlockJerry(jerry, 0, 0);
};

const movePlayer = () => {

    document.addEventListener('keydown', (e) => {
        let posX = jerry.offsetLeft;
        let posY = jerry.offsetTop;
        let maxX = playfield.offsetWidth - blockSizeJerry;
        let maxY = playfield.offsetHeight - blockSizeJerry;

        switch (e.key) {
            case 'ArrowDown':
                if (posY < maxY) {
                    posY += 5;
                    setBlockJerry(jerry, posX, posY);
                }
                break;
            case 'ArrowUp':
                if (posY > 0) {
                    posY -= 5;
                    setBlockJerry(jerry, posX, posY);
                }
                break;
            case 'ArrowRight':
                if (posX < maxX) {
                    posX += 5;
                    setBlockJerry(jerry, posX, posY);
                }
                break;
            case 'ArrowLeft':
                if (posX > 0) {
                    posX -= 5;
                    setBlock(jerry, posX, posY);
                }
                break;
        }
    })
}

//Function to generate position, take in x or y as parameter, return a number as position
const randPosXY = (coordinate) => {
    //range where toms can appear: inside div, not overlap player
    let maxPosX = playfield.offsetWidth - blockSizeTom;
    let maxPosY = playfield.offsetHeight - blockSizeTom;
    let minPosX = blockSizeTom;
    let minPosY = blockSizeTom;
    let rangeX = maxPosX - minPosX;
    let rangeY = maxPosY - minPosY;

    let randX = blockSizeTom + Math.floor(Math.random() * rangeX);
    let randY = blockSizeTom + Math.floor(Math.random() * rangeY);
    return (coordinate === 'x') ? randX : randY;
}

const showEnemies = () => {
    //Make toms appear at random positions
    //let randPosAll = []; //store the position of the toms

    for (let i = 0; i < toms.length; i++) {
        let randX = randPosXY('x');
        let randY = randPosXY('y');

        // randPosAll.push(randX);
        // randPosAll.push(randY);
        //console.log('Iteration i = ' + i + ', value x: ' + randPosAll[2*i] + ', value y: ' + randPosAll[2*i+1]);

        //add styling for each enemy
        //setBlock(toms[i], randPosAll[2 * i], randPosAll[2 * i + 1]);
        setBlock(toms[i], randX, randY);
    }
};

const moveEnemies = () => {

    let liveNum = lives.length;
    for (let i = 0; i < toms.length; i++) {
        let dX = (Math.random() > 0.5) ? 1 : -1;
        let dY = (Math.random() > 0.5) ? 1 : -1;
        let enemy = toms[i];

        let move = () => {
            if (liveNum > 0) {
                let posX = enemy.offsetLeft;
                let posY = enemy.offsetTop;

                if (enemy.offsetLeft + dX > playfield.offsetWidth - blockSizeTom) {
                    dX = -dX;
                }

                if (enemy.offsetLeft + dX < 0) {
                    dX = -dX;
                }

                if (enemy.offsetTop + dY > playfield.offsetHeight - blockSizeTom) {
                    dY = -dY;
                }

                if (enemy.offsetTop + dX < 0) {
                    dY = -dY;
                }

                posX += dX;
                posY += dY;
                setBlock(enemy, posX, posY);
                let playerPosX = jerry.offsetLeft;
                let playerPosY = jerry.offsetTop;

                if (playerPosX > posX - blockSizeJerry && playerPosX < posX + blockSizeTom &&
                    playerPosY > posY - blockSizeJerry && playerPosY < posY + blockSizeTom) {
                    liveNum--;
                    generateLives(liveNum);
                    setBlockJerry(jerry, 0, 0);
                }

                moveInterval = setTimeout(move, 50);

            } else {
                clearInterval(time);
                let seconds = document.querySelector('.second').innerHTML
                let minutes = document.querySelector('.minute').innerHTML
                let hours = document.querySelector('.hour').innerHTML

                document.getElementById('endResult').innerText = `You stayed a live for ${hours} hours, ${minutes} minutes and ${seconds} seconds`
                document.getElementById('gameOver').style.cssText = "left:0";
                document.getElementById('playAgain').addEventListener('click', function () {
                    location.reload();
                })

            }

        }

        move();
    }

}

////----RUN THE FUNCTIONS----////
let time = setInterval(setTimer, 1000);
showPlayer();
movePlayer();
showEnemies();
moveEnemies();





