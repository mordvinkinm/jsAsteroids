!function(e){function t(i){if(n[i])return n[i].exports;var u=n[i]={i:i,l:!1,exports:{}};return e[i].call(u.exports,u,u.exports,t),u.l=!0,u.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=10)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={MAX_VEL:7,ACCELERATION_COEF:.5,FRICTION_COEF:.05,TIME_BETWEEN_SHOOTING:10,SHIP_TURNING_COEF:.03,FPS:60,MISSILE_LIFETIME:200,MISSILE_SPEED:15,MISSILE_RADIUS:10,ROCK_VEL_MULTIPLIER:3,ROCK_SPAWN_TIME:2e3,LARGE_ROCK_RADIUS:45,SMALL_ROCK_RADIUS:22.75,SHIP_RADIUS:45,TICK_TIME:17,INITIAL_LIVES:3,RESPAWN_INVULNERABILITY:200,PLAY_SOUNDTRACK:!1}},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(){function e(){E||(setInterval(n,1e3/c.default.FPS),R=x(),E=!0)}function t(e,t){S=e,P=t;var n=v();n.width=S,n.height=P,n.style.width=S+"px",n.style.height=P+"px"}function n(){if(i(),l.default.isGameOver())return void u();f.default.isDebugMode()&&y(),r(),a(),p(),d(),s(),g()}function i(){R.drawImage(o.default.nebulaImg.getImage(),0,0),R.drawImage(o.default.debrisImg.getImage(),0,0)}function u(){R.font="36px Arial",R.fillStyle="#FF0000",R.fillText("GAME OVER (Click to continue)",S/2-240,P/2),R.font="24px Arial",R.fillText("Score: "+l.default.getScore(),S/2-60,P/2+40)}function r(){var e="Score: "+l.default.getScore();R.font="20px Arial",R.fillStyle="#FFFFFF",R.fillText(e,10,20)}function a(){var e="Lives: "+l.default.getLives();R.font="20px Arial",R.fillStyle="#FFFFFF",R.fillText(e,S-100,20)}function d(){l.default.getShip().render(R)}function s(){for(var e=h.default.getMissiles(),t=0;t<e.length;t++)e[t].render(R)}function g(){for(var e=h.default.getRocks(),t=0;t<e.length;t++)e[t].render(R)}function p(){for(var e=h.default.getExplosions(),t=0;t<e.length;t++)e[t].render(R)}function _(){return S}function I(){return P}function y(){var e=40;R.font="10px Arial",R.fillStyle="#00FF00";var t=l.default.getShip();R.fillText("Ship:",20,e),e+=10;var n="{ x: "+parseInt(t.getPosition().x)+", y: "+parseInt(t.getPosition().y)+"}";R.fillText("Coords: "+n,20,e),e+=10,R.fillText("Angle: "+t.getAngle().toFixed(2),20,e),e+=10,R.fillText("Shooting: "+(t.isShooting()?"yes":"no"),20,e),e+=10,R.fillText("Invulnerable: "+(t.isInvulnerable()?"yes":"no"),20,e),e+=20,R.fillStyle="#00AAAA",R.fillText("MissileCount: "+h.default.getMissiles().length,20,e),e+=20,R.fillStyle="#FF0000",R.fillText("RockCount: "+h.default.getRocks().length,20,e),e+=20,R.fillStyle="#AAAAAA",R.fillText("ExplosionsCount: "+h.default.getExplosions().length,20,e),e+=20}function v(){return document.getElementById("mainCanvas")}function x(){return v().getContext("2d-libcanvas")}var R,M=this,E=!1,S=1024,P=768;M.initialize=e,M.resize=t,M.getFieldWidth=_,M.getFieldHeight=I}Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=i(r),a=n(3),l=i(a),d=n(5),f=i(d),s=n(0),c=i(s),g=n(8),h=i(g),p=new u;t.default=p},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(){var e,t,n=this;!function(){e=[new o.default("res/sprites/asteroid_blue.png"),new o.default("res/sprites/asteroid_blend.png"),new o.default("res/sprites/asteroid_brown.png")];var n={width:128,height:128};t=[new o.default("res/sprites/explosion_alpha.png",n,240),new o.default("res/sprites/explosion_blue.png",n,240),new o.default("res/sprites/explosion_blue2.png",n,240),new o.default("res/sprites/explosion_orange.png",n,240)]}(),n.nebulaImg=new o.default("res/sprites/the_great_nebula.jpg"),n.debrisImg=new o.default("res/sprites/debris2_blue.png"),n.shipImg=new o.default("res/sprites/double_ship.png",{width:90,height:90}),n.missileImg=new o.default("res/sprites/shot2.png"),n.getAsteroidImg=function(){return e[l.default.randRange(0,e.length)]},n.getExplosionImg=function(){return t[l.default.randRange(0,t.length)]}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(19),o=i(r),a=n(4),l=i(a),d=new u;t.default=d},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(){function e(){return T}function t(){return A}function n(){return b}function i(){return!!O}function u(){return P}function r(){var e={x:c.default.getFieldWidth()/2,y:c.default.getFieldHeight()/2},t={x:0,y:0},n=l.default.random()*Math.PI;P=new f.default(e,t,n)}function a(){r(),T=0,b=0,L=0,A=o.default.INITIAL_LIVES,O=!1,h.default.initialize()}function d(){if(!O){b++,P.processTick(),s(),g();var e,t=h.default.getMissiles();for(e=0;e<t.length;e++)t[e].processTick();var n=h.default.getRocks();for(e=0;e<n.length;e++)n[e].processTick();h.default.removeObsoleteMissiles(),h.default.removeObsoleteExplosions(),R(),M()}}function s(){!0===P.isShooting()&&b-L>o.default.TIME_BETWEEN_SHOOTING&&(h.default.createMissile(P),y.default.playMissileSound(),L=b)}function g(){P.isThrusting()?y.default.playThrustSound():y.default.stopThrustSound()}function p(){if(!O){var e=I(),t=v();h.default.createRock(e,t,!0)}}function I(){var e;do{e={x:l.default.randRange(0,c.default.getFieldWidth()),y:l.default.randRange(0,c.default.getFieldHeight())}}while(_.default.dist(e,P.getPosition())<3*(P.getRadius()+o.default.LARGE_ROCK_RADIUS));return e}function v(){var e=l.default.randRange(0,100)%2==0?o.default.ROCK_VEL_MULTIPLIER:-o.default.ROCK_VEL_MULTIPLIER,t=l.default.randRange(0,100)%2==0?o.default.ROCK_VEL_MULTIPLIER:-o.default.ROCK_VEL_MULTIPLIER;return{x:l.default.random()*e,y:l.default.random()*t}}function x(e){var t={x:l.default.randRange(-o.default.ROCK_VEL_MULTIPLIER,o.default.ROCK_VEL_MULTIPLIER),y:l.default.randRange(-o.default.ROCK_VEL_MULTIPLIER,o.default.ROCK_VEL_MULTIPLIER)},n={x:e.getPosition().x+t.x,y:e.getPosition().y+t.y};return h.default.createRock(n,t,!1)}function R(){for(var e=h.default.getMissiles(),t=h.default.getRocks(),n=e.length-1;n>=0;n--){for(var i=!1,u=t.length-1;u>=0;u--){if(_.default.dist(e[n].getPosition(),t[u].getPosition())<=e[n].getRadius()+t[u].getRadius()){h.default.createExplosion(t[u].getPosition()),t[u].isLarge()&&(x(t[u]),x(t[u]),x(t[u])),i=!0,T+=1,t.splice(u,1);break}}i&&(e.splice(n,1),y.default.playExplosionSound())}}function M(){if(!P.isInvulnerable())for(var e=h.default.getRocks(),t=e.length-1;t>=0;t--){var n=_.default.dist(e[t].getPosition(),P.getPosition());if(n<=e[t].getRadius()+P.getRadius()){h.default.createExplosion(P.getPosition()),A-=1,P.makeInvulnerable(),y.default.playExplosionSound(),0===A&&E(),e.splice(t,1);break}}}function E(){O=!0,y.default.stopAllSounds()}function S(){w||(setInterval(d,o.default.TICK_TIME),setInterval(p,o.default.ROCK_SPAWN_TIME),w=!0)}var P,m=this,w=!1,T=0,A=o.default.INITIAL_LIVES,b=0,L=0,O=!1;m.initialize=S,m.getScore=e,m.getLives=t,m.getTime=n,m.isGameOver=i,m.getShip=u,m.restartGame=a}Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=i(r),a=n(4),l=i(a),d=n(14),f=i(d),s=n(1),c=i(s),g=n(8),h=i(g),p=n(6),_=i(p),I=n(7),y=i(I),v=new u;t.default=v},function(e,t,n){"use strict";function i(e,t){var n=parseInt((t-e)*Math.random()+e);return n===t?n-1:n}function u(){return Math.random()}Object.defineProperty(t,"__esModule",{value:!0}),t.default={randRange:i,random:u}},function(e,t,n){"use strict";function i(){function e(e){r&&console.log(e)}function t(){return r}function n(){r=!0}function i(){r=!1}var u=this,r=!1;u.log=e,u.isDebugMode=t,u.enableDebugMode=n,u.disableDebugMode=i}Object.defineProperty(t,"__esModule",{value:!0});var u=new i;t.default=u},function(e,t,n){"use strict";function i(e,t){return t=t||1,{x:t*Math.cos(e),y:t*Math.sin(e)}}function u(e,t){return t||(t={x:0,y:0}),Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}Object.defineProperty(t,"__esModule",{value:!0}),t.default={angleToVector:i,dist:u}},function(e,t,n){"use strict";function i(){function e(){l.play()}function t(){d.play()}function n(){f.play()}function i(){s.play()}function u(){o(s)}function r(){o(s),o(d),o(f)}function o(e){e.pause(),e.currentTime=0}var a=this,l=new Audio("res/sounds/soundtrack.mp3"),d=new Audio("res/sounds/missile.mp3"),f=new Audio("res/sounds/explosion.mp3"),s=new Audio("res/sounds/thrust.mp3");a.playSoundtrack=e,a.playMissileSound=t,a.playExplosionSound=n,a.playThrustSound=i,a.stopThrustSound=u,a.stopAllSounds=r}Object.defineProperty(t,"__esModule",{value:!0});var u=new i;t.default=u},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(){function e(){p=[],I=[],v=[]}function t(){return p}function n(e){e=e||f.default.getShip();var t=o.default.angleToVector(e.getAngle(),l.default.MISSILE_SPEED+e.getSpeed()),n=o.default.angleToVector(e.getAngle(),e.getRadius()),i={x:e.getPosition().x+n.x,y:e.getPosition().y+n.y},u=new c.default(i,t,e.getAngle());return p.push(u),u}function i(){for(var e=[],t=0;t<p.length;t++){var n=p[t],i=n.getPosition(),u=i.x>0&&i.y>0&&i.x<h.default.getFieldWidth()&&i.y<h.default.getFieldHeight();!p[t].isExpired()&&u&&e.push(n)}p=e}function u(){return I}function r(e,t,n){var i=new _.default(e,t,n);return I.push(i),i}function a(){return v}function d(e){var t=new y.default(e);return v.push(t),t}function s(){for(var e=[],t=0;t<v.length;t++){var n=v[t];n.isExpired()||e.push(n)}v=e}var g=this,p=[],I=[],v=[];g.initialize=e,g.createMissile=n,g.getMissiles=t,g.removeObsoleteMissiles=i,g.createRock=r,g.getRocks=u,g.createExplosion=d,g.getExplosions=a,g.removeObsoleteExplosions=s}Object.defineProperty(t,"__esModule",{value:!0});var r=n(6),o=i(r),a=n(0),l=i(a),d=n(3),f=i(d),s=n(12),c=i(s),g=n(1),h=i(g),p=n(13),_=i(p),I=n(11),y=i(I),v=new u;t.default=v},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(e){var t=e.keyCode,n=g.default.getShip();t===d.default.up?n.startThrusting():t===d.default.left?n.startTurningLeft():t===d.default.right?n.startTurningRight():t===d.default.space&&n.startShooting()}function r(e){var t=e.keyCode,n=g.default.getShip();t===d.default.up?n.stopThrusting():t===d.default.left||t===d.default.right?n.stopTurning():t===d.default.space&&n.stopShooting()}function o(){g.default.isGameOver()&&g.default.restartGame()}function a(e){s.default.resize(e.target.innerWidth,e.target.innerHeight)}Object.defineProperty(t,"__esModule",{value:!0});var l=n(20),d=i(l),f=n(1),s=i(f),c=n(3),g=i(c);t.default={onKeyDown:u,onKeyUp:r,onClick:o,onResize:a}},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(){document.body||(document.body=document.createElement("body"));var e=document.body;if(!document.getElementById("mainCanvas")){var t=document.createElement("canvas");t.id="mainCanvas",document.body.appendChild(t)}e.onload=r,e.onkeydown=a.default.onKeyDown,e.onkeyup=a.default.onKeyUp,e.onclick=a.default.onClick,e.onresize=a.default.onResize,e.style.margin="0",e.style.overflow="hidden"}function r(){LibCanvas.extract(),d.default.initialize(),d.default.resize(window.innerWidth,window.innerHeight),g.default.initialize(),g.default.restartGame(),I.default.PLAY_SOUNDTRACK&&s.default.playSoundtrack()}var o=n(9),a=i(o),l=n(1),d=i(l),f=n(7),s=i(f),c=n(3),g=i(c),h=n(5),p=i(h),_=n(0),I=i(_);!function(){window.Debug=p.default,u()}()},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(e){function t(){return r}function n(){return a}function i(){return d.isFinished()}var u=this,r={x:e.x,y:e.y},a=o.default.random()*Math.PI,d=new l.default(u);u.isExpired=i,u.getPosition=t,u.getAngle=n,u.render=d.render}Object.defineProperty(t,"__esModule",{value:!0}),t.default=u;var r=n(4),o=i(r),a=n(15),l=i(a)},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(e,t,n){function i(){s.x+=c.x,s.y+=c.y,h--}function u(){return s}function r(){return g}function a(){return h<=0}function d(){return o.default.MISSILE_RADIUS}var f=this,s={x:e.x,y:e.y},c={x:t.x,y:t.y},g=n,h=o.default.MISSILE_LIFETIME;f.processTick=i,f.getPosition=u,f.getAngle=r,f.isExpired=a,f.getRadius=d,f.render=new l.default(f).render}Object.defineProperty(t,"__esModule",{value:!0}),t.default=u;var r=n(0),o=i(r),a=n(16),l=i(a)},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(e,t,n){function i(){g.x+=h.x,g.y+=h.y,g.x>l.default.getFieldWidth()?g.x=0:g.x<0&&(g.x=l.default.getFieldWidth()),g.y>l.default.getFieldHeight()?g.y=0:g.y<0&&(g.y=l.default.getFieldHeight())}function u(){return g}function r(){return p}function a(){return _}function d(){return a()?c.default.LARGE_ROCK_RADIUS:c.default.SMALL_ROCK_RADIUS}var s=this,g={x:e.x,y:e.y},h={x:t.x,y:t.y},p=Math.PI*o.default.random(),_=n;s.processTick=i,s.getPosition=u,s.getAngle=r,s.isLarge=a,s.getRadius=d,s.render=new f.default(s).render}Object.defineProperty(t,"__esModule",{value:!0}),t.default=u;var r=n(4),o=i(r),a=n(1),l=i(a),d=n(17),f=i(d),s=n(0),c=i(s)},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(e,t,n){function i(){return A}function u(){return o.default.SHIP_RADIUS}function r(){return Math.sqrt(Math.pow(b.x,2)+Math.pow(b.y,2))}function a(){F=-Math.PI*o.default.SHIP_TURNING_COEF}function d(){F=Math.PI*o.default.SHIP_TURNING_COEF}function s(){F=0}function g(){return O}function h(){O=!0}function p(){O=!1}function _(){L=!0}function I(){L=!1}function y(){return!!L}function v(){return C}function x(){return b}function R(){return k}function M(){k=o.default.RESPAWN_INVULNERABILITY}function E(){return k>0}function S(){k>0&&(k-=1),P(),m(),w()}function P(){for(C+=F;C>2*Math.PI;)C-=2*Math.PI;for(;C<0;)C+=2*Math.PI}function m(){var e={x:0,y:0};y()&&(e=l.default.angleToVector(C),e.x*=o.default.ACCELERATION_COEF,e.y*=o.default.ACCELERATION_COEF);var t={x:b.x*o.default.FRICTION_COEF,y:b.y*o.default.FRICTION_COEF};l.default.dist(b)<=o.default.MAX_VEL&&(b.x+=e.x,b.y+=e.y),b.x-=t.x,b.y-=t.y,A.x+=b.x,A.y+=b.y}function w(){A.x>f.default.getFieldWidth()?A.x=0:A.x<0&&(A.x=f.default.getFieldWidth()),A.y>f.default.getFieldHeight()?A.y=0:A.y<0&&(A.y=f.default.getFieldHeight())}var T=this,A=e,b=t,L=!1,O=!1,C=n,F=0,k=o.default.RESPAWN_INVULNERABILITY;T.getPosition=i,T.getRadius=u,T.getAngle=v,T.getVelocity=x,T.getSpeed=r,T.startTurningLeft=a,T.startTurningRight=d,T.stopTurning=s,T.startThrusting=_,T.stopThrusting=I,T.isThrusting=y,T.isShooting=g,T.startShooting=h,T.stopShooting=p,T.getRemainingInvulnerability=R,T.makeInvulnerable=M,T.isInvulnerable=E,T.processTick=S,T.render=new c.default(T).render}Object.defineProperty(t,"__esModule",{value:!0}),t.default=u;var r=n(0),o=i(r),a=n(6),l=i(a),d=n(1),f=i(d),s=n(18),c=i(s)},function(e,t,n){"use strict";function i(e){function t(t){var n=e.getPosition(),i={x:o.getWidth()/2,y:o.getHeight()/2},r={x:i.x+u*o.getWidth(),y:i.y};u++,t.drawImage({image:o.getImage(),draw:new Rectangle({center:new Point(n.x,n.y),size:new Size(o.getWidth(),o.getHeight())}),crop:new Rectangle({center:r,size:new Size(o.getWidth(),o.getHeight())}),angle:e.getAngle()})}function n(){return u>=o.getAnimationTime()}var i=this,u=0,o=r.default.getExplosionImg();i.render=t,i.isFinished=n}Object.defineProperty(t,"__esModule",{value:!0}),t.default=i;var u=n(2),r=function(e){return e&&e.__esModule?e:{default:e}}(u)},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(e){function t(t){var n=e.getPosition();l.default.isDebugMode()&&(t.beginPath(),t.arc(n.x,n.y,e.getRadius(),0,2*Math.PI,!1),t.fillStyle="yellow",t.fill(),t.lineWidth=3,t.strokeStyle="#BDB76B",t.stroke()),t.drawImage({image:i.getImage(),draw:new Rectangle({center:new Point(n.x,n.y),size:new Size(2*e.getRadius(),2*e.getRadius())}),crop:new Rectangle(0,0,i.getWidth(),i.getHeight()),angle:e.getAngle()})}var n=this,i=o.default.missileImg;n.render=t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=u;var r=n(2),o=i(r),a=n(5),l=i(a)},function(e,t,n){"use strict";function i(e){function t(t){var n=e.getPosition();Debug.isDebugMode()&&(t.beginPath(),t.arc(n.x,n.y,e.getRadius(),0,2*Math.PI,!1),t.fillStyle="red",t.fill(),t.lineWidth=3,t.strokeStyle="#330000",t.stroke()),t.drawImage({image:i.getImage(),draw:new Rectangle({center:new Point(n.x,n.y),size:new Size(2*e.getRadius(),2*e.getRadius())}),crop:new Rectangle(0,0,i.getWidth(),i.getHeight()),angle:e.getAngle()})}var n=this,i=r.default.getAsteroidImg();n.render=t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=i;var u=n(2),r=function(e){return e&&e.__esModule?e:{default:e}}(u)},function(e,t,n){"use strict";function i(e){function t(t){var n=e.getPosition();Debug.isDebugMode()&&(t.beginPath(),t.arc(n.x,n.y,e.getRadius(),0,2*Math.PI,!1),t.fillStyle="green",t.fill(),t.lineWidth=3,t.strokeStyle="#003300",t.stroke());var u;u=e.isThrusting()?e.isInvulnerable()&&e.getRemainingInvulnerability()%4<2?3*i.getWidth():i.getWidth():e.isInvulnerable()&&e.getRemainingInvulnerability()%4<2?2*i.getWidth():0,t.drawImage({image:i.getImage(),draw:new Rectangle({center:new Point(n.x,n.y),size:new Size(2*e.getRadius(),2*e.getRadius())}),crop:new Rectangle(u,0,i.getWidth(),i.getHeight()),angle:e.getAngle()})}var n=this,i=r.default.shipImg;n.render=t}Object.defineProperty(t,"__esModule",{value:!0}),t.default=i;var u=n(2),r=function(e){return e&&e.__esModule?e:{default:e}}(u)},function(e,t,n){"use strict";function i(e,t,n){function i(){f=t||{width:g.width,height:g.height},s=Math.max(f.width,f.height)/2,n=n||0}function u(){return g}function r(){return f.width}function o(){return f.height}function a(){return s}function l(){return!!n}function d(){return n}var f,s,c=this,g=new Image;g.onload=i,g.src=e,c.getImage=u,c.getWidth=r,c.getHeight=o,c.getRadius=a,c.isAnimated=l,c.getAnimationTime=d}Object.defineProperty(t,"__esModule",{value:!0}),t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={left:37,right:39,up:38,down:40,space:32}}]);