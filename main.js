import { words,abcStr } from "./words.js";

window.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('.start').addEventListener('click',start)
})


let randWord
let viewportWidth=window.innerWidth
let r = 0
function start(){ 
    r++
    if(r!==1){
        location.reload()
    }
    const randIndex=Math.floor(Math.random()*words.length)
    randWord=words[randIndex]    
    console.log(randWord);
    displayBoxes(randWord,'boxContainer')
    displayAbc(abcStr,'abc')
    document.body.style.setProperty('--size',Math.floor(Math.min(viewportWidth/randWord.length-20,100))+'px')
    document.getElementById("timer").innerHTML=`<span id="app"></span>`
    document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

startTimer();
}

export function displayBoxes(word,id){
    document.getElementById(id).innerHTML=''
    Array.from(word).forEach(letter=>
        document.getElementById(id).innerHTML+=`
            <div class="box w-[var(--size)] h-[var(--size)] bg-violet-500 flex justify-center items-center text-3xl"></div>
        `
        )
}
export function displayAbc(str,id){
    document.getElementById(id).innerHTML=''
    Array.from(str).forEach(letter=>
        document.getElementById(id).innerHTML+=`
        <button class="letter w-[50px] h-[50px] bg-blue-500 flex justify-center items-center text-2xl rounded disabled:bg-slate-700">${letter}</button>
    `
        )
    document.querySelectorAll('.letter').forEach(btn=>
        btn.addEventListener('click',checkLetter)
        )
    
}
let h = 0
let tipp = 0
export function checkLetter(e){
    tipp++
    let clickedLetter=e.target.textContent;
    let boxNodeList=document.querySelectorAll('.box')//olyan mint egy tömb
    Array.from(randWord).forEach((letter,index)=>{
            if(clickedLetter==letter){ boxNodeList[index].textContent=letter; h++;console.log(h);}

    })
    if(h==randWord.length){
        alert("Sikeresen kitaláltad "+tipp+"-tippel")
        location.reload()
    }
    e.target.disabled=true //amelyikre kattintottál ne lehessen többet kattintani
}



const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;



export function onTimesUp() {
  clearInterval(timerInterval);
  alert("Lejárt az idő!")
  setTimeout(2000);
  location.reload()
}

export function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

export function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

export function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

export function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

export function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}