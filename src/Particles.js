import React, { Component } from 'react'

class Particles extends Component {
  constructor(props) {
    super();

    this.state = {
      R: 2,
      alpha_f: 0.03,
      alpha_phase: 0,
      link_line_width: 1.5,
      dis_limit: 260,
      add_mouse_point: true,
      ball_color: {
        r: 207,
        g: 255,
        b: 4
      },
    };

    this.canvas = null;
    this.ctx = null;
    this.can_w = null;
    this.can_h = null;
    this.mouse_in = false;

    this.mouse_ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      type: 'mouse'
    }
  
    this.ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0
   }
   this.balls = []

   this.build = this.build.bind(this)
   this.renderBalls = this.renderBalls.bind(this)
   this.updateBalls = this.updateBalls.bind(this)
   this.mouseEnter = this.mouseEnter.bind(this)
   this.mouseMove = this.mouseMove.bind(this)
   this.mouseLeave = this.mouseLeave.bind(this)
   this.windowResize = this.windowResize.bind(this)
  }

  getRandomSpeed(pos){
    var  min = -1, max = 1;
    switch(pos){
      case 'top':
        return [this.randomNumFrom(min, max), this.randomNumFrom(0.1, max)];
      case 'right':
       return [this.randomNumFrom(min, -0.1), this.randomNumFrom(min, max)];
      case 'bottom':
       return [this.randomNumFrom(min, max), this.randomNumFrom(min, -0.1)];
      case 'left':
        return [this.randomNumFrom(0.1, max), this.randomNumFrom(min, max)];
      default:
        return;
    }
  }
  
  // Random speed
  randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
  }
  
  // Random Ball
  getRandomBall() {
    var pos = this.randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch (pos) {
      case 'top':
        return {
          x: this.randomSidePos(this.can_w),
            y: -this.state.R,
            vx: this.getRandomSpeed('top')[0],
            vy: this.getRandomSpeed('top')[1],
            r: this.state.R,
            alpha: 1,
            phase: this.randomNumFrom(0, 10)
        }
      case 'right':
        return {
          x: this.can_w + this.state.R,
            y: this.randomSidePos(this.can_h),
            vx: this.getRandomSpeed('right')[0],
            vy: this.getRandomSpeed('right')[1],
            r: this.state.R,
            alpha: 1,
            phase: this.randomNumFrom(0, 10)
        }
      case 'bottom':
        return {
          x: this.randomSidePos(this.can_w),
            y: this.can_h + this.state.R,
            vx: this.getRandomSpeed('bottom')[0],
            vy: this.getRandomSpeed('bottom')[1],
            r: this.state.R,
            alpha: 1,
            phase: this.randomNumFrom(0, 10)
        }
      case 'left':
        return {
          x: -this.state.R,
            y: this.randomSidePos(this.can_h),
            vx: this.getRandomSpeed('left')[0],
            vy: this.getRandomSpeed('left')[1],
            r: this.state.R,
            alpha: 1,
            phase: this.randomNumFrom(0, 10)
        }
        default:
          return;
    }
  }

  randomSidePos(length){
    return Math.ceil(Math.random() * length);
  }

  // Draw Ball
  async renderBalls(){
    let ctx = this.ctx;
    let R = this.state.R;
    let ball_color = this.state.ball_color;
    Array.prototype.forEach.call(this.balls, function(b){
      if(!b.hasOwnProperty('type')){
        ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
        ctx.beginPath();
        ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
      }
    });

    this.ctx = ctx;
  }

  // Update balls
  updateBalls(){
    var new_balls = [];
    let can_w = this.can_w;
    let can_h = this.can_h;
    let alpha_f = this.state.alpha_f
    Array.prototype.forEach.call(this.balls, function(b){
      b.x += b.vx;
      b.y += b.vy;
      
      if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
        new_balls.push(b);
      }
      
      // alpha change
      b.phase += alpha_f;
      b.alpha = Math.abs(Math.cos(b.phase));
    // console.log(b.alpha);
    });
    this.balls = new_balls.slice(0);
  }

  // Draw lines
  renderLines() {
    var fraction, alpha;
    for (var i = 0; i < this.balls.length; i++) {
      for (var j = i + 1; j < this.balls.length; j++) {

        fraction = this.getDisOf(this.balls[i], this.balls[j]) / this.state.dis_limit;

        if (fraction < 1) {
          alpha = (1 - fraction).toString();

          this.ctx.strokeStyle = 'rgba(0,0,50,' + alpha + ')';
          this.ctx.lineWidth = this.state.link_line_width;

          this.ctx.beginPath();
          this.ctx.moveTo(this.balls[i].x, this.balls[i].y);
          this.ctx.lineTo(this.balls[j].x, this.balls[j].y);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  }

  // calculate distance between two points
  getDisOf(b1, b2) {
    var delta_x = Math.abs(b1.x - b2.x),
      delta_y = Math.abs(b1.y - b2.y);

    return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
  }

  // add balls if there a little balls
  addBallIfy() {
    if (this.balls.length < 20) {
      this.balls.push(this.getRandomBall());
    }
  }

  // Render
  build() {
    this.ctx.clearRect(0, 0, this.can_w, this.can_h);

    this.renderBalls();
    this.renderLines();
    this.updateBalls();
    this.addBallIfy();

    window.requestAnimationFrame(this.build);
  }

  // Init Balls
  initBalls(num) {
    for (var i = 1; i <= num; i++) {
      this.balls.push({
        x: this.randomSidePos(this.can_w),
        y: this.randomSidePos(this.can_h),
        vx: this.getRandomSpeed('top')[0],
        vy: this.getRandomSpeed('top')[1],
        r: this.state.R,
        alpha: 1,
        phase: this.randomNumFrom(0, 10)
      });
    }
  }
  
  // Init Canvas
  initCanvas(){
    this.canvas.setAttribute('width', window.innerWidth);
    this.canvas.setAttribute('height', window.innerHeight);
  
    this.can_w = parseInt(this.canvas.getAttribute('width'));
    this.can_h = parseInt(this.canvas.getAttribute('height'));
  }

  goMovie(){
    this.initCanvas();
    this.initBalls(30);
    window.requestAnimationFrame(this.build);
  }

  mouseEnter() {
    this.mouse_in = true;
    this.balls.push(this.mouse_ball);
  }

  mouseMove(e) {
    var e = e || window.event;
    this.mouse_ball.x = e.pageX;
    this.mouse_ball.y = e.pageY;
  }

  mouseLeave() {
    this.mouse_in = false;
      var new_balls = [];
      Array.prototype.forEach.call(this.balls, function(b){
        if(!b.hasOwnProperty('type')){
          new_balls.push(b);
        }
      });
      this.balls = new_balls.slice(0);
  }

  windowResize() {
    this.initCanvas();
  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(1, 1);
    this.goMovie();
  }

  render() {
    return (
      <canvas id="particles" ref="canvas" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onMouseMove={(e) => this.mouseMove(e)}></canvas>
    )
  }
}

export default Particles;