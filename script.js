window.addEventListener("load", function() {
  let greeting = getHeaderGreeting(getCurrentTime());
  setHeaderGreeting(greeting);
});
function getCurrentTime() {
  let now = new Date(Date.now());
  if (now.getHours() <= 10) {
    return 0;
  } else if (now.getHours() <= 17) {
    return 1;
  } else if (now.getHours() <= 23) {
    return 2;
  } else {
    return 3;
  }
}

function getHeaderGreeting(time) {
  switch(time) {
    case 0:
      return "Good Morning, Evan";
    case 1:
      return "Good Day, Evan";
    case 2:
      return "Good Evening, Evan";
    default:
      return "Hello, Evan";
  }
}

function setHeaderGreeting(greeting) {
  document.getElementById("header-text").innerText = greeting;
}
