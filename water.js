// Cookie Functions
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    var midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()+exdays, 23, 59, 59);
    midnight.setTime(Date.parse(`${midnight}`));
    var expires = "expires=" + midnight.toUTCString();
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

// Cup class
class Cup {
  constructor(filled) {
    this._filled = filled;
  }
  get filled() {
    return this._filled;
  }
  set filled(newFilled) {
    this._filled = newFilled;
  }
}

// Adding water cups to the window
var amountOfCups = 8;
var cupList = {};
var cupContainer = document.getElementById("cupsContainer");
for (let i = 0; i < amountOfCups; i++) {
  let cupDiv = document.createElement("div");
  cupDiv.className = "cupStyle";
  cupContainer.appendChild(cupDiv);

  cupList[i] = new Cup();
  // Set cup filled bool from cookie if it exists
  if( getCookie(`fillCookie${i}`) == "true" ){
    cupList[i].filled = true;
    document.getElementsByClassName('cupStyle')[i].classList.add('cupFilled');

  } else {
    cupList[i].filled = false;

  }

}

// Get click events and fill water cups using event delegation
document.getElementById("cupsContainer").onclick = (event) => {
  let target = event.target;
  if (target.tagName != "DIV") return; //if not clicking on div exit

  let targetIndex;
  if ([...target.classList].includes("cupStyle")){ //Determine if the user selects a cup, spread operator to make classList an array
    for (let i = 0; i < amountOfCups; i++) {
      //iterate through every cup and determine if it needs to be filled or emptied
      if (typeof(targetIndex) == "undefined") {
        if (cupList[i].filled == true && document.getElementsByClassName('cupStyle')[i] == target){
          targetIndex = i;
          document.getElementsByClassName('cupStyle')[i].classList.remove('cupFilled');
          cupList[i].filled = false;

        } else if (cupList[i].filled == false && document.getElementsByClassName('cupStyle')[i] == target) {
          targetIndex = i;
          document.getElementsByClassName('cupStyle')[i].classList.add('cupFilled');
          cupList[i].filled = true;

        } else {
          document.getElementsByClassName('cupStyle')[i].classList.add('cupFilled');
          cupList[i].filled = true;

        }
      } else {
        document.getElementsByClassName('cupStyle')[i].classList.remove('cupFilled');
        cupList[i].filled = false;

      }

      setCookie(`fillCookie${i}`, cupList[i].filled, 0); // Set cookie for filled for a day
    }
  }

};
