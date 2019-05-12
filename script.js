// Cookie Functions
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
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

$(document).ready(function(){
  //current time
  //update every 10 seconds;
  setCurrentTime();
  setInterval(function(){
    setCurrentTime();
  },10*1000);

  var username = getCookie('username');
  //check cookie
  if(username){
    $('.greeting').css('display','inline-block');
    $('.user-name').css('display','none');
    var interest = getCookie('interestCookie');

    if(getCookie('interestCookie')){
      $('.interest').css('display', 'none');
      $('.interest-text').val(getCookie('interestCookie'));
      $('.greeting').html(`<span class="stored-name">${username}</span>, take action.`);

      var picture_url = getCookie('picture');
      if(!picture_url){
        newimage(interest, 1);
      } else {
        newimage(interest);
      }
      picture_url = getCookie('picture');
      $('body').css('background-image',`url(${picture_url})`);
    } else {
      $('.greeting').html(`What's your interest?`);
      $('.interest').css('display', 'inline-block');
    }

  } else{
    $('.user-name').css('display','inline-block');
    $('.greeting').html(`What's your name?`);
  }

  $('.user-name').keypress(function(e) {
    if(e.which == 13) {
      var username = e.target.value;
      if(!username) return;
      $('.user-name').fadeOut(function(){
        $('.greeting').html(`Hello ${username}.`);
        $('.greeting').fadeIn(function(){
          setCookie('username', username,365);
        });
      });
    }
  });

  $('.interest-text').keypress(function(e) {
    if(e.which == 13) {
      var oldInterest = getCookie('interestCookie');
      var interest = e.target.value;
      if(!interest) return;
      if(oldInterest != interest){
        newimage(interest);
        $('.interest-text').val(interest);
      }
      setCookie('interestCookie', interest, 365);
    }
  });

});

function setCurrentTime(){
  var now = new Date();
  if (now.getMinutes() < 10){
    var minutes = `0${now.getMinutes()}`;
  } else{
    var minutes = now.getMinutes();
  }

  if (now.getHours() >= 12){
    $('.time').html(`${now.getHours()-12}:${minutes} PM`)
  } else{
    $('.time').html(`${now.getHours()}:${minutes} AM`)
  }

  $('.date').html(now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
}

function newimage(keyword, random){
  var ACCESS_KEY = "0cf2e11f01c9623abd9342073320bc565c73ccb9c87081bea28408105a01dde1";
  if(!ACCESS_KEY){
    alert("Please update your access key");
    return;
  }
  var url = `https://api.unsplash.com/search/photos?query=${keyword}&per_page=20&orientation=landscape&client_id=${ACCESS_KEY}`;
  $.get(url, function(data){
    if(random == 1){
      var resultSel = Math.floor(Math.random() * data.results.length);
      setCookie("resultCookie", resultSel);
    } else if(getCookie('resultCookie')) {
      var resultSel = getCookie('resultCookie');
    } else{
      var resultSel = 0;
    }
    var picture = data.results[resultSel];
    var picture_url = picture.urls.raw;
    var photo_by_name = picture.user.name;
    var photo_by_url = picture.user.links.html;
    var cookieTime = 0.5;
    setCookie("picture", picture_url, cookieTime);
    setCookie("photo-by-name",photo_by_name, cookieTime);
    setCookie("photo-by-url",photo_by_url, cookieTime);
    $('.interest-text').val(keyword);
    $('.photoby').html(photo_by_name);
    $('.photoby').attr('href',photo_by_url);
    $('body').css('background-image',`url(${picture_url})`);
  });
}
