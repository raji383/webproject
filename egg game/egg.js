window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width=1280;
    canvas.height = 720;

    ctx.fillStyle ='white';
    ctx.linewidth=3;
    ctx.strokeStyle='white';

    class Player {
        constructor(game){
            this.game=game;
            this.collisinoX=this.game.width*0.5;
            this.collisinoY=this.game.height*0.5;
            this.collisinoRadius=30;
            this.speedX=0;
            this.speedY=0;
            this.dx=0;
            this.dy=0;
            this.speedModifier=5;
            this.spriteWidth=255;
            this.spriteHeight=255;
            this.width=this.spriteWidth;
            this.height=this.spriteHeight;
            this.frameX=0;
            this.frameY=0;
            this.spriteX;
            this.spriteY;
            this.image=document.getElementById('bull')
        }
        draw(context){
            context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.spriteX,this.spriteY,this.width,this.height)
            if (this.game.debug) {
                context.beginPath();
                context.arc(this.collisinoX,this.collisinoY,this.collisinoRadius,0,Math.PI*2)
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                context.beginPath();
                context.moveTo(this.collisinoX,this.collisinoY);
                context.lineTo(this.game.mouse.x,this.game.mouse.y);
                context.stroke();
            }
            
        }
        updat(){
            this.dx=this.game.mouse.x-this.collisinoX;
            this.dy=this.game.mouse.y-this.collisinoY;
            //animation
            const angle = Math.atan2(this.dy,this.dx);
            if (angle<-2.74||angle>2.74) {
                this.frameY=6
            }else if (angle<-1.96) {
                this.frameY=7
            }else if (angle<-1.17) {
                this.frameY=0
            }else if (angle<-0.39) {
                this.frameY=1
            }else if (angle<0.39) {
                this.frameY=2
            }else if (angle<1.17) {
                this.frameY=3
            }else if (angle<1.96) {
                this.frameY=4
            }else if (angle<2.74) {
                this.frameY=5
            }
            
            const distance =Math.hypot(this.dy,this.dx);
            if (distance>this.speedModifier){
                this.speedX=this.dx/distance  ||0;
                this.speedY=this.dy/distance||0;
            }else {
                this.speedX=0;
                this.speedY=0;
            }
            this.collisinoX+=this.speedX*this.speedModifier;
            this.collisinoY+=this.speedY*this.speedModifier;
            this.spriteX=this.collisinoX-this.width*0.5;
            this.spriteY=this.collisinoY-this.height*0.5-100;
            //horizntal boundaries
            if(this.collisinoX<this.collisinoRadius)this.collisinoX=this.collisinoRadius;
            else if (this.collisinoX>this.game.width-this.collisinoRadius)this.collisinoX=this.game.width-this.collisinoRadius;
            //horizntal boundaries
            if(this.collisinoY<this.game.topMargin+this.collisinoRadius)this.collisinoY=this.game.topMargin+this.collisinoRadius;
            else if (this.collisinoY>this.game.height-this.collisinoRadius)this.collisinoY=this.game.height-this.collisinoRadius;
            //collisions with 
            this.game.obstacles.forEach(obstacle=>{
                let [collisino,distance,sumOfRadii,dx,dy]=this.game.checkCollision(this,obstacle);
                /*let collisino=this.game.checkCollision(this,obstacle)[0];
                let distance=this.game.checkCollision(this,obstacle)[1];
                let sumOfRadii=this.game.checkCollision(this,obstacle)[2];
                let dx=this.game.checkCollision(this,obstacle)[3];
                let dy=this.game.checkCollision(this,obstacle)[4];*/
                if (collisino) {
                    const unit_x=dx/distance;
                    const unit_y=dy/distance;
                    this.collisinoX=obstacle.collisinoX+(sumOfRadii+1)*unit_x;
                    this.collisinoY=obstacle.collisinoY+(sumOfRadii+1)*unit_y;
                }
            });
            
        }
    }
    class Obstacle{
        constructor(game){
            this.game=game;
            this.collisinoX=Math.random()*this.game.width;
            this.collisinoY=Math.random()*this.game.height;
            this.collisinoRadius=40;
            this.image = document.getElementById('obstacles');
            this.spriteWidth=250;
            this.spriteHeight=250;
            this.width=this.spriteWidth;
            this.height=this.spriteHeight;
            this.spriteX=this.collisinoX-this.width*0.5;
            this.spriteY=this.collisinoY-this.height*0.5-70;
            this.frameX=Math.floor(Math.random()*4);
            this.frameY=Math.floor(Math.random()*3);
        }
        draw(context){
            context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.spriteX,this.spriteY,this.width,this.height)
            if (this.game.debug) {
                context.beginPath();
                context.arc(this.collisinoX,this.collisinoY,this.collisinoRadius,0,Math.PI*2)
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
         
        }
        updat(){

        }
    }
    class Egg{
        constructor(game){
            this.game=game;
            this.collisinoRadius=40;
            this.margin=this.collisinoRadius*2;
            this.collisinoX=this.margin+ (Math.random()*(this.game.width-this.margin*2));
            this.collisinoY=this.game.topMargin+(Math.random()*(this.game.height-this.game.topMargin-this.margin));
            this.image=document.getElementById('egg');
            this.spriteWidth=110;
            this.spriteHeight=135;
            this.width=this.spriteWidth;
            this.height=this.spriteHeight;
            this.spriteX;
            this.spriteY;

        }
        draw(context){
            context.drawImage(this.image,this.spriteX,this.spriteY);
            if (this.game.debug) {
                context.beginPath();
                context.arc(this.collisinoX,this.collisinoY,this.collisinoRadius,0,Math.PI*2)
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
        }
        updat(){
            this.spriteX=this.collisinoX-this.width*0.5;
            this.spriteY=this.collisinoY-this.height*0.5-30;
            let collisinoObject =[this.game.player,...this.game.obstacles];
            collisinoObject.forEach(object=>{
                let [collisino,distance,sumOfRadii,dx,dy]=this.game.checkCollision(this,object);
                if (collisino) {
                    const unit_x=dx/distance;
                    const unit_y=dy/distance;
                    this.collisinoX=object.collisinoX+(sumOfRadii+1)*unit_x;
                    this.collisinoY=object.collisinoY+(sumOfRadii+1)*unit_y;
                }
            });
        }
    }
    class Enemy {
        constructor(game){
            this.game=game;
            this.collisinoX=this.game.width;
            this.collisinoY=Math.random()* this.game.height;
            this.collisinoRadius=30;
            this.speedX=Math.random()*3+0.5;
            this.image = document.getElementById('toad');
            this.spriteWidth=140;
            this.spriteHeight=260;
            this.width=this.spriteWidth;
            this.height=this.spriteHeight;
            this.spriteX=this.collisinoX-this.width*0.5;
            this.spriteY=this.collisinoY-this.height*0.5-70;
            this.frameY=Math.floor(Math.random()*3);
        }
        draw(context){
            context.drawImage(this.image,this.spriteWidth,this.spriteHeight);
            if (this.game.debug) {
                context.beginPath();
                context.arc(this.collisinoX,this.collisinoY,this.collisinoRadius,0,Math.PI*2)
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
        }
        updat(){
            this.collisinoX-=this.speedX;
            if (this.spriteX+this.width<0) {
                this.collisinoX=this.game.width;
                this.collisinoY=Math.random()* this.game.height;
            }
        }
    }
    class Game {
        constructor(canvas){
            this.canvas =canvas;
            this.width=this.canvas.width;
            this.height=this.canvas.height;
            this.topMargin=260;
            this.debug =true;
            this.player=new Player(this);
            this.obstacle=new Obstacle(this);
            this.fps=70;
            this.timer=0;
            this.interval=1000/this.fps;
            this.eggTimer=0;
            this.eggInterval=500;
            this.numberOfObstcales=5;
            this.maxEggs=10;
            this.obstacles=[];
            this.eggs=[];
            this.gameObjects=[];
            this.enemies=[];
            this.mouse = {
                x:this.width*0.5,
                y:this.height*0.5,
                pressed:false,
            }
            //event listeners
            canvas.addEventListener('mousedown',(e)=>{
                this.mouse.x=e.offsetX;
                this.mouse.y=e.offsetY;
                this.mouse.pressed=true;
            });
            canvas.addEventListener('mouseup',(e)=>{
                this.mouse.x=e.offsetX;
                this.mouse.y=e.offsetY;
                this.mouse.pressed=false;
            });
            canvas.addEventListener('mousemove',(e)=>{
                if (this.mouse.pressed){
                    this.mouse.x=e.offsetX;
                    this.mouse.y=e.offsetY;
                }
               
            });
            window.addEventListener('keydown',e=>{
                if (e.key=='d'){
                  this.debug=!this.debug;
                }
            });
        }
        render(context,deltaTime){
            if (this.timer>this.interval) {
                context.clearRect(0,0,this.width,this.height);
                this.gameObjects=[this.player,...this.eggs,...this.obstacles];
                    //sort by vertical postion
                    this.gameObjects.sort((a,b)=>{
                        return a.collisinoY-b.collisinoY;
                    });
                    this.gameObjects.forEach(object=>{
                        object.draw(context)
                        object.updat();
                    });
                
                this.timer=0;
            }
            this.timer+=deltaTime;  
            //add egg
            if (this.eggTimer>this.eggInterval&&this.eggs.length<this.maxEggs) {
                this.addEgg();
                this.eggTimer=0;
                console.log(this.eggs)
            }else{
                this.eggTimer+=deltaTime;
            }
        }
        checkCollision(a,b){
            const dx = a.collisinoX-b.collisinoX;
            const dy = a.collisinoY-b.collisinoY;
            const distance = Math.hypot(dy,dx);
            const sumOfRadii = a.collisinoRadius+b.collisinoRadius;
            return  [(distance<sumOfRadii),distance,sumOfRadii,dx,dy];
        }
        addEgg(){
            this.eggs.push(new Egg(this));
        }
        addEnemy(){
            this.enemies.push(new Enemy(this));
        }
        init(){
            for (let i = 0; i < 3; i++) {
               this.addEnemy();
            }
          let attempts =0;
          while(this.obstacles.length<this.numberOfObstcales&&attempts<500){
            let testObstacle = new Obstacle(this);
            let overlap =false;
            this.obstacles.forEach(obstacle=>{
                const dx=testObstacle.collisinoX-obstacle.collisinoX;
                const dy=testObstacle.collisinoY-obstacle.collisinoY;
                const distance=Math.hypot(dy,dx);
                const distanceBuffer =150;
                const sumOfRadii =testObstacle.collisinoRadius+obstacle.collisinoRadius+distanceBuffer;
                if (distance<sumOfRadii){
                    overlap =true;
                }
            });
            const margin = testObstacle.collisinoRadius*2;
            if (!overlap && testObstacle.spriteX>0
                && testObstacle.spriteX<this.width-testObstacle.width
                && testObstacle.collisinoY>this.topMargin
                && testObstacle.collisinoY<this.height-margin
            ) {
                this.obstacles.push(testObstacle);
            }
            attempts++
          }
        }
    }
    const game = new Game(canvas);
    game.init();
   let lastTime =0;
    function animation(timeStamp){
        const deltaTime = timeStamp-lastTime;
        lastTime=timeStamp;
        game.render(ctx,deltaTime);
       requestAnimationFrame(animation);
    }
    animation(0)
});