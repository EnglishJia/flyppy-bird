function Bird(imgArr, x, y){
    this.imgArr = imgArr;
    //定义图片的索引值
    this.index = parseInt(Math.random() * imgArr.length);
    //精确一张鸟的图片
    this.img = this.imgArr[this.index];
    this.x = x;
    this.y = y;
    //定义一个鸟的状态
    this.state = "D";   //D表示向下  u表示上升
    //为了确保速度不要过快再定义一个speed属性
    this.speed = 0;
}

//鸟飞
Bird.prototype.fly = function(){
    this.index++;
    if(this.index > this.imgArr.length - 1){
        this.index = 0;
    }
    this.img = this.imgArr[this.index];
}

//鸟下降
Bird.prototype.fallDown = function(){
    //判断鸟的状态
    if (this.state === "D") { 
        this.speed++;
        this.y += Math.sqrt(this.speed);
    } else {
        this.speed--;
        if(this.speed == 0){
            this.state = "D";
            return;
        }
        this.y -= Math.sqrt(this.speed);
    }
}
//鸟上升
Bird.prototype.goUp = function(){
    this.speed = 20;
    //改变鸟的状态
    this.state = "U";
}