window.onload = function(){

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;

    init();

    function init(){

        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();

    }

    function refreshCanvas(){

        snakee.move();

        if(snakee.checkCollision()){
            gameOver();
        }else{
            if(snakee.isEatApple(applee)){
                score++;
                snakee.ateApple = true;
                do{
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw(); 
            drawScore();
            setTimeout(refreshCanvas,delay);

        }
    }

    function gameOver(snakee){
        ctx.save();
        ctx.fillText("Game Over", 100, 100);
        ctx.fillText("Appuyer sur la touche espace pour rejouer",5,30);
        ctx.restore();
    }

    function restart(){
        snakee = new Snake([[6,4],[5,4],[4,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.fillText(score.toString(), 5, canvasHeight - 5);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction){

        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){

            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
                
        };

        this.move = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0]--;
                    break;

                case "right":
                    nextPosition[0]++;
                    break;

                case "top":
                    nextPosition[1]--;
                    break;

                case "bot":
                    nextPosition[1]++;
                    break;
                default:
                    throw("invald direction");
            }
                this.body.unshift(nextPosition);
                if(!this.ateApple){
                    this.body.pop();
                }else{
                    this.ateApple = false;
                }
        };

        this.setDirection = function(newDirection){
            var allowedDirections;

            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["top", "bot"];
                    break;

                case "top":
                case "bot":
                    allowedDirections = ["right", "left"];
                    break;
                default:
                    throw("invald direction");
            }
            
            if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;

            }
        };

        //Check if the snake hit a wall or him self
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            
            //if the coordonates x y of the snake exceeds the width and height wallCollision become true
            if((snakeX < 0 || snakeX > widthInBlocks - 1) || (snakeY < 0 || snakeY > heightInBlocks - 1)){
                wallCollision = true;
            }

            //snakeCollision becomes true if the coordinates x and y of the snake's head and rest of his body are equal
            for(var i = 0; i < rest.length ; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision = true; 
                }
            }

            return wallCollision || snakeCollision;

        };

        //return true if the apple was eaten by the snake
        this.isEatApple = function(appleToEat){
            isEat = false;
            var head = this.body[0];  

           //isEat becomes true if the coordinates x and y of the snake's head and the apple are equal
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                isEat = true; 
            }
            

            return isEat;
        }
    }

    //Classe Apple
    function Apple(position){
        //attribute
        this.position = position;

        //Draw the apple on the canvas
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();

            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y,radius, 0, Math.PI*2, true); 
            ctx.fill();
            ctx.restore();
        };

        //Set the new position of the apple everytime she's eaten by the snake
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));

            this.position = [newX,newY]; //change the current position of the apple by the news
        };

        //Check if the new position of the apple is on the snake return true if she is on
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;

            //browse the snake body and we check it with the postion of the apple
            for(var i = 0 ; i < snakeToCheck.body.length ; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }

            return isOnSnake;
        };
    }

    //Bound the keybord key with the direction 
    document.onkeydown = function handleKeydown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
            newDirection = "left";
                break;

            
            case 38:
            newDirection = "top";
                break;

            case 39:
            newDirection = "right";
                break;

            case 40:
            newDirection = "bot";
                break;

            case 32:
                restart();
                return;
                break;
                
        
            default:
                return;          
        }
        snakee.setDirection(newDirection);
    }

}