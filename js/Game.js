function Game(ctx, bird, pipe, land, mountain){
    this.ctx = ctx;
    this.bird = bird;
    //因为管子有好几个 所以将每一个管子定义在数组中
    this.pipeArr = [pipe];
    this.land = land;
    this.mountain = mountain;
    this.timer = null;
    this.iframe = 0;


    //初始化
    this.init();
}


//初始化方法
Game.prototype.init = function(){
    this.start();
    this.bindEvent();
}

//渲染mountain
Game.prototype.renderMountain = function(){
    var img = this.mountain.img;
    //图片移动
    this.mountain.x -= this.mountain.step;

    //判断边界
    if (this.mountain.x < -img.width){
        this.mountain.x = 0;
    }
    //渲染图片
    this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
    this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
    this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);

    
}
//渲染land
Game.prototype.renderLand = function(){
    var img = this.land.img;
    this.land.x -= this.land.step;
    //判断边界
    if(this.land.x < -img.width){
        this.land.x = 0;
    }
    this.ctx.drawImage(img, this.land.x, this.land.y);
    this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
    this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y);
}




//游戏开始方法
Game.prototype.start = function(){
    //缓存this
    var me = this;
    //给timer赋值
    this.timer = setInterval(function(){
        //小鸟扇动翅膀的帧自加
        me.iframe++;
        //清屏
        me.clear();
        // me.checkPX();
        //移动
        //渲染
        me.renderMountain();
        me.renderLand();
        me.renderBird();
        me.clearPipe();
        if(!(me.iframe % 10)){
            me.bird.fly();
        }
        //鸟下降
        me.bird.fallDown();
        me.renderPipe();
        me.renderBirdPoints();     // 因为管子要移动 所以要先对管子进行描边再进行移动    注意调整与move的顺序
        me.renderPipePoints();       // 因为管子要移动 所以要先对管子进行描边再进行移动   注意调整与move的顺序
        me.movePipe();
        //让iframe每65次之后创建一根管子
        if(!(me.iframe % 65)) {
            me.createPipe();
        }
        me.clearPipe();
        me.checkBoom();
    },20)
}

//清屏的方法
Game.prototype.clear = function(){
    this.ctx.clearRect(0, 0, 360, 512);
}





//渲染鸟的方法
Game.prototype.renderBird = function(){
    var img = this.bird.img;
    //保存状态
    this.ctx.save();
    //移动坐标轴
    this.ctx.translate(this.bird.x, this.bird.y);
    //给小鸟添加矩形框    因为线框过大 所以要进行数据修正
    // this.ctx.strokeRect(-this.bird.img.width / 2 + 6, -this.bird.img.height / 2 + 6, this.bird.img.width - 12, this.bird.img.height - 12);
    //旋转
    var deg = this.bird.state === "D" ? Math.PI / 180 * this.bird.speed : -Math.PI / 180 * this.bird.speed;
    this.ctx.rotate(deg);
    //渲染鸟
    this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
    //恢复状态
    this.ctx.restore();
}


//绑定点击事件 让鸟上升
Game.prototype.bindEvent = function(){
    //备份this值
    var me = this;
    //添加点击事件
    this.ctx.canvas.onclick = function(){
        me.bird.goUp();
    }
}



//渲染管子  使用的是ctx.drawImage第三种截取的方法  参数是九个参数
Game.prototype.renderPipe = function(){
    //备份this值
    var me = this;
    //管子存放于数组中  所以要使用循环的方式渲染图片
    this.pipeArr.forEach(function(value, index){
        //获取上管子的图片
        var img_up = value.pipe_up;
        //图片的x/y/w/h值
        var img_x = 0;
        var img_y = img_up.height - value.up_height;
        var img_w = img_up.width;
        var img_h = value.up_height;
        //在canvas上的x/y/w/h值
        var canvas_x = me.ctx.canvas.width - value.step * value.count;
        var canvas_y = 0;
        var canvas_w = img_w;
        var canvas_h = value.up_height;
        //绘制图片
        me.ctx.drawImage(img_up, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);

        //获取下管子的图片
        var img_down = value.pipe_down;
        //图片的x/y/w/h值
        var img_down_x = 0;
        var img_down_y = 0;
        var img_down_w = img_down.width;
        var img_down_h = value.down_height;
        var img_canvas_x = me.ctx.canvas.width - value.step * value.count;
        var img_canvas_y = canvas_h + 150;
        var img_canvas_w = img_down_w;
        var img_canvas_h = value.down_height;
        //绘制下管子
        me.ctx.drawImage(img_down, img_down_x, img_down_y, img_down_w, img_down_h, img_canvas_x, img_canvas_y, img_canvas_w, img_canvas_h);

    }) 
}

//管子移动
Game.prototype.movePipe = function(){
    var me = this;
    this.pipeArr.forEach(function(value){
        value.count++;
    })
}
//创建管子
Game.prototype.createPipe = function(){
    var pipe = this.pipeArr[0].createPipe();
    this.pipeArr.push(pipe);
}


//清除管子
Game.prototype.clearPipe = function(){
    // 需要循环pipeArr中的每一项并且进行删除
    for (var i = 0; i < this.pipeArr.length; i++) {
        var pipe = this.pipeArr[i];
        //判断图片在canvas中的值
        if (pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width) {
            this.pipeArr.splice(i, 1);
            return;
        }
    }
}


//绘制鸟的四个点
Game.prototype.renderBirdPoints = function(){
    //绘制鸟的A/B/C/D点   此点的坐标轴要与管子的坐标轴一致才能进行碰撞验证
    var bird_A = {
        x : -this.bird.img.width / 2 + 6 + this.bird.x,
        y : -this.bird.img.height / 2 + 6 + this.bird.y
    }
    var bird_B = {
        x : bird_A.x + this.bird.img.width - 12,
        y : bird_A.y
    }
    var bird_C = {
        x : bird_A.x,
        y : bird_A.y + this.bird.img.height - 12
    }
    var bird_D = {
        x : bird_B.x,
        y : bird_C.y
    }

    //绘制矩形
    this.ctx.beginPath();
    this.ctx.moveTo(bird_A.x, bird_A.y);
    this.ctx.lineTo(bird_B.x, bird_B.y);
    this.ctx.lineTo(bird_D.x, bird_D.y);
    this.ctx.lineTo(bird_C.x, bird_C.y);
    this.ctx.closePath();
    // this.ctx.strokeStyle = "blue";
    // this.ctx.stroke();    
}

//绘制管子(上下管子)的八个点
Game.prototype.renderPipePoints = function(){
    //因为管子有好多个 所以要使用循环进行选中管子并对其添加边框
    for (var i = 0; i < this.pipeArr.length; i ++){
        var pipe = this.pipeArr[i];


        //绘制上管子的四个点
        var pipe_A = {
            x : pipe.x - pipe.step * pipe.count,
            y : 0
        }
        var pipe_B = {
            x : pipe_A.x + pipe.pipe_up.width,
            y : 0
        }
        var pipe_C = {
            x : pipe_A.x,
            y : pipe_A.y + pipe.up_height
        }
        var pipe_D = {
            x : pipe_B.x,
            y : pipe_C.y
        }
        //绘制矩形
        this.ctx.beginPath();
        this.ctx.moveTo(pipe_A.x, pipe_A.y);
        this.ctx.lineTo(pipe_B.x, pipe_B.y);
        this.ctx.lineTo(pipe_D.x, pipe_D.y);
        this.ctx.lineTo(pipe_C.x, pipe_C.y);
        this.ctx.closePath();
        // this.ctx.strokeStyle = "blue";
        // this.ctx.stroke();  



        //绘制下管子的四个点
        var pipe_down_A = {
            x : pipe.x - pipe.step * pipe.count,
            y : pipe.up_height + 150
        }
        var pipe_down_B = {
            x : pipe_A.x + pipe.pipe_up.width,
            y : pipe.up_height + 150
        }
        var pipe_down_C = {
            x : pipe_A.x,
            y : 400
        }
        var pipe_down_D = {
            x : pipe_B.x,
            y : 400
        }
        //绘制矩形
        this.ctx.beginPath();
        this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
        this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
        this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
        this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
        this.ctx.closePath();
        // this.ctx.strokeStyle = "blue";
        // this.ctx.stroke(); 
        
    }
}


//添加触碰验证事件
Game.prototype.checkBoom = function(){
    //将管子和小鸟的点全部拿到此处进行比较判断
    for (var i = 0; i < this.pipeArr.length; i ++){
        var pipe = this.pipeArr[i];


        //绘制上管子的四个点
        var pipe_A = {
            x : pipe.x - pipe.step * pipe.count,
            y : 0
        }
        var pipe_B = {
            x : pipe_A.x + pipe.pipe_up.width,
            y : 0
        }
        var pipe_C = {
            x : pipe_A.x,
            y : pipe_A.y + pipe.up_height
        }
        var pipe_D = {
            x : pipe_B.x,
            y : pipe_C.y
        }

         //绘制下管子的四个点
         var pipe_down_A = {
            x : pipe.x - pipe.step * pipe.count,
            y : pipe.up_height + 150
        }
        var pipe_down_B = {
            x : pipe_A.x + pipe.pipe_up.width,
            y : pipe.up_height + 150
        }
        var pipe_down_C = {
            x : pipe_A.x,
            y : 400
        }
        var pipe_down_D = {
            x : pipe_B.x,
            y : 400
        }

        //鸟的四个点
        var bird_A = {
            x : -this.bird.img.width / 2 + 6 + this.bird.x,
            y : -this.bird.img.height / 2 + 6 + this.bird.y
        }
        var bird_B = {
            x : bird_A.x + this.bird.img.width - 12,
            y : bird_A.y
        }
        var bird_C = {
            x : bird_A.x,
            y : bird_A.y + this.bird.img.height - 12
        }
        var bird_D = {
            x : bird_B.x,
            y : bird_C.y
        }

        //判断碰撞
        //用小鸟的B点与上管子的A点进行比较
        if (bird_B.x >= pipe_C.x && bird_B.y <= pipe_C.y && bird_A.x <= pipe_D.x) {
            this.gameOver();
        }
        //用小鸟的D点与下管子的A点进行比较
        if (bird_D.x >= pipe_down_A.x && bird_D.y >= pipe_down_A.y && bird_A.x <= pipe_down_B.x) {
            this.gameOver();
        }
    }
    
}
//游戏结束事件
Game.prototype.gameOver = function(){
    //让定时器结束
    clearInterval(this.timer);
}



//像素检测 
Game.prototype.checkPX = function(){
    //清屏
    this.ctx.clearRect(0, 0, 360, 512);
    //保存状态
    this.ctx.save();
    //渲染管子
    this.renderPipe();
    //运用方法  融合
    this.ctx.globalCompositeOperation = "source-in";
    //渲染鸟
    this.renderBird();
    //恢复状态
    this.ctx.restore();

    //获取canvas上的像素信息
    var imgData = this.ctx.getImageData(0, 0, 360, 512);
    for (var i = 0; i < imgData.data.length; i++) {
        if (imgData.data[i]) {
            this.gameOver();
            return;
        }
    }
}