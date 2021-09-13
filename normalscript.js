(function () {
  let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


if(window.innerWidth > 568)
{
canvas.width = 568;
}
else
{
canvas.width  = window.innerWidth;
}

canvas.height = window.innerHeight;

let audioCtx = new AudioContext();
let oscillator = audioCtx.createOscillator();

ctx.strokeStyle = "white";


let starfield = [[],[],[]];
let dialogueBox = ["Click on blue notes","Avoid red notes","Click on the white button", ""];
let playerTrees = [];
let spherePosition = [];
let leftChart = [];
let rightChart = [];
let curNotes = [];
let levelNotes = [
[0,7,7,6,7,7,6],
[0,10,10,10,10,10,10],
[0,12,12,12,12,12,12],
[0,15,14,14,15,14,15],
[0,16,16,16,18,16,18],
[0,0,0,0,0,0,0,0]
];

let levelBpm = [100,120,144,172,200,0];

let progress;

loadProgress();

let curLevelNotes = [];
let centralSphere =
{
x: canvas.width/2,
y: canvas.height/2,
radius: canvas.width/10,
color: "white",
colorData: -1
};

let game =
{
  pause: false,
  load_ending: 0,
  level: 0,
  points: 0,
  newColor: "white",
  positiveNotes: 0,
  bool_bpmButton: false,
  load_bpmButton: 0,
  noteCounter: -canvas.width/2,
  maxNotes: 0,
  musicFrame: 0,
  perfect: canvas.width/2,
  noteDistance: canvas.width/4,
  randomDistance: 2,
  effectFrame: 0,
  bool_effectFrame: false,
  bpmPoints: 1333,
  bpm: 200,
  defaultBpm: 200,
  playerHealth: 40,
  max_playerHealth: 40,
  enemyHealth: 30,
  max_enemyHealth: 30,
  curNotes: 0,
  chain: 0,
  whiteNotes: 0,
  blueNotes: 0,
  maxScore: 0
};

let buttonPosition =
[
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*3.5-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 0,
    id_nextLevel: 1
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4.5-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 1,
    id_nextLevel: 0
  },
  {
    x: 0,
    y: canvas.height/4,
    width: canvas.width/10*9+canvas.width/10,
    height: canvas.height/10,
    id_curLevel: 1,
    id_nextLevel: 11
  },
  {
    x: 0,
    y: canvas.height/4+canvas.height/10,
    width: canvas.width/10*9+canvas.width/10,
    height: canvas.height/10,
    id_curLevel: 1,
    id_nextLevel: 22
  },
  {
    x: 0,
    y: canvas.height/4+canvas.height/10*2,
    width: canvas.width/10*9+canvas.width/10,
    height: canvas.height/10,
    id_curLevel: 1,
    id_nextLevel: 33
  },
  {
    x: 0,
    y: canvas.height/4+canvas.height/10*3,
    width: canvas.width/10*9+canvas.width/10,
    height: canvas.height/10,
    id_curLevel: 1,
    id_nextLevel: 44
  },
  {
    x: 0,
    y: canvas.height/4+canvas.height/10*4,
    width: canvas.width/10*9+canvas.width/10,
    height: canvas.height/10,
    id_curLevel: 1,
    id_nextLevel: 55
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4.5-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 11,
    id_nextLevel: 1
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4.5-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 22,
    id_nextLevel: 1
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4.5-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 33,
    id_nextLevel: 1
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4.5-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 44,
    id_nextLevel: 1
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4.5-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 55,
    id_nextLevel: 1
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4.5-canvas.width/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 52,
    id_nextLevel: 1
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4-canvas.height/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 11,
    id_nextLevel: 10
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4-canvas.height/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 22,
    id_nextLevel: 20
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4-canvas.height/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 33,
    id_nextLevel: 30
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4-canvas.height/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 44,
    id_nextLevel: 40
  },
  {
    x: canvas.width/2-canvas.width/8,
    y: canvas.height/5*4-canvas.height/8,
    width: canvas.width/4,
    height: canvas.width/4,
    id_curLevel: 55,
    id_nextLevel: 50
  }
];


let playerAnimation =
{
frameCount: 0,
animation: 0,
attackBegin: false,
attackEnd: true,
hurtBegin: false,
hurtEnd: true
};

let enemyAnimation =
{
frameCount: 0,
animation: 0
};

load_starfield();

requestAnimationFrame(upload);

function randomLevel()
{
  levelBpm[5] = (Math.floor(Math.random()*25)*4)+100;
  for(let i = 1; i<levelNotes[5].length; i++)
  {
    levelNotes[5][i] = Math.floor(Math.random()*25);
  }
}

function loadSpheres()
{
for(let i = 0; i < curLevelNotes.length; i++)
{
  let leftSphere = {};
  let rightSphere;
  leftSphere.x = game.noteCounter;
  leftSphere.y = canvas.height/2;
  leftSphere.type = curLevelNotes[i];
  leftSphere.speed = 8/game.randomDistance;
  if(leftSphere.type == 3 || leftSphere.type == 4)
  {
    leftSphere.radius = canvas.width/50;
  }
  else
  {
    leftSphere.radius = canvas.width/20;
  }
    leftChart.push(leftSphere);
    rightSphere = {...leftSphere};
    rightChart.push(rightSphere);
    rightChart[i].x = canvas.width + Math.abs(game.noteCounter);
    game.noteDistance = Math.floor(Math.random()*canvas.width/4) + canvas.width/6;
    game.noteCounter -= game.noteDistance; 
}

}

function resetChart()
{
  curLevelNotes.length = 0;
  leftChart.length = 0;
  rightChart.length = 0;
  game.load_ending = 0;
  game.noteCounter = -canvas.width/2;
  game.points = 0;
  game.curNotes = 0;
  game.maxNotes = 0;
  game.load_bpmButton = 0;
  game.bool_effectFrame = false;
}

function setSpheres()
{
  let levelInfo = game.level/10;
  game.defaultBpm = levelBpm[levelInfo-1];
  game.bpm = game.defaultBpm;
for(let i = 1; i < levelNotes[levelInfo-1].length; i++)
{
  for(let j = 0; j < levelNotes[levelInfo-1][i]; j++)
  {
    curLevelNotes.push(i);
  }
}
}

function shuffle(array) {
for (let i = array.length - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
}
}
/*
function setBeatSpheres()
{
for(let i = 0; i < levelNotes[0][0]; i++)
{
  curLevelNotes.splice(i*4,0,0);
}
}
*/
function setMaxNotes()
{
for(let i = 0; i < levelNotes[game.level/10-1].length; i++)
{
  game.maxNotes += levelNotes[game.level/10-1][i];
}
  game.positiveNotes += levelNotes[game.level/10-1][2] + levelNotes[game.level/10-1][4] + levelNotes[game.level/10-1][6]; 
}

function setStage()
{
  resetChart();
  setSpheres();
  shuffle(curLevelNotes);
  loadSpheres();
  setMaxNotes();
}

function drawPlayer()
{
  ctx.lineWidth = 3;
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.strokeStyle = centralSphere.color;
  if(game.level == 30 && game.bool_effectFrame == false)
  {
    ctx.fillStyle = "#3f1208";
  }
  else
  {
    ctx.fillStyle = "#080c3f";
  }
  
  ctx.arc(centralSphere.x, centralSphere.y, centralSphere.radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  ctx.globalAlpha = 1;
}

function drawEnemy()
{
if(game.level == 30 && game.bool_effectFrame == false)
  {
    ctx.fillStyle = "#080c3f";
  }
  else
  {
    ctx.fillStyle = "#3f1208";
  }
ctx.lineWidth = 1;
ctx.beginPath();
ctx.globalAlpha = 0.8;
ctx.arc(canvas.width/20, canvas.height/2, canvas.width/20, 0, 2 * Math.PI);
ctx.stroke();
ctx.fill();
ctx.closePath();
ctx.beginPath();
ctx.arc(canvas.width-canvas.width/20, canvas.height/2, canvas.width/20, 0, 2 * Math.PI);
ctx.stroke();
ctx.fill();
ctx.closePath();
ctx.globalAlpha = 1;
}

function drawBackground()
{
  let grd;
  if(game.level == 10)
  {
    grd = ctx.createLinearGradient(0,canvas.height/12,canvas.width,canvas.height);
    grd.addColorStop(0,"#22171a");
    grd.addColorStop(0.5,"#6f3700");
    grd.addColorStop(1,"#3a3a27");
  }

  if(game.level == 20)
  {
    grd = ctx.createLinearGradient(canvas.width/50,canvas.height/12,canvas.width,canvas.height);
    grd.addColorStop(0,"#195b5b");
    grd.addColorStop(0.5,"#065b36");
    grd.addColorStop(1,"#004c3e");
  }

  if(game.level == 30)
  {
    grd = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    grd.addColorStop(0,"#06014f");
    grd.addColorStop(0.5, "#352f8e");
    grd.addColorStop(1,"#0e0a47");
  }

  if(game.level == 40)
  {
    grd = ctx.createLinearGradient(canvas.width/10,0,canvas.width/2,canvas.height);
    grd.addColorStop(0,"#b59a17");
    grd.addColorStop(0.5,"#4f4e13");
    grd.addColorStop(1,"#666404");
  }

  if(game.level == 50)
  {
    grd = ctx.createLinearGradient(0,50,canvas.width,canvas.height);
    grd.addColorStop(0,"#b73f17");
    grd.addColorStop(0.5,"#441b0d");
    grd.addColorStop(1,"#8c500c");
  }
  
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
}

function drawBackground_effect()
{
  
  if(game.level == 10)
  {
    ctx.fillStyle = "#6d3504";
    ctx.strokeStyle = "black";
    if(game.bool_effectFrame == true)
    {
        ctx.fillRect(canvas.width/6, canvas.height/2.2, canvas.width/10, canvas.height/10);
        ctx.fillRect(canvas.width/4, canvas.height/2.2, canvas.width/10, canvas.height/10);
        ctx.strokeRect(canvas.width/6, canvas.height/2.2, canvas.width/10, canvas.height/10);
        ctx.strokeRect(canvas.width/4, canvas.height/2.2, canvas.width/10, canvas.height/10);
    }
    else
    {
        ctx.fillRect(canvas.width/6*4.5, canvas.height/2.2, canvas.width/10, canvas.height/10);
        ctx.fillRect(canvas.width/6*4, canvas.height/2.2, canvas.width/10, canvas.height/10);
        ctx.strokeRect(canvas.width/6*4.5, canvas.height/2.2, canvas.width/10, canvas.height/10);
        ctx.strokeRect(canvas.width/6*4, canvas.height/2.2, canvas.width/10, canvas.height/10);
    }
  }
  if(game.level == 20)
  {
    let randPosition;
    if(game.bool_effectFrame == true)
    {
      for(let i = 0; i < leftChart.length; i++)
      {
        randPosition = canvas.height/2-canvas.height/15 + Math.random() * canvas.height/7.5;
        leftChart[i].y = randPosition;
        rightChart[i].y = randPosition;
      }
      game.bool_effectFrame = false;
    } 
  }
}

function drawBoard()
{
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(canvas.width/10,canvas.height/2);
  ctx.lineTo(canvas.width/2-canvas.width/10,canvas.height/2);
  ctx.moveTo(canvas.width/2+canvas.width/10,canvas.height/2);
  ctx.lineTo(canvas.width/10*9,canvas.height/2);
  ctx.closePath();
  ctx.stroke();
}

function drawText()
{
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.textAlign = 'center';
  ctx.font = "6vh Lucida Sans Unicode";
  ctx.fillText(Math.floor(game.points), canvas.width/2,canvas.height/5);
  ctx.fillText(Math.floor(game.maxNotes - game.curNotes), canvas.width/2,canvas.height/4);
  ctx.beginPath();
  ctx.moveTo(canvas.width/4,canvas.height/10);
  ctx.lineTo(canvas.width/4*3,canvas.height/10);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(canvas.width/4,canvas.height/10);
  ctx.lineTo(canvas.width/4+(((canvas.width/2)/game.maxNotes)*game.curNotes),canvas.height/10);
  ctx.closePath();
  ctx.stroke();
}

function drawNotes()
{
  game.musicFrame++;
  if(game.musicFrame >= 60)
  {
    playSound();
    game.musicFrame = 0;
  }
  ctx.globalAlpha = 0.8;
  if(leftChart.length > 0)
  {
      if((leftChart[0].x > game.perfect))
        {
          avoidNote();
        }
      //draw notes
      for(let i = 0; i < leftChart.length; i++)
      {
        let newColor;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "white";
        switch(leftChart[i].type)
        {
          case 0:
          case 2:
          case 4:
            if(game.level == 40)
            {
              ctx.fillStyle = game.newColor;
            }
            else
            {
              ctx.fillStyle = "blue";
            }
            ctx.strokeStyle = "black";
            break;
          case 1:
          case 3:
            ctx.fillStyle = "red";
            break;
          case 5:
            ctx.lineWidth = 7;
            ctx.fillStyle = "#0D1B2A";
            ctx.strokeStyle = "red";
            break;
          case 6:
            ctx.lineWidth = 7;
            ctx.fillStyle = "#0D1B2A";
            if(game.level == 40)
            {
              ctx.strokeStyle = game.newColor;
            }
            else
            {
              ctx.strokeStyle = "blue";
            }
            break;
        }
          ctx.beginPath();
          ctx.arc(leftChart[i].x, leftChart[i].y, leftChart[i].radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
          ctx.beginPath();
          ctx.arc(rightChart[i].x, rightChart[i].y, rightChart[i].radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
      }
    }
    else
    {
      game.load_ending++;
      if(game.load_ending >= 60)
      {
        saveProgress(game.level/10-1);
        game.level = 52;
        
      }
     
    }
  for(let i = 0; i<rightChart.length; i++)
  {
    leftChart[i].x += (((canvas.width/2)/60*(game.bpm/60))/leftChart[i].speed);
    rightChart[i].x -= ((canvas.width/2)/60*(game.bpm/60))/rightChart[i].speed;
  }
  ctx.globalAlpha = 1;
}

function getRandomColor()
{
  let letters = '0123456789ABCDEF';
  let color = '#00';
  for (var i = 0; i < 4; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  game.bool_effectFrame = false;
  return color;
}

function upload()
{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  switch(game.level)
  {
    case 0:
      drawMenu();
      break;
    case 1:
      drawStage();
      break;
    case 10:
    case 20:
    case 30:
    case 40:
    case 50:
      drawLayout();
      break;
    case 11:
    case 22:
    case 33:
    case 44:
    case 55:
      drawLevel_selection();
      break;
    case 52:
      drawLevel_ending();
  }
  requestAnimationFrame(upload);
}

function drawMenu()
{
  let grd;
  if(document.monetization && document.monetization.state === 'started')
      {
    grd = ctx.createLinearGradient(0,canvas.height/12,canvas.width,canvas.height);
    grd.addColorStop(0,"#63216b");
    grd.addColorStop(0.5,"#6f3700");
    grd.addColorStop(1,"#410c47");
    ctx.fillStyle = grd;
      }
  else
  {
    ctx.fillStyle = "#1d0530";
  }
  ctx.fillRect(0,0,canvas.width,canvas.height);
  move_starfield();
  ctx.fillStyle = "#471e22";
  // left window
  ctx.fillRect(0,0,canvas.width/20,canvas.height);
  //right window
  ctx.fillRect(canvas.width-canvas.width/20,0,canvas.width/20,canvas.height);
  //up window
  ctx.fillRect(canvas.width/20,0,canvas.width,canvas.height/20);
  //down window
  ctx.fillRect(canvas.width/20,canvas.height-canvas.height/20,canvas.width,canvas.height/20);
  // center horizontally window
  ctx.fillRect(canvas.width/20,canvas.height/2-canvas.height/40,canvas.width,canvas.height/20);
  // center vertically window
  ctx.fillRect(canvas.width/2-canvas.width/40,0,canvas.width/20,canvas.height);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.textAlign = 'center';
  ctx.font = "10vh Lucida Sans Unicode";
  ctx.fillText("W", canvas.width/10*3, canvas.height/5);
  ctx.fillText("3", canvas.width/10*7, canvas.height/5);
  ctx.font = "5vh Lucida Sans Unicode";
  ctx.fillText("onder", canvas.width/2, canvas.height/6);
  ctx.fillText("anderer", canvas.width/2, canvas.height/5);
  drawMenuButtons();
}

function drawStage()
{
  let grd;
  if(document.monetization && document.monetization.state === 'started')
      {
    grd = ctx.createLinearGradient(0,canvas.height/12,canvas.width,canvas.height);
    grd.addColorStop(0,"#22171a");
    grd.addColorStop(0.5,"#6f3700");
    grd.addColorStop(1,"#3a3a27");
    ctx.fillStyle = grd;
      }
  else
  {
    ctx.fillStyle = "#1d0530";
  }
  ctx.fillRect(0,0,canvas.width,canvas.height);
  move_starfield();
  ctx.strokeStyle = "#fff";
  // center vertically window
  for(let i = 3; i<8; i++)
  {
    ctx.strokeRect(buttonPosition[i].x,buttonPosition[i].y,buttonPosition[i].width,buttonPosition[i].height);
  }
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "10vh Lucida Sans Unicode";
  ctx.fillText("S",  canvas.width/10*3.5, canvas.height/5);
  ctx.font = "5vh Lucida Sans Unicode";
  ctx.fillText("Stage 1", canvas.width/2,canvas.height/3.1);
  ctx.fillText("Stage 2", canvas.width/2,canvas.height/3.1+canvas.height/10);
  ctx.fillText("Stage 3", canvas.width/2,canvas.height/3.1+(canvas.height/10)*2);
  ctx.fillText("Stage 4", canvas.width/2,canvas.height/3.1+(canvas.height/10)*3);
  ctx.fillText("Stage 5", canvas.width/2,canvas.height/3.1+(canvas.height/10)*4);
  ctx.fillText("tage", canvas.width/2, canvas.height/6);
  ctx.fillText("elect", canvas.width/2, canvas.height/5);
  drawMenuButtons();
}

function drawLevel_selection()
{
  if(document.monetization && document.monetization.state === 'started')
      {
    grd = ctx.createLinearGradient(0,canvas.height/12,canvas.width,canvas.height);
    grd.addColorStop(0,"#63216b");
    grd.addColorStop(0.5,"#6f3700");
    grd.addColorStop(1,"#410c47");
    ctx.fillStyle = grd;
      }
  else
  {
    ctx.fillStyle = "#1d0530";
  }
  ctx.fillRect(0,0,canvas.width,canvas.height);
  move_starfield();
  ctx.strokeStyle = "#fff";
  // center vertically window
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "10vh Lucida Sans Unicode";
  ctx.fillText("Stage "+ game.level/11,  canvas.width/2, canvas.height/8);
  ctx.font = "5vh Lucida Sans Unicode";
  ctx.fillText(dialogueBox[0],  canvas.width/2, canvas.height/5);
  ctx.fillText(dialogueBox[1],  canvas.width/2, canvas.height/4);
  ctx.fillText(dialogueBox[2],  canvas.width/2, canvas.height/3.4);
  ctx.fillText("Record:" + progress[game.level/10-0.1],canvas.width/2, canvas.height/2);
  drawMenuButtons();
}

function drawLevel_ending()
{
  setMaxScore();
  if(document.monetization && document.monetization.state === 'started')
      {
    grd = ctx.createLinearGradient(0,canvas.height/12,canvas.width,canvas.height);
    grd.addColorStop(0,"#63216b");
    grd.addColorStop(0.5,"#6f3700");
    grd.addColorStop(1,"#410c47");
    ctx.fillStyle = grd;
      }
  else
  {
    ctx.fillStyle = "#1d0530";
  }
  ctx.fillRect(0,0,canvas.width,canvas.height);
  move_starfield();
  ctx.strokeStyle = "#fff";
  // center vertically window
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "7vh Lucida Sans Unicode";
  ctx.fillText("Level Complete!",  canvas.width/2, canvas.height/8);
  ctx.font = "5vh Lucida Sans Unicode";
  ctx.fillText("Your score is: " + Math.floor(game.points),  canvas.width/2, canvas.height/4);
  ctx.fillText("Your rank is: " + calculateRank(),  canvas.width/2, canvas.height/3);
  if(game.points >= game.maxScore/100*70)
  {
    ctx.fillText("You passed the stage!",  canvas.width/2, canvas.height/10*8);
  }
  else
  {
    ctx.fillText("Get C (" + game.maxScore/100*70 + ") points!",  canvas.width/2, canvas.height/10*8);
  }
  ctx.fillText("The maximum score is: " + game.maxScore,  canvas.width/2, canvas.height/2);
  drawMenuButtons();
}

function setMaxScore()
{
  game.whiteNotes = 1000*(game.maxNotes/4);
  game.blueNotes = 1000*(game.positiveNotes);
  game.maxScore = game.whiteNotes + game.blueNotes;
}

function calculateRank()
{
  
  if(game.points >= (game.maxScore/100)*95)
  {
    return "S";
  }
  if(game.points >= (game.maxScore/100)*90 && game.points < (game.maxScore/100)*95)
  {
    return "A";
  }
  if(game.points >= (game.maxScore/100)*80 && game.points < (game.maxScore/100)*90)
  {
    return "B";
  }
  if(game.points >= (game.maxScore/100)*70 && game.points < (game.maxScore/100)*80)
  {
    return "C";
  }
  if(game.points >= (game.maxScore/100)*60 && game.points < (game.maxScore/100)*70)
  {
    return "D";
  }
  if(game.points >= (game.maxScore/100)*50 && game.points < (game.maxScore/100)*60)
  {
    return "E";
  }
  if(game.points < (game.maxScore/100)*50)
  {
    return "F";
  }
}

function load_starfield()
{
  for(let i = 0; i < 100; i++)
  {
    starfield[0].push(Math.random()*canvas.width);
    starfield[1].push(Math.random()*canvas.height);
    starfield[2].push(Math.random()*2);
  }
}

function move_starfield()
{
  ctx.fillStyle = "white";
  for(let i = 0; i < 100; i++)
  {
    ctx.font = starfield[2][i] + "em Lucida Sans Unicode";
    starfield[0][i] += starfield[2][i];
    if(starfield[0][i] >= canvas.width)
    {
      starfield[0][i] = 0;
    }
    ctx.fillText("⭐", starfield[0][i], starfield[1][i]);
  }
}

function drawMenuButtons()
{
  ctx.lineWidth = 6;
  ctx.font = "4vh Lucida Sans Unicode";
  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.beginPath();
  switch(game.level)
  {
    case 0:
      ctx.arc(canvas.width/2, canvas.height/5*4, canvas.width/8, 0, 2 * Math.PI);
      ctx.fillText("PLAY", canvas.width/2,canvas.height/5*4.05);
      
      break;
    case 1:
    case 52:
      ctx.arc(canvas.width/2, canvas.height/5*4.5, canvas.width/8, 0, 2 * Math.PI);
      ctx.fillText("BACK", canvas.width/2,canvas.height/5*4.55);
      ctx.closePath();
      ctx.stroke();
      break;
    case 11:
    case 22:
    case 33:
    case 44:
    case 55:
      ctx.arc(canvas.width/2, canvas.height/5*4.5, canvas.width/8, 0, 2 * Math.PI);
      ctx.fillText("BACK", canvas.width/2,canvas.height/5*4.55);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/5*3.5, canvas.width/8, 0, 2 * Math.PI);
      ctx.fillText("PLAY", canvas.width/2,canvas.height/5*3.55);
      break;
  }
  ctx.stroke();
  ctx.closePath();
}

function clickMenuButtons(cursorX, cursorY)
{
  game.bool_clickedButton = true;
  for(let i = 1; i < buttonPosition.length; i++)
  {
    if(cursorX > buttonPosition[i].x && cursorX < buttonPosition[i].x+buttonPosition[i].width && cursorY > buttonPosition[i].y && cursorY < buttonPosition[i].y+buttonPosition[i].height && game.level == buttonPosition[i].id_curLevel)
    {
        game.level = buttonPosition[i].id_nextLevel;
        cursorX = 0;
        cursorY = 0;
        switch(game.level)
        {
          case 10:
          case 20:
          case 30:
          case 40:
          case 50:
            setStage();
            break;
          
        }
    }
  }
}

function draw_bpmButton()
{
  ctx.shadowColor = "white"; // string
  ctx.fillStyle = "white"; // string
  ctx.strokeStyle = "white";
  ctx.font = "1.7em Lucida Sans Unicode";
  if(game.load_bpmButton >= 4)
  {
   
    ctx.shadowBlur = 10;
    ctx.lineWidth = 3;
    ctx.textAlign = "center";
    ctx.fillText("CLICK", canvas.width/2,canvas.height/5*3.6);
  }
  else
  {
    ctx.shadowBlur = 0;
    ctx.lineWidth = 0.5;
    ctx.strokeText("EMPTY", canvas.width/2,canvas.height/5*3.6);
  }
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/5*3.5, canvas.width/8, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/5*3.5, canvas.width/(32-game.load_bpmButton*6), 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

function click_bpmButton()
{
  if(game.load_bpmButton >= 4)
  {
    game.points += game.bpmPoints;
    changeBpm();
    game.bpmPoints = 1333;
    game.load_bpmButton = 0;
    a=(notes,center,duration,decaystart,decayduration,interval,volume,waveform,i)=>{
      with(A=new AudioContext)
        with(G=createGain())
          for(i of notes){
            with(O=createOscillator()){
              connect(G),
              G.connect(destination),
              start(i[0]*interval),
              frequency.setValueAtTime(center*1.06**(13-i[1]),i[0]*interval),
              type=waveform,
              gain.setValueAtTime(volume,i[0]*interval),
              gain.setTargetAtTime(1e-5,i[0]*interval+decaystart,decayduration),
              stop(i[0]*interval+duration);
            }
         }
    }
    a([[0,Math.floor(Math.random()*24)]],400,.5,.5,.03,.2,.1,'');
  }
}

function drawLayout()
{
  drawBackground();
  drawBoard();
  drawText();
  drawNotes();
  draw_bpmButton();
  drawPlayer();
  drawEnemy();
  drawBackground_effect();
}

function checkNote(cursorX, cursorY)
{
  if(cursorX > buttonPosition[0].x && cursorX < buttonPosition[0].x+buttonPosition[0].width && cursorY > buttonPosition[0].y && cursorY < buttonPosition[0].y+buttonPosition[0].height)
  {
    click_bpmButton();
  }
  else
  {
    if(leftChart[0].x > game.perfect-canvas.width/7)
    {
      if(leftChart[0].type == 1 || leftChart[0].type == 3 || leftChart[0].type == 5)
      {
        if(game.level == 30 && game.bool_effectFrame == false)
        {
          rightNote();
        }
        else
        {
          wrongNote();
        }
      }
      if(leftChart[0].type == 2 || leftChart[0].type == 4 || leftChart[0].type == 6 || leftChart[0].type == 0)
      {
        if(game.level == 30 && game.bool_effectFrame == false)
        {
          wrongNote();
        }
        else
        {
          rightNote();
        }
      }
      clearNote();
    }
    else
    {
      missNote();
    }
  }
}

function wrongNote()
{
  game.points -= (1000/(canvas.width/7)*(leftChart[0].x-(game.perfect-canvas.width/7)));
  a=(notes,center,duration,decaystart,decayduration,interval,volume,waveform,i)=>{
    with(A=new AudioContext)
      with(G=createGain())
        for(i of notes){
          with(O=createOscillator()){
            connect(G),
            G.connect(destination),
            start(i[0]*interval),
            frequency.setValueAtTime(center*1.06**(13-i[1]),i[0]*interval),
            type=waveform,
            gain.setValueAtTime(volume,i[0]*interval),
            gain.setTargetAtTime(1e-5,i[0]*interval+decaystart,decayduration),
            stop(i[0]*interval+duration);
          }
       }
  }
  a([[0,1]],400,.5,.5,.03,.2,.1,'');
  if(game.points < 0)
  {
    game.points = 0;
  }
}

function rightNote()
{
  game.points += (1000/(canvas.width/7)*(leftChart[0].x-(game.perfect-canvas.width/7)));
  a=(notes,center,duration,decaystart,decayduration,interval,volume,waveform,i)=>{
    with(A=new AudioContext)
      with(G=createGain())
        for(i of notes){
          with(O=createOscillator()){
            connect(G),
            G.connect(destination),
            start(i[0]*interval),
            frequency.setValueAtTime(center*1.06**(13-i[1]),i[0]*interval),
            type=waveform,
            gain.setValueAtTime(volume,i[0]*interval),
            gain.setTargetAtTime(1e-5,i[0]*interval+decaystart,decayduration),
            stop(i[0]*interval+duration);
          }
       }
  }
  a([[0,Math.floor(Math.random()*10)+10]],400,.5,.5,.03,.2,.1,'');
}

function avoidNote()
{
  if(leftChart[0].type == 1 || leftChart[0].type == 3 || leftChart[0].type == 5)
  {
    game.chain++;
  }
  if(leftChart[0].type == 2 || leftChart[0].type == 0 || leftChart[0].type == 4 || leftChart[0].type == 6)
  {
    game.playerHealth--;
    game.chain = 0;
  }
  clearNote();
}

function missNote()
{
  game.playerHealth--;
  game.chain = 0;
}

function clearNote()
{
  if(game.load_bpmButton < 4)
  {
    game.load_bpmButton++;
  }
  /*
  game.effectFrame++;
  if(game.effectFrame >= 4 && game.level == 30)
  {
    game.bool_effectFrame = !game.bool_effectFrame;
    game.effectFrame = 0;
  }
  */
  if(game.load_bpmButton >= 4)
  {
    game.bpmPoints -= 333;
    if(game.bpmPoints < 0)
    {
      game.bpmPoints = 1;
    }
  }
  if(leftChart[0].type == 2 || leftChart[0].type == 4 || leftChart[0].type == 6)
  {
    if(game.level == 10 || game.level == 20 || game.level == 30 || game.level == 40 || game.level == 50)
    {
      if(game.level == 40)
      {
        game.newColor = getRandomColor();
      }
      if(game.level == 50)
      {
        changeBpm();
      }
      if(game.level != 30)
      {
        game.bool_effectFrame = !game.bool_effectFrame;
      }
    }
  }
  game.curNotes++;
  leftChart.splice(0,1);
  rightChart.splice(0,1);
}

function changeBpm()
{
  //game.bpm = game.defaultBpm + (game.defaultBpm/2/game.maxNotes)*game.curNotes;
  game.bpm += (game.defaultBpm/2/game.maxNotes)*4;
}

function playSound()
{
    a=(notes,center,duration,decaystart,decayduration,interval,volume,waveform,i)=>{
      with(A=new AudioContext)
        with(G=createGain())
          for(i of notes){
            with(O=createOscillator()){
              connect(G),
              G.connect(destination),
              start(i[0]*interval),
              frequency.setValueAtTime(center*1.06**(13-i[1]),i[0]*interval),
              type=waveform,
              gain.setValueAtTime(volume,i[0]*interval),
              gain.setTargetAtTime(1e-5,i[0]*interval+decaystart,decayduration),
              stop(i[0]*interval+duration);
            }
         }
    }
    a([[0,Math.floor(Math.random()*12)],[0,Math.floor(Math.random()*12)+12]],400,.5,.5,.03,1,.05,'');
  
}

function saveProgress(index)
{
  let progress2 = JSON.parse(localStorage.getItem("wonderwanderer3"));
  if(Math.floor(game.points) > progress2[index])
  {
    progress[index] = Math.floor(game.points);
    localStorage.setItem("wonderwanderer3", JSON.stringify(progress));
  }
  
}

function loadProgress()
{
  if(localStorage.wonderwanderer3 == undefined)
  {
    progress = [0,0,0,0,0];
    localStorage.setItem("wonderwanderer3", JSON.stringify(progress));
  }
  else
  {
    progress = JSON.parse(localStorage.getItem("wonderwanderer3"));

  }
}

document.onmousedown = function(e)
{
let rect = canvas.getBoundingClientRect();
let cursorX = e.clientX - rect.left;
let cursorY = e.clientY - rect.top;
switch(game.level)
{
  case 0:
  case 1:
  case 11:
  case 22:
  case 33:
  case 44:
  case 55:
  case 52:
    clickMenuButtons(cursorX, cursorY);
    break;
  case 10:
  case 20:
  case 30:
  case 40:
  case 50:
    checkNote(cursorX, cursorY);
    break;
}
e.preventDefault();
};

document.onkeydown = function(e)
{
  if(e.keyCode == 32)
  {
    click_bpmButton();
  }
  e.preventDefault();
};

document.ontouchstart = function(e)
{
let rect = canvas.getBoundingClientRect();
let cursorX = e.clientX - rect.left;
let cursorY = e.clientY - rect.top;
switch(game.level)
{
  case 0:
  case 1:
  case 11:
  case 22:
  case 33:
  case 44:
  case 55:
    clickMenuButtons(cursorX, cursorY);
    break;
  case 10:
  case 20:
  case 30:
  case 40:
  case 50:
    checkNote(cursorX, cursorY);
    break;
}
e.preventDefault();
}
