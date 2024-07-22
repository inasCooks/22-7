const fire = document.getElementById('fire');
const dialog = document.querySelector('.dialogCake');
const cake = document.getElementById('cake');
const candle = document.getElementById('candle');
const light = document.getElementById('light');
let curFrame = 0;
let cakeFrame = 0;
const fireFrames = [];
const cakeFrames = [];
const normalFireSpeed = 60;
const startPadamAt = 10;
let speedUpVal = 1;
let opacityInterval; // Declare opacityInterval outside any function
let candleBlown = false;
let startBlowing = false;
let startEating = false;
let mouseUpCount = 0;
let dialogNo=0;
const cakeDialog = [
    `Yes, it's a cake...`, //0
    `This is a temporary edible cake while I'm not there with you yet`,
    `But first, make your wish okayy sweetie (dalam hati)`,
    `tiupp`,
    `(Hint: mouse hold = blowing)`, //4 startblowing
    `Now Gobble Up!` //5 hint
]

const hintDialog = [
    `Alolo, try blowing it longer`
]

function nextDialog(){
    dialog.textContent = cakeDialog[dialogNo];
    if(dialogNo==4)
        startBlowing=true;
    if (dialogNo==5)
        startEating=true;
      startEatingListener();
    dialogNo++;
}

function eatCake(){
    dialog.style.visibility = 'hidden';
    if (cakeFrame+1<13){
      cakeFrame++;
      console.log(cakeFrames[cakeFrame])
      cake.src = cakeFrames[cakeFrame];
      
    } else {
      cake.style.visibility='hidden';
    }
    
}

function loadFrames() {
  for (let i = 0; i < 112; i++) {
    fireFrames.push(`img/fire/fire (${i + 1}).png`);
  }
  for (let i = 0; i < 13; i++) {
    cakeFrames.push(`img/cake/cake (${i+1}).png`);
  }
  console.log(fireFrames,cakeFrames,cake.src)
}

async function animateFire() {
  curFrame = (curFrame + 1) % fireFrames.length; // Loop through frames
  fire.src = fireFrames[curFrame];
  console.log("fire animation is running.");
  fireAnimTimer = setTimeout(animateFire, fireSpeed());
}

function fireSpeed() {
  return normalFireSpeed / speedUpVal; // Adjust frame rate based on speedUpVal
}

function setSpeedUp(newSpeedUpVal) {
  speedUpVal = Math.min(newSpeedUpVal, 20); // Cap at 20
}

let speedIncreaseInterval; // Variable to store the interval ID

function startEatingListener(){
  if(startEating){
    setTimeout(() => {
      console.log('gobbling can now begin')
      document.addEventListener('click', e => {
        if (startEating) {
          candle.style.visibility = 'hidden';
          eatCake();
        }
      });
    }, 3000); 
  }
}



document.addEventListener('mousedown', e => {

    //for dialog
    if(!startBlowing){
        nextDialog();
    //for candle blowing
    }else{
        if (opacityInterval) 
            clearInterval(opacityInterval);
        speedIncreaseInterval = setInterval(() => {
        setSpeedUp(speedUpVal + 1); //  (capped at 20)
        if (fireSpeed() <= startPadamAt) {
            if(!candleBlown){
                decOpacity(fire,0.1); 
                if (parseFloat(fire.style.opacity)<=0){
                    candleBlown=true;
                    light.style.visibility = 'hidden';
                    nextDialog();
                    clearTimeout(fireAnimTimer);
                    clearInterval(speedIncreaseInterval);
                }
            }
        }
        }, 100); 
    }


});

document.addEventListener('mouseup', e => {
    
    if(mouseUpCount==3){
        dialog.textContent=hintDialog[0];
    }
    if (!candleBlown && startBlowing){
        mouseUpCount++;
        clearInterval(speedIncreaseInterval); // Clear interval on mouseup
        setSpeedUp(1); // Reset speedUpVal to initial value on mouseup
        if (fire.style.opacity < 1) {
          opacityInterval = setInterval(() => {
            incOpacity(fire, 0.1); // Increase opacity back to 1 after mouseup
          }, 10); // Adjust interval as needed (e.g., 10 milliseconds)
        }
    }
});

function decOpacity(object, rate) {
  const currentOpacity = parseFloat(object.style.opacity) || 1; // Get current opacity (or 1 if not set)
  const newOpacity = Math.max(currentOpacity - rate, 0); // Decrease opacity gradually (capped at 0)
  object.style.opacity = newOpacity.toString(); // Set opacity with string representation
}

function incOpacity(object, rate) {
  const currentOpacity = parseFloat(object.style.opacity) || 0; // Get current opacity (or 0 if not set)
  const newOpacity = Math.min(currentOpacity + rate, 1); // Increase opacity gradually (capped at 1)
  object.style.opacity = newOpacity.toString(); // Set opacity with string representation
}

loadFrames(); // Call loadFrames even if animation is not used (optional)
console.log(fire);
animateFire();
