'use strict';

// Cookie Functions
function setCookie(cname, cvalue, exminutes) {
    var d = new Date();
    d.setTime(d.getTime() + (exminutes*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Initialize the timer
var defMinutes = 20;
var defSeconds = 0;
if(getCookie('dateCookie')){
  let dateCookie = getCookie('dateCookie');
  let timerCookie = getCookie('timerCookie');
  let currentTime = new Date();
  let currentTimeMilli = currentTime.getTime();
  let timePassed = (currentTimeMilli - Number(dateCookie))/60000;
  let newTimer = timerCookie - timePassed;
  var time = {
    minutes: Math.floor(newTimer),
    seconds: Math.floor(60 * (newTimer - Math.floor(newTimer)))
  };
} else {
  var time = {
    minutes: defMinutes,
    seconds: defSeconds
  };

  setAlarm();
}

// Alarm Functions
function setAlarm() {
  let minutes = time.minutes + (time.seconds)/60;
  chrome.browserAction.setBadgeText({text: 'ON'});
  chrome.alarms.create({delayInMinutes: minutes});
  chrome.storage.sync.set({minutes: minutes});
  //window.close();
}

function clearAlarm() {
  chrome.browserAction.setBadgeText({text: ''});
  chrome.alarms.clearAll();

  /****************
  *******************
  *******************
  *******************
  *******************
  5/8/19
  LEFT OFF HERE, MAKE A CLASS FOR THE TIME SO I CAN SET IT IN HERE
  Double Check that the timer goes off without having set the extension?
  Update Water Cups Style
    ie: opening a new window
  *******************
  *******************
  *******************
  *******************
  *******************/
  time.minutes = defMinutes;
  time.seconds = defSeconds;
  //window.close();
}

document.getElementById('startTimer').addEventListener('click', setAlarm);
document.getElementById('resetTimer').addEventListener('click', clearAlarm);

// MAKE TIMER BASED OFF DATE, reset when minutes > 20
const countdown = (min = time.minutes, sec = time.seconds) => {
  if (Number(sec) <= 0 && Number(min) <= 0) {
    setAlarm();
    min = defMinutes;
    sec = defSeconds;
  } else if (Number(sec) < 0) {
    min--;
    sec = 59;
  }
  let iniitialTime = `${ (min < 10 ? `0${min}` : min) }:${ (sec < 10 ? `0${sec}` : sec) }`;

  // Display updated time, store that time
  document.getElementById('timer').innerHTML = `${iniitialTime}`;
  chrome.storage.sync.set({'lastMin': min, 'lastSec': sec});

  // Store Date Cookie
  let timeOfStorage = new Date();
  setCookie("dateCookie", timeOfStorage.getTime(), time.minutes + (time.seconds)/60);
  setCookie("timerCookie", min+sec/60, time.minutes + (time.seconds)/60);

  // Call Function Again
  setTimeout(function() { countdown(min, sec-1) }, 1000);
};

var iniitialTime = `${time.minutes}:${time.seconds}`;
document.getElementById('timer').innerHTML = `${iniitialTime}`;
countdown();
