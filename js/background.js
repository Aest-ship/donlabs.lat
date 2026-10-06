// background: drifting points joined by faint lines
(function(){
 var c=document.getElementById('bg'),x=c.getContext('2d'),P=[],W,H,still=matchMedia('(prefers-reduced-motion:reduce)').matches;
 function size(){W=c.width=innerWidth;H=c.height=innerHeight;P=[];var n=Math.min(70,Math.floor(W*H/18000));for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25})}
 function draw(){
  x.clearRect(0,0,W,H);
  for(var i=0;i<P.length;i++){var a=P[i];if(!still){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1}
   x.shadowColor='rgba(90,150,255,.9)';x.shadowBlur=6;x.fillStyle='rgba(215,230,255,.85)';x.fillRect(a.x,a.y,2,2);x.shadowBlur=0;
   for(var j=i+1;j<P.length;j++){var b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<130){x.strokeStyle='rgba(150,190,255,'+(.16*(1-d/130))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}}
  if(!still)requestAnimationFrame(draw)}
 addEventListener('resize',function(){size();if(still)draw()});size();draw();
})();
