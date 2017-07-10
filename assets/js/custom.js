/**
 * Created by AP on 07/06/2017.
 */

var snakeGame = function(obj){
    obj = $.extend({
        playGround_con: '.playGround_con',
        playGround: '.playGround',
        playGroundSnakeBody: '.playGroundSnakeBody',
        controlButtonObj: '.controlButton',
        playGroundSize: [800,600],
        gridSize: 10,
        snakeSize: 20,
        moveDuration: 100,
        minMoveDuration: 40,
        moveDurationIncrease: 5,
        moveDurationIncreaseDelay: 1000,	 // every moveDurationIncreaseDelay point it will decrease move duration moveDurationIncrease milisecond
        headBounceDuration: 500,
        running: null,
        createCell: false,
        cellObj: 'cell',
        gameLive: 5,
        gameLiveObj: '.game-live',
        scoreIncreaseDelay: 100,
        currentScore: 0,
        bestScore: 0,
        currentScoreObj: '.current-scrore-point',
        bestScoreObj: '.best-scrore-point',
        updateScore: null,
        moveCount:100,

    },obj);

    var playGround = $(obj.playGround);
    var playGroundSnakeBody = $(obj.playGroundSnakeBody);
    var currentScoreObj = $(obj.currentScoreObj);
    var bestScoreObj = $(obj.bestScoreObj);
    var controlButtonObj = $(obj.controlButtonObj);
    var playGroundSize = obj.playGroundSize;
    var randomNumX = function(){
        return Math.floor(Math.random() * ((playGroundSize[0]-2) - 3 + 1)) + 3;
    };
    var randomNumY = function(){
        return Math.floor(Math.random() * ((playGroundSize[1]-2) - 3 + 1)) + 3;
    };
    var randomNum = function(a,b){
        return Math.floor(Math.random() * (a - b + 1)) + b;
    };

    var makePos = function(x,y){
        x--;
        y--;
        return {left:x*gridSize,top:y*gridSize};
    };

    var gridSize = obj.gridSize;

    var snakeSize = obj.snakeSize;
    var moveDuration = obj.moveDuration;
    var running = obj.running;
    var updateScore = obj.updateScore;
    var gameLive = obj.gameLive;
    var currentScore = obj.currentScore;
    var bestScore = obj.bestScore;

    var tempSnakeSize = snakeSize;
    var createCell = obj.createCell;

    var moveCount = obj.moveCount;

    var moveDurationIncrease = obj.moveDurationIncrease;
    var moveDurationIncreaseDelay = obj.moveDurationIncreaseDelay;
    var minMoveDuration = obj.minMoveDuration;


    var hurtOption = {
        hurted : false,
        hurtedItself : false,
        hurtedByWall : false,
        hurtedByWallDir : null,
    };

    var initHurtOption = function(){
        hurtOption = {
            hurted : false,
            hurtedItself : false,
            hurtedByWall : false,
            hurtedByWallDir : null,
        };
    };

    var generateMeal = function(){
        var top = randomNumY();
        var left = randomNumX();
        var tempMealPos = makePos(left,top);
        $(document).remove('.meal');
        var meal = $('<div>').addClass('meal')
            .css({'top':tempMealPos.top+'px','left':tempMealPos.left+'px'})
            .attr('data-top',top)
            .attr('data-left',left);
        playGround.append(meal);
    };

    var moveMeal = function(){
        var top = randomNumY();
        var left = randomNumX();
        var tempMealPos = makePos(left,top);
        var mealNo = randomNum(0,8);
        $('.meal')
            .css({'top':tempMealPos.top+'px','left':tempMealPos.left+'px','background-position':'-'+(mealNo*gridSize)+'px 0px'})
            .attr('data-top',top)
            .attr('data-left',left);
    };

    var mealPos = function(){
        var meal = $('.meal');
        var top = parseInt(meal.attr('data-top'));
        var left = parseInt(meal.attr('data-left'));
        return {top:top,left:left};
    };

    var anmZoomBounce = function(element){
        element.addClass('anmZoomBounce');
        setTimeout(function(){element.removeClass('anmZoomBounce');},obj.headBounceDuration);

    };


    var initGameHtml = function(){
        var gameHtml = ''+
            '<div class="row full-width history text-right">'+
            '<div class="col-1 col-xs-6 col-md-3 score current-score">Scrore: <span class="current-scrore-point">0</span> </div>'+
            '<div class="col-2 col-xs-6 col-md-3 score best-score">Best: <span class="best-scrore-point">0</span> </div>'+
            //'<div class="col-3 col-xs-6 col-md-3 instractions text-left"><a href="#keyboard-shortcuts" data-toggle="modal" title="Keyboard Shortcuts" class="btn btn-sm btn-primary"><span class="fa fa-keyboard-o"></span> Keyboard Shortcuts</a></div>'+
            '<div class="col-4 col-xs-6 col-md-3 game-live">'+
            '<span class="fa fa-heart"></span>'+
            '<span class="fa fa-heart"></span>'+
            '<span class="fa fa-heart"></span>'+
            '<span class="fa fa-heart"></span>'+
            '<span class="fa fa-heart"></span>'+
            '</div>'+
            '</div>'+
            '<div class="col-xs-12 playGround">'+
            '<div class="playGroundFakeBox"></div>'+
            '<div class="playGroundSnakeBody"></div>'+
            '</div>'+
            '';
        $(obj.playGround_con).html(gameHtml);
        playGround = $(obj.playGround);
        playGroundSnakeBody = $(obj.playGroundSnakeBody);
        currentScoreObj = $(obj.currentScoreObj);
        bestScoreObj = $(obj.bestScoreObj);
        cellObj = obj.cellObj;
        cell = $('.'+cellObj);
        generateMeal();
    };

    initGameHtml();


    cellObj = obj.cellObj;
    cell = $('.'+cellObj);
    $('head').append('<style>'+
        '.playGround_con,.playGround{width:'+(playGroundSize[0]*gridSize)+'px !important;height:'+(playGroundSize[1]*gridSize)+'px !important;}'+
        '.'+cellObj+',.meal{width:'+gridSize+'px;height:'+gridSize+'px;}'+
        '.playGroundFakeBox{border:'+gridSize+'px solid #999;}'+
        '</style>');

    var setLive = function(){
        var heartHtml = '';
        var newGameLive = gameLive;
        if(newGameLive == 1){
            heartHtml = '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart"></span>';
            anmZoomBounce($(obj.gameLiveObj).find('.fa:eq(3)'));
        }
        else if(newGameLive == 2){
            heartHtml = '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>';
            anmZoomBounce($(obj.gameLiveObj).find('.fa:eq(2)'));
        }
        else if(newGameLive == 3){
            heartHtml = '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>';
            anmZoomBounce($(obj.gameLiveObj).find('.fa:eq(1)'));
        }
        else if(newGameLive == 4){
            heartHtml = '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>';
            anmZoomBounce($(obj.gameLiveObj).find('.fa:eq(0)'));
        }
        else if(newGameLive == 5){
            heartHtml = '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>'+
                '<span class="fa fa-heart"></span>';
        }
        else{
            heartHtml = '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>'+
                '<span class="fa fa-heart-o"></span>';
            anmZoomBounce($(obj.gameLiveObj).find('.fa:eq(4)'));
        }


        setTimeout(function(){$(obj.gameLiveObj).html(heartHtml);},(obj.headBounceDuration+10));
        return;
    };

    var setCurrentScore = function(){
        currentScoreObj.html(currentScore);
        if(typeof localStorage.snakeGameBestScore === "undefined"){
            localStorage.setItem('snakeGameBestScore',0);
            console.log('added new');
        }
        bestScoreObj.html(parseInt(localStorage.getItem("snakeGameBestScore")));

    };

    var clearBestScore = function(){
        localStorage.removeItem("snakeGameBestScore");
    };

    var increaseScore = function(){
        currentScore++;
        var snakeGameBestScore = 0;

        if(typeof localStorage.snakeGameBestScore === "undefined"){
            localStorage.setItem('snakeGameBestScore',0);
            console.log('added new');
        }

        snakeGameBestScore = parseInt(localStorage.getItem("snakeGameBestScore"));
        if(snakeGameBestScore < currentScore){
            snakeGameBestScore = currentScore;
            localStorage.setItem('snakeGameBestScore',snakeGameBestScore);
        }
        bestScore = snakeGameBestScore;
        setCurrentScore();
    };

    var initGame = function(){
        snakeSize = obj.snakeSize;
        tempSnakeSize = snakeSize;
        moveDuration = obj.moveDuration;
        running = obj.running;
        updateScore = obj.updateScore;
        gameLive = obj.gameLive;
        currentScore = 0;
        bestScore = 0;
        createCell = false;
        running = null;
        updateScore = null;
        moveCount = obj.moveCount;
        moveDurationIncrease = obj.moveDurationIncrease;
        moveDurationIncreaseDelay = obj.moveDurationIncreaseDelay;
        minMoveDuration = obj.minMoveDuration;

        initGameHtml();
        setCurrentScore();
        setLive();

        for(var i=1;i<=snakeSize;i++){
            var tempCellPos = makePos(tempSnakeSize+1,2);
            var tempCell = $('<div>').addClass(''+cellObj+' '+cellObj+'_'+i)
                .css({'top':tempCellPos.top+'px','left':tempCellPos.left+'px'})
                .attr('data-no',i)
                .attr('data-top',2)
                .attr('data-left',tempSnakeSize+1)
                .attr('data-move-now','right')
                .attr('data-moving-now','right')
                .attr('data-move-later','right');

            playGroundSnakeBody.append(tempCell);

            tempSnakeSize--;
        }
        $('.'+cellObj+'_1').append('<div class="'+cellObj+'Head"></div>');
    };
    initGame();



    var cellPos = function(no){
        var cell = $('.'+cellObj+'_'+no);
        var top = parseInt(cell.attr('data-top'));
        var left = parseInt(cell.attr('data-left'));
        var dir = cell.attr('data-moving-now');
        var dirNow = cell.attr('data-move-now');
        return {top:top,left:left,dir:dir,dirNow:dirNow};
    };

    var move = function(no){
        var element = $('.'+cellObj+'_'+no);
        var top = parseInt(element.attr('data-top'));
        var left = parseInt(element.attr('data-left'));

        var moveDir = element.attr('data-move-now');
        var currentDir = element.attr('data-moving-now');
        var laterDir = element.attr('data-move-later');
        if(moveDir == 'left') left--;
        else if(moveDir == 'right') left++;
        else if(moveDir == 'up') top--;
        else if(moveDir == 'down') top++;
        var tempCellPos = makePos(left,top);
        element
            .css({'top':tempCellPos.top+'px','left':tempCellPos.left+'px'})
            .attr('data-top',top)
            .attr('data-left',left)
            .attr('data-moving-now',moveDir)
            .attr('data-move-now',laterDir);

        if($('.'+cellObj+'_'+(no+1)).length){
            $('.'+cellObj+'_'+(no+1)).attr('data-move-later',moveDir);
        }
        initHurtOption();

        if(no > 1){
            var cellHead = cellPos(1);
            var cellNow = cellPos(no);
            if(cellNow.top == cellHead.top && cellNow.left == cellHead.left){

                pause({hurtLive: true});
            }
        }


    };

    var moveHead = function(dir){
        var element = $('.'+cellObj+'_1');
        var moveDir = dir;
        var currentDir = element.attr('data-move-now');
        var movingDir = element.attr('data-moving-now');
        var laterDir = element.attr('data-move-later');
        var possibleMove = false;
        // if(currentDir == 'up' || currentDir == 'down'){
        // 	if(moveDir == 'left' || moveDir == 'right')
        // 		possibleMove = true;
        // }
        // else if(currentDir == 'left' || currentDir == 'right'){
        // 	if(moveDir == 'up' || moveDir == 'down')
        // 		possibleMove = true;
        // }

        if(
            (movingDir == 'right' && dir != 'left' && currentDir != 'left') ||
            (movingDir == 'left' && dir != 'right' && currentDir != 'right') ||
            (movingDir == 'up' && dir != 'down' && currentDir != 'down') ||
            (movingDir == 'down' && dir != 'up' && currentDir != 'up')
        )
        {
            possibleMove = true;
        }

        if(possibleMove){
            element
                .attr('data-move-now',dir)
                // .attr('data-moving-now',dir)
                .attr('data-move-later',dir);
        }
    };

    // $('.cell_1').attr('data-move-now','down');
    // $('.cell_1').attr('data-move-later','down');
    var run = function(){
        var cellHeadPos = cellPos(1);
        if(
            (cellHeadPos.dirNow == 'up' && cellHeadPos.top == 2) ||
            (cellHeadPos.dirNow == 'down' && cellHeadPos.top == playGroundSize[1]-1) ||
            (cellHeadPos.dirNow == 'left' && cellHeadPos.left == 2) ||
            (cellHeadPos.dirNow == 'right' && cellHeadPos.left == playGroundSize[0]-1)
        ){
            pause({hurtLive: true,gameOver:true});

            return;
        }

        moveCount++;

        // console.log(moveCount);

        if(moveDuration > minMoveDuration){
            if(moveCount % moveDurationIncreaseDelay == 0){
                moveDuration = moveDuration - moveDurationIncrease;
                pause();
                start();
                console.log('decreased '+moveDuration+' --- '+(moveCount % moveDurationIncreaseDelay));
                // moveDurationIncreaseDelay = moveDurationIncreaseDelay + 20;
                return;
            }
        }



        for(var i = 1;i<=snakeSize; i++){
            move(i);
        }
        if(createCell){
            // console.log('createCell');
            var cellLast = $('.'+cellObj+'_'+snakeSize);
            var topLast = parseInt(cellLast.attr('data-top'));
            var leftLast = parseInt(cellLast.attr('data-left'));
            var moveLast = cellLast.attr('data-move-now');
            if(moveLast == 'left'){
                var tempCellPos = makePos(leftLast+1,topLast);
                var tempCell = $('<div>').addClass(''+cellObj+' '+cellObj+'_'+(snakeSize+1))
                    .css({'top':tempCellPos.top+'px','left':tempCellPos.left+'px'})
                    .attr('data-no',(snakeSize+1))
                    .attr('data-top',topLast)
                    .attr('data-left',leftLast+1)
                    .attr('data-move-now','left')
                    .attr('data-moving-now','left')
                    .attr('data-move-later','left');

                playGroundSnakeBody.append(tempCell);
            }
            else if(moveLast == 'right'){
                var tempCellPos = makePos(leftLast-1,topLast);
                var tempCell = $('<div>').addClass(''+cellObj+' '+cellObj+'_'+(snakeSize+1))
                    .css({'top':tempCellPos.top+'px','left':tempCellPos.left+'px'})
                    .attr('data-no',(snakeSize+1))
                    .attr('data-top',topLast)
                    .attr('data-left',leftLast-1)
                    .attr('data-move-now','right')
                    .attr('data-moving-now','right')
                    .attr('data-move-later','right');

                playGroundSnakeBody.append(tempCell);
            }
            else if(moveLast == 'up'){
                var tempCellPos = makePos(leftLast,topLast+1);
                var tempCell = $('<div>').addClass(''+cellObj+' '+cellObj+'_'+(snakeSize+1))
                    .css({'top':tempCellPos.top+'px','left':tempCellPos.left+'px'})
                    .attr('data-no',(snakeSize+1))
                    .attr('data-top',topLast+1)
                    .attr('data-left',leftLast)
                    .attr('data-move-now','up')
                    .attr('data-moving-now','up')
                    .attr('data-move-later','up');

                playGroundSnakeBody.append(tempCell);
            }
            else if(moveLast == 'down'){
                var tempCellPos = makePos(leftLast,topLast-1);
                var tempCell = $('<div>').addClass(''+cellObj+' '+cellObj+'_'+(snakeSize+1))
                    .css({'top':tempCellPos.top+'px','left':tempCellPos.left+'px'})
                    .attr('data-no',(snakeSize+1))
                    .attr('data-top',topLast-1)
                    .attr('data-left',leftLast)
                    .attr('data-move-now','down')
                    .attr('data-moving-now','down')
                    .attr('data-move-later','down');

                playGroundSnakeBody.append(tempCell);
            }
            snakeSize++;
            currentScore = currentScore+10;
            createCell = false;
        }
        var cellHeadPos = cellPos(1);

        var meal = mealPos();
        // console.log(meal,cellHeadPos);
        if(meal.top == cellHeadPos.top && meal.left == cellHeadPos.left){
            createCell = true;
            anmZoomBounce($('.'+cellObj+'_1'));
            moveMeal();
        }


    };





    var pause = function(obj_2){
        obj_2 = $.extend({
            hurtLive: false,
            gameOver: false
        },obj_2);

        if(obj_2.gameOver){
            stopForever();
            alert('Game Over');
            return;
        }

        else if(obj_2.hurtLive){
            if(gameLive == 0){
                stopForever();
                alert('Game Over');
                return;
            }
            else{
                gameLive--;
            }
            // alert(gameLive);
            makeSetLive = setLive();
        }
        clearInterval(running);
        running = null;
        clearInterval(updateScore);
        updateScore = null;

    };

    var stopForever = function(){
        clearInterval(running);
        running = false;
        clearInterval(updateScore);
        updateScore = false;
    };

    var start = function(){
        if(running == null)
            running = setInterval(run,moveDuration);
        if(updateScore == null)
            updateScore = setInterval(increaseScore,obj.scoreIncreaseDelay);
    }

    var restart = function(){
        stopForever();
        initGame();

    }

    $(window).blur(function() {
        pause();
    });

    var controlGame = function(keycode){
        keycode = parseInt(keycode);
        switch(keycode) {

            case 67: // c
                clearBestScore();
                break;

            case 82: // r
                restart();
                break;

            case 83: // s
                start();
                break;

            case 37: // left
                moveHead('left');
                break;

            case 38: // up
                moveHead('up');
                break;

            case 39: // right
                moveHead('right');
                break;

            case 40: // down
                moveHead('down');
                break;

            case 17: // ctrl
                pause();
                break;

            case 32: // space
                start();
                break;

            // case 13: // enter
            // createCell = true;
            // break;

            default: return; // exit this handler for other keys
        }
    };

    controlButtonObj.click(function(event){
        event.preventDefault();
        var element = $(this);
        var keycode = element.attr('data-keycode');
        controlGame(keycode);
    });

    $(document).keydown(function(e) {
        controlGame(e.which);

        e.preventDefault(); // prevent the default action (scroll / move caret)
    });


};

var snakeGameParms = {
    playGroundSize: [100,50],
    gridSize: 10,
    moveDurationIncreaseDelay: 300,
};
var playgroundWidth = 1000;
var playgroundMinWidth = 300;
var playgroundMaxWidth = 1000;
var screenWidth = parseInt($(window).width()/100)*100;
// alert(screenWidth);
if(screenWidth > playgroundMinWidth && screenWidth < playgroundMaxWidth)
    playgroundWidth = screenWidth;
else if(screenWidth >= playgroundMaxWidth)
    playgroundWidth = playgroundMaxWidth;
else
    playgroundWidth = playgroundMinWidth;

snakeGameParms.gridSize = playgroundWidth/ 100;

snakeGameParms.playGroundSize[0] = playgroundWidth/snakeGameParms.gridSize;
snakeGameParms.playGroundSize[1] = snakeGameParms.playGroundSize[0]/2;



snakeGame(snakeGameParms);