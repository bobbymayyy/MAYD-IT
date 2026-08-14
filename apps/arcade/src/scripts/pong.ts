const canvas = document.querySelector('#pong');
const leftScoreNode = document.querySelector('#left-score');
const rightScoreNode = document.querySelector('#right-score');
if (canvas instanceof HTMLCanvasElement && leftScoreNode instanceof HTMLElement && rightScoreNode instanceof HTMLElement) {
  const ctx = canvas.getContext('2d'), keys = new Set();
  const paddle = { w: 12, h: 82, speed: 6 };
  let leftY=canvas.height/2-paddle.h/2, rightY=leftY, leftScore=0, rightScore=0;
  let ball={x:canvas.width/2,y:canvas.height/2,vx:0,vy:0,r:7};
  const serve=(direction=Math.random()>.5?1:-1)=>{if(ball.vx!==0)return;ball.vx=5*direction;ball.vy=Math.random()*4-2;};
  const resetBall=()=>{ball={...ball,x:canvas.width/2,y:canvas.height/2,vx:0,vy:0};};
  const updateScores=()=>{leftScoreNode.textContent=String(leftScore).padStart(2,'0');rightScoreNode.textContent=String(rightScore).padStart(2,'0');};
  document.addEventListener('keydown',(e)=>{keys.add(e.key.toLowerCase());if(['w','s','arrowup','arrowdown',' '].includes(e.key.toLowerCase()))e.preventDefault();if(e.key===' ')serve();});
  document.addEventListener('keyup',(e)=>keys.delete(e.key.toLowerCase()));
  const update=()=>{
    if(keys.has('w'))leftY-=paddle.speed;if(keys.has('s'))leftY+=paddle.speed;if(keys.has('arrowup'))rightY-=paddle.speed;if(keys.has('arrowdown'))rightY+=paddle.speed;
    leftY=Math.max(0,Math.min(canvas.height-paddle.h,leftY));rightY=Math.max(0,Math.min(canvas.height-paddle.h,rightY));
    ball.x+=ball.vx;ball.y+=ball.vy;if(ball.y-ball.r<=0||ball.y+ball.r>=canvas.height)ball.vy*=-1;
    if(ball.vx<0&&ball.x-ball.r<=30+paddle.w&&ball.x>30&&ball.y>=leftY&&ball.y<=leftY+paddle.h){ball.vx=Math.abs(ball.vx)+.2;ball.vy+=((ball.y-(leftY+paddle.h/2))/paddle.h)*3;}
    if(ball.vx>0&&ball.x+ball.r>=canvas.width-30-paddle.w&&ball.x<canvas.width-30&&ball.y>=rightY&&ball.y<=rightY+paddle.h){ball.vx=-(Math.abs(ball.vx)+.2);ball.vy+=((ball.y-(rightY+paddle.h/2))/paddle.h)*3;}
    if(ball.x<-20){rightScore++;updateScores();resetBall();}if(ball.x>canvas.width+20){leftScore++;updateScores();resetBall();}
  };
  const draw=()=>{if(!ctx)return;ctx.fillStyle='#020702';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#183318';ctx.setLineDash([8,10]);ctx.beginPath();ctx.moveTo(canvas.width/2,0);ctx.lineTo(canvas.width/2,canvas.height);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#7cff72';ctx.fillRect(30,leftY,paddle.w,paddle.h);ctx.fillRect(canvas.width-30-paddle.w,rightY,paddle.w,paddle.h);ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();if(ball.vx===0){ctx.fillStyle='#8fa88f';ctx.font='14px ui-monospace';ctx.textAlign='center';ctx.fillText('SPACE TO SERVE',canvas.width/2,canvas.height/2+48);}};
  const loop=()=>{update();draw();requestAnimationFrame(loop);};updateScores();loop();
}
