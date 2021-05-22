let row = 20
let column = 20
let snakeHeadPoint = [0,0]
let snakeHead = snakeHeadPoint[0]*column+snakeHeadPoint[1]
let snakeBody = [snakeHead]
let snakeTail = snakeHead
let direction = 'R'
let speed = 5//dot per second
let frog = 0
let gameMode = 0
let device = 'pc'
let score = 0
let strikeAudio = new Audio("frog.mp3")

document.addEventListener("DOMContentLoaded", () => {
    //rendering form
    renderInputForm()
    //mouse click
    document.querySelector('#start_btn').addEventListener('click', e => {
        if (gameMode===0 && checkInitialData()) {
            gameMode=1
            e.target.innerHTML = 'Stop'
            if (device==='mobile') renderController()
            renderArena()
            renderScore()
            renderFrog()
            activatePoint(snakeHead)
            moveSnake()
        } else if (gameMode===1 || gameMode===2 || gameMode===3) {
            location.reload()
        }
    })
    document.querySelector('#pause_btn').addEventListener('click', e => {
        if (gameMode===1) {
            gameMode=2
            e.target.innerHTML = 'Resume'
        } else if (gameMode===2) {
            gameMode=1
            e.target.innerHTML = 'Pause'
        }
    })
    //catching keypress
    window.addEventListener('keydown', event => {
        if (event.key==='w' && direction!=='D') direction = 'U'
        else if (event.key==='a' && direction!=='R') direction = 'L'
        else if (event.key==='s' && direction!=='U') direction = 'D'
        else if (event.key==='d' && direction!=='L') direction = 'R'
        else if (event.key==='p') document.querySelector("#pause_btn").click()
        // else alert(event.keyCode)
    })
    //mouse event
    let controller = document.querySelector('#control')
    controller.querySelector('#up').addEventListener('click', e => {if (direction!=='D') direction = 'U'})
    controller.querySelector('#left').addEventListener('click', e => {if (direction!=='R') direction = 'L'})
    controller.querySelector('#down').addEventListener('click', e => {if (direction!=='U') direction = 'D'})
    controller.querySelector('#right').addEventListener('click', e => {if (direction!=='L') direction = 'R'})

    function renderInputForm () {
        document.querySelector('#arena').innerHTML =
            `<div class="form row">
                <div class="col-md-3 form-group">
                    <label for="row">Arena Height</label>
                    <input type="number" min="2" id="row" name="row" value="`+row+`" class="form-control">
                </div>
                <div class="col-md-3 form-group">
                    <label for="column">Arena Width</label>
                    <input type="number" min="2" id="column" name="column" value="`+column+`" class="form-control">
                </div>
                <div class="col-md-3 form-group">
                    <label for="speed">Snake Speed</label>
                    <input type="number" min="0.0001" step="0.1" id="speed" name="speed" value="`+speed+`" class="form-control">
                </div>
                <div class="col-md-3 form-group">
                    <label for="device">Device</label>
                    <select name="device" id="device" class="form-control">
                        <option value="pc">PC</option>
                        <option value="mobile">Mobile</option>
                    </select>
                </div>
            </div>`
    }
    function checkInitialData() {
        row = document.querySelector('#arena').querySelector("#row").value
        column = document.querySelector('#arena').querySelector("#column").value
        speed = document.querySelector('#arena').querySelector("#speed").value
        device = document.querySelector('#arena').querySelector("#device").value
        if (!(row&&column&&speed))
            alert("Empty Form Data")
        return row&&column&&speed
    }
    function renderArena() {
        document.querySelector('#arena').innerHTML = ''
        document.querySelector('.arena').style.width = (column*10+2)+'px'
        for (let i=0; i<row*column; i++) {
            document.querySelector("#arena").insertAdjacentHTML('beforeend','<div id="arena_dot_'+i+'" class="arena-dot inactive-dot"></div>')
        }
    }
    function renderController() {
        document.querySelector('#control').innerHTML = `
            <div class="row">
                <div class="col-12">
                    <button id="up" class="up">U</button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <button id="left" class="left">L</button>
                    <button id="right" class="right">R</button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <button id="down" class="down">D</button>
                </div>
            </div>`
    }
    function renderScore() {
        document.querySelector('#score').innerHTML = 'Score: '+score
        document.querySelector('#message').innerHTML = "Score :)"
        document.querySelector('#message').style.color = 'green'
        setTimeout(function () {
            document.querySelector("#message").innerHTML = ""
        },1000)
    }
    function moveSnake() {
        if (gameMode===0) snakeHeadPoint = [0,0]
        else if (gameMode===1) {
            if (direction==='U') snakeHeadPoint[0]--
            else if (direction==='L') snakeHeadPoint[1]--
            else if (direction==='D') snakeHeadPoint[0]++
            else if (direction==='R') snakeHeadPoint[1]++
            snakeHead = snakeHeadPoint[0]*column+snakeHeadPoint[1]
            snakeBody.unshift(snakeHead)
            if (snakeHead===frog){
                score += parseInt(speed)
                renderScore()
                renderFrog()
            } else {
                snakeTail = snakeBody.pop()
                deactivatePoint(snakeTail)
            }
        }
        if (snakeHeadPoint[0]<0||snakeHeadPoint[0]>row-1||snakeHeadPoint[1]<0||snakeHeadPoint[1]>column-1) wallStrike()
        else if (snakeBody.filter(x => x===snakeHead).length>1) bodyStrike()
        else {
            activatePoint(snakeHead)
            setTimeout(function () {
                moveSnake()
            }, 1000/speed)
        }
    }
    function renderFrog () {
        do {
            frog = Math.round(Math.random()*row*column)
        } while (snakeBody.includes(frog))
        document.querySelector('#arena').querySelector('#arena_dot_'+frog).classList.remove('inactive-dot','active-dot')
        document.querySelector('#arena').querySelector('#arena_dot_'+frog).classList.add('frog')
    }
    function activatePoint (point) {
        document.querySelector('#arena').querySelector('#arena_dot_'+point).classList.remove('inactive-dot','frog')
        document.querySelector('#arena').querySelector('#arena_dot_'+point).classList.add('active-dot')
    }
    function deactivatePoint (point) {
        document.querySelector('#arena').querySelector('#arena_dot_'+point).classList.remove('active-dot','frog')
        document.querySelector('#arena').querySelector('#arena_dot_'+point).classList.add('inactive-dot')
    }
    function wallStrike () {
        gameMode = 3
        document.querySelector('#start_btn').innerHTML = 'Restart'
        if (direction==='U') document.querySelector("#arena").style.borderTop = 'red solid 1px'
        else if (direction==='L') document.querySelector("#arena").style.borderLeft = 'red solid 1px'
        else if (direction==='D') document.querySelector("#arena").style.borderBottom = 'red solid 1px'
        else if (direction==='R') document.querySelector("#arena").style.borderRight = 'red solid 1px'
        document.querySelector('#message').innerHTML = "Wall Strike :("
        document.querySelector('#message').style.color = 'red'
        strikeAudio.play()
    }
    function bodyStrike () {
        gameMode = 3
        document.querySelector('#start_btn').innerHTML = 'Restart'
        document.querySelector('#arena').querySelector('#arena_dot_'+snakeHead).style.backgroundColor = '#c33'
        document.querySelector('#message').innerHTML = "Body Strike :("
        document.querySelector('#message').style.color = 'red'
        strikeAudio.play()
    }
})
