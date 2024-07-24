const fire = document.getElementById('fire');
const dialog = document.querySelector('.dialogCake');
const cake = document.getElementById('cake');
const candle = document.getElementById('candle');
const light = document.getElementById('light');
const container = document.querySelector('.container');
const spotlight = document.querySelector('.spotlight');
let spotlightX=0;
let spotlightY=0;
let bdCard = null;
let manga =null;
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
let doneEating = false;
let mouseUpCount = 0;
let hintNo=0;
let dialogNo=0;
const cakeDialog = [
    `Yes, it's a cake...`, //0
    `This is a temporary edible cake while I'm not there with you yet`,
    `Make your wish!!`,
    `tiupp`,
    `(Hint: mouse hold = blowing)`, //4 startblowing
    `bismillah. makannn!` 
]

const hintDialog = [
    `Alolo, try blowing it longer`,
    'Sweetie, you have to hold the mouse until it exinguishes..'
]

document.addEventListener('mousedown', e => {
  console.log (`target ${e.target.classList}`);

  if (this.bdCard !=null){
    if (e.target.closest('.spotlight')) {
      openSpotlight();
    }
  }
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
    
    if(mouseUpCount==3 || mouseUpCount==10 && curFrame==fireFrames.length-1){
        dialog.textContent=hintDialog[hintNo];
        hintNo=1;
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
document.addEventListener('keydown', e=>{
  if (e.key.toLowerCase === 't' && container.querySelector('mangga-wrapper')!=null){ 
    // toggleSpotlight();
    console.log("You pressed 't'!");
  } else if (e.key ===' ' || e.code==='Space'){
    if (container.querySelector('.bdCard')!=null){
      // decOpacity(this.bdCard, 0.2);
      // decOpacity(spotlight, 0.2);
      console.log(this.bdCard.parentElement);
      this.bdCard.parentElement.removeChild(this.bdCard);
      showManga();
      // spotlight.parentElement.removeChild(spotlight);
    }
    console.log("key pressed " + e.key);
  }
  
})




function openSpotlight(){
  document.addEventListener('mousemove', e=>{
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    // const mouseYRelativeToContainer = mouseY / container.getAttribute('min-height');

    const gradientCenterX = (mouseX/window.innerWidth)*100;
    const gradientCenterY = (mouseY/window.innerHeight)*100;
    this.spotlightX=gradientCenterX;
    this.spotlightY=gradientCenterY;
  
    spotlight.style.background = `radial-gradient(
          circle 250px at ${gradientCenterX}% ${gradientCenterY}%, 
          transparent 10%, 
          rgba(0,0,0,0.98)
      )`
  });

}

function slowHide(Object, rate){

}

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
      doneEating = true;
      showCard();
    }
    
}

function showCard(){
  if(document.querySelector('.cake-wrapper')!=null){ 
    container.removeChild(document.querySelector('.cake-wrapper'));

    const bdHTML = `
      <div class="grid-parent m-3 d-flex flex-row flex-nowrap justify-content-center align-items-center " style="min-width: fit-content;">
        <div class="row">
            <div class="col col-3">
                    <img class="img" src="img/balloon.png" alt="balloon" style="max-width: 400">
                </div>
            </div>
            <div class="col col-auto">
                <div class="bdCard shadow card text-light text-center fs-4 fw-semibold" style="max-height: 90vh !important;">
                    <div class="card-header" style="max-height: fit-content !important;">Emil Ziyad ❤️</div>
                    <div class="card-text" ><img class="img" src="img/mikowka.png" alt="emil" style="max-height: 70vh !important;"></div>
                    <div class="card-body mb-2">
                    <p>For You - 22nd July Special</p>
                    </div>
                    
                  </div>
            </div>
            <div class="col-3">
                    <img class="img" src="img/balloon.png" alt="balloon" style="max-width: 400">
            </div>
        </div>
        <div class="text-center text-warning-emphasis my-2">'Space Bar' to next</div>
      </div>`;
    const bdCard = document.createElement('div');
    bdCard.innerHTML = bdHTML;
    container.appendChild(bdCard);
    this.bdCard=bdCard;
    container.style.innerHeight = 'auto';
    console.log(this.bdCard, bdCard)
    
    spotlight.style.visibility = 'visible'; //sets spotlight to close, to not reveal the card yet
    // openSpotlight();
  }
}

// function toggleSpotlight(){
//   if(spotlight.style.visibility == 'visible'){
//     spotlight.style.visibility = 'hidden';
//     container.classList.toggle('mangga-mode');
//   } else {
//     spotlight.style.visibility = 'visible';
//     if (container.classList.contains('manga-mode')){
//       container.classList.remove('manga-mode');
//     }
//   }
// }

function showManga(){
  if(manga ==null){ 
    manga = container.innerHTML+=`
    <div class="mangga-wrapper mt-2 d-flex align-items-center justify-content-center flex-wrap" >
      <img class="mangga" id="manga" src="img/manga/1.png" alt="manga page 1" >
      <img class="mangga" id="manga" src="img/manga/2.png" alt="manga page 2" >
      <img class="mangga" id="manga" src="img/manga/3.png" alt="manga page 2" >
    </div>`;
    document.querySelector('body').style.backgroundColor= "#ffffff";
    console.log(`scroll height: ${document.documentElement.scrollHeight}`)
    container.classList.toggle('manga-mode');
    spotlight.style.cssText = `
      min-height: 3284px !important;
      position: absolute;
      inset: 0;
      background-color: green;
      pointer-events: none;
      z-index: 99;
      radial-gradient(
          circle 250px at ${gradientCenterX}% ${gradientCenterY}%, 
          transparent 10%, 
          rgba(0,0,0,0.98)
      )
    `;

  //   spotlight.style.cssText = `
  //   width: 200px;  /* Adjust width as desired */
  //   height: 300px;  /* Adjust height as desired */
  //   position: absolute;
  //   top: 50%;  /* Position at center vertically */
  //   left: 50%;  /* Position at center horizontally */
  //   transform: translate(-50%, -50%); /* Center the rectangle */
  //   background-color: green;
  //   pointer-events: none;
  //   z-index: 99;
  //   /* Update gradient for rectangular spotlight (optional) */
  //   radial-gradient(
  //     ellipse closest-side at ${gradientCenterX}% ${gradientCenterY}%,
  //     transparent 10%,
  //     rgba(0,0,0,0.98)
  //   );
  // `;
    this.manga=manga;
    spotlight.scrollTo({ top: 0, behavior: 'instant' });
  }
  
}

function loadFrames() {
  for (let i = 0; i < 112; i++) {
    fireFrames.push(`img/fire/fire (${i + 1}).png`);
  }
  for (let i = 0; i < 13; i++) {
    cakeFrames.push(`img/cake/cake (${i+1}).png`);
  }
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
    }, 1500); 
  }
}

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

spotlight.style.minHeight= '100vh';
loadFrames(); // Call loadFrames even if animation is not used (optional)
animateFire();
// showCard();
