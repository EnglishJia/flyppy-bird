function Pipe(pipe_up, pipe_down, step, x){
    this.pipe_up = pipe_up;
    this.pipe_down = pipe_down;
    this.step = step;
    //定义上管子的高
    this.up_height = parseInt(Math.random() * 249) + 1;
    //下管子的高
    this.down_height = 250 - this.up_height;
    this.x = x;
    //为了管子自己的移动  所以要设置计数器
    this.count = 0;
}


//创建多根管子
Pipe.prototype.createPipe = function(){
    return new Pipe(this.pipe_up, this.pipe_down, this.step, this.x);
}