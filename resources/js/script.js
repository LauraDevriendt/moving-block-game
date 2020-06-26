/* Defining functions */
const generateLives = (numOfLives) => {
    const livesContainer = document.querySelector('.livesContainer');
    livesContainer.innerHTML = '';
    for (let i = 0; i < numOfLives; i++) {
        livesContainer.innerHTML += `   <div class="live"><img src="resources/img/cheese.png" alt="live"></div>`;
    }
}

const setTimer = (startTime) => {
    let lives = document.querySelectorAll('.live');
    if (lives.length > 0) {
        let now = new Date();
        let timeElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);

        let seconds = 0, minutes = 0, hours = 0;
        if (timeElapsed >= 3600) {
            hours = Math.floor(timeElapsed / 3600);
            let remain = timeElapsed - hours * 3600;
            if (remain >= 60) {
                minutes = Math.floor(remain / 60);
            } else {
                seconds = remain;
            }
        } else if (timeElapsed >= 60) {
            minutes = Math.floor(timeElapsed / 60);
            seconds = timeElapsed - minutes * 60;
        } else {
            seconds = timeElapsed;
        }

        document.querySelector('.seconds').innerHTML = (seconds < 10) ? `0${seconds}` : seconds;
        document.querySelector('.minutes').innerHTML = (minutes < 10) ? `0${minutes}` : minutes;
        document.querySelector('.hours').innerHTML = (minutes < 10) ? `0${hours}` : hours;


    }
}

const startTimer =() =>{
    let startTime = new Date();
    setInterval(function(){
        setTimer(startTime)
    }, 1000);
}

const positioning = (block, left, top) => {
    block.style.cssText = `
            left: ${left}px;
            top: ${top}px;
            `;
}

const moveTom = () => {
    const playfield = document.querySelector('.playfield');
    const jerry = document.querySelector('.jerry');
    document.addEventListener('keydown', (e) => {
        let posX = jerry.offsetLeft;
        let posY = jerry.offsetTop;
        let maxX = playfield.offsetWidth - jerry.offsetWidth;
        let maxY = playfield.offsetHeight - jerry.offsetWidth;

        switch (e.key) {
            case 'ArrowDown':
                if (posY < maxY) {
                    posY += 5;
                    positioning(jerry, posX, posY);
                }
                break;
            case 'ArrowUp':
                if (posY > 0) {
                    posY -= 5;
                    positioning(jerry, posX, posY);
                }
                break;
            case 'ArrowRight':
                if (posX < maxX) {
                    posX += 5;
                    positioning(jerry, posX, posY);
                }
                break;
            case 'ArrowLeft':
                if (posX > 0) {
                    posX -= 5;
                    positioning(jerry, posX, posY);
                }
                break;
        }
    })
}

const randPosXY = (coordinate) => {
    const playfield = document.querySelector('.playfield');
    const toms = document.querySelectorAll('.tom');
    let maxPosX = playfield.offsetWidth - toms[0].offsetWidth;
    let maxPosY = playfield.offsetHeight - toms[0].offsetWidth;
    let minPosX = toms[0].offsetWidth;
    let minPosY = toms[0].offsetWidth;
    let rangeX = maxPosX - minPosX;
    let rangeY = maxPosY - minPosY;

    let randX = toms[0].offsetWidth + Math.floor(Math.random() * rangeX);
    let randY = toms[0].offsetWidth + Math.floor(Math.random() * rangeY);
    return (coordinate === 'x') ? randX : randY;
}

const randomPositioningTom = () => {
    const toms = document.querySelectorAll('.tom');
    //Make toms appear at random positions

    for (let i = 0; i < toms.length; i++) {
        let randX = randPosXY('x');
        let randY = randPosXY('y');

      
        positioning(toms[i], randX, randY);
    }
};

const moveEnemies = () => {
    const playfield = document.querySelector('.playfield');
    const toms = document.querySelectorAll('.tom');
    const jerry = document.querySelector('.jerry');
    let liveNum = document.querySelectorAll('.live').length;
    for (let i = 0; i < toms.length; i++) {
        let dX = (Math.random() > 0.5) ? 1 : -1;
        let dY = (Math.random() > 0.5) ? 1 : -1;
        let enemy = toms[i];

        let move = () => {
            if (liveNum > 0) {
                let posX = enemy.offsetLeft;
                let posY = enemy.offsetTop;

                if (enemy.offsetLeft + dX > playfield.offsetWidth - toms[0].offsetWidth) {
                    dX = -dX;
                }

                if (enemy.offsetLeft + dX < 0) {
                    dX = -dX;
                }

                if (enemy.offsetTop + dY > playfield.offsetHeight - toms[0].offsetWidth) {
                    dY = -dY;
                }

                if (enemy.offsetTop + dX < 0) {
                    dY = -dY;
                }

                posX += dX;
                posY += dY;
                positioning(enemy, posX, posY);
                let playerPosX = jerry.offsetLeft;
                let playerPosY = jerry.offsetTop;

                if (playerPosX > posX - jerry.offsetWidth && playerPosX < posX + toms[0].offsetWidth &&
                    playerPosY > posY - jerry.offsetWidth && playerPosY < posY + toms[0].offsetWidth) {
                    liveNum--;
                    generateLives(liveNum);
                    positioning(jerry, 0, 0);
                }

                let moveInterval = setTimeout(move, 50);

            } else {
                clearInterval(setTimer);
                let seconds = document.querySelector('.seconds').innerHTML
                let minutes = document.querySelector('.minutes').innerHTML
                let hours = document.querySelector('.hours').innerHTML

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

/* Run functions */

generateLives(parseInt(document.querySelector('.livesContainer').dataset.numoflives));
startTimer()
moveTom();
randomPositioningTom();
moveEnemies();





