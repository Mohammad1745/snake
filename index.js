let row = 50;
let column = 50;
let snakeHeadPoint = [0,0];
let snakeHead = snakeHeadPoint[0]*column+snakeHeadPoint[1];
let snakeBody = [snakeHead];
let snakeTail = snakeHead;
let direction = 'R';
let speed = 10;//dot per second
let frog = 0;
let gameMode = 0;
let device = 'pc';
let score = 0;
let strikeAudio = new Audio("frog.mp3");

$(document).ready (function () {
    //rendering form
    renderInputForm();
    //mouse click
    $("#start_btn").on('click', function () {
        if (gameMode===0 && checkInitialData()) {
            gameMode=1;
            $(this).html('Stop');
            if (device==='mobile') renderController();
            renderArena();
            renderScore();
            renderFrog();
            activatePoint(snakeHead);
            moveSnake();
        } else if (gameMode===1 || gameMode===2 || gameMode===3) {
            location.reload();
        }
    });
    $("#pause_btn").on('click', function () {
        if (gameMode===1) {
            gameMode=2;
            $(this).html('Resume');
        } else if (gameMode===2) {
            gameMode=1;
            $(this).html('Pause');
        }
    });
    //catching keypress
    $("body").keypress(function(event){
        if (event.keyCode===119 && direction!=='D') direction = 'U';
        else if (event.keyCode===97 && direction!=='R') direction = 'L';
        else if (event.keyCode===115 && direction!=='U') direction = 'D';
        else if (event.keyCode===100 && direction!=='L') direction = 'R';
        else if (event.keyCode===112) $("#pause_btn").trigger('click');
        // else alert(event.keyCode);
    });
    $("#control").on('click', '#up', function () {if (direction!=='D') direction = 'U'})
    $("#control").on('click', '#left', function () {if (direction!=='R') direction = 'L'})
    $("#control").on('click', '#down', function () {if (direction!=='U') direction = 'D'})
    $("#control").on('click', '#right', function () {if (direction!=='L') direction = 'R'})

    function renderInputForm () {
        $('#arena').html(`
            <div class="form row">
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
            </div>`);
    }
    function checkInitialData() {
        row = $("#arena").find("input#row").val();
        column = $("#arena").find("input#column").val();
        speed = $("#arena").find("input#speed").val();
        device = $("#arena").find("#device").val();
        if (!(row&&column&&speed))
            alert("Empty Form Data");
        return row&&column&&speed;
    }
    function renderArena() {
        $('#arena').html('');
        $('.arena').css('width', ''+(column*10+2));
        for (let i=0; i<row*column; i++) {
            $("#arena").append('<div id="arena_dot_'+i+'" class="arena-dot inactive-dot"></div>');
        }
    }
    function renderController() {
            $("#control").html(`
                <div class="row">
                <div class="col-12">
                    <button id="up" class="up">W</button>
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
            </div>
        `);
    }
    function renderScore() {
        $('#score').html('Score: '+score);
        $("#message").html("Score :)").css('color','green');
        setTimeout(function () {
            $("#message").html("");
        },1000);
    }
    function moveSnake() {
        if (gameMode===0) snakeHeadPoint = [0,0];
        else if (gameMode===1) {
            if (direction==='U') snakeHeadPoint[0]--;
            else if (direction==='L') snakeHeadPoint[1]--;
            else if (direction==='D') snakeHeadPoint[0]++;
            else if (direction==='R') snakeHeadPoint[1]++;
            snakeHead = snakeHeadPoint[0]*column+snakeHeadPoint[1];
            snakeBody.unshift(snakeHead);
            if (snakeHead===frog){
                score += parseInt(speed);
                renderScore();
                renderFrog();
            } else {
                snakeTail = snakeBody.pop();
                deactivatePoint(snakeTail);
            }
        }
        if (snakeHeadPoint[0]<0||snakeHeadPoint[0]>row-1||snakeHeadPoint[1]<0||snakeHeadPoint[1]>column-1) wallStrike();
        else if (snakeBody.filter(x => x===snakeHead).length>1) bodyStrike();
        else {
            activatePoint(snakeHead);
            setTimeout(function () {
                moveSnake();
            }, 1000/speed)
        }
    }
    function renderFrog () {
        do {
            frog = Math.round(Math.random()*row*column);
        } while (snakeBody.includes(frog));
        $("#arena").find('#arena_dot_'+frog).removeClass('inactive-dot active-dot').addClass('frog');
    }
    function activatePoint (point) {
        $("#arena").find('#arena_dot_'+point).removeClass('inactive-dot frog').addClass('active-dot');
    }
    function deactivatePoint (point) {
        $("#arena").find('#arena_dot_'+point).removeClass('active-dot frog').addClass('inactive-dot');
    }
    function wallStrike () {
        gameMode = 3;
        $('#start_btn').html('Restart');
        if (direction==='U') $("#arena").css('border-top', 'red solid 1px');
        else if (direction==='L') $("#arena").css('border-left', 'red solid 1px');
        else if (direction==='D') $("#arena").css('border-bottom', 'red solid 1px');
        else if (direction==='R') $("#arena").css('border-right', 'red solid 1px');
        $("#message").html("Wall Strike :(").css('color','red');
        strikeAudio.play();
    }
    function bodyStrike () {
        gameMode = 3;
        $("#start_btn").html('Restart');
        $("#arena").find('#arena_dot_'+snakeHead).css('background-color','#c33');
        $("#message").html("Body Strike :(").css('color','red');
        strikeAudio.play();
    }
});
