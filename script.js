const project_types = ["Logo", "Logonym", "Front Page", "Flyer", "Poster", "Magazine Advertisment", "Banner Ad"];
const company_names = ["Experia", "Zootax", "Apredbam", "Hextech", "Kondrill", "Kaycan", "Tempfase", "Qvotechi"];
const company_types = ["construction", "software", "design", "manufacturing", "cleaning", "hardware", "spaceflight", "commercial aviation", "retail", "pharmaceutical", "production"];
const company_verbs = ["making", "destroying", "coding", "developing", "researching", "creating", "launching", "selling", "buying", "investing", "cleaning", "recording"];
const company_adjectives = ["fancy", "blue", "green", "high-end", "cheap", "stylish"];
const company_nouns = ["armchairs", "sofas", "buildings", "boxes", "websites", "logos", "lamps", "rockets", "hospitals", "drugs", "bees", "youtube videos", "dicks in a box"];

function getRandom(upperBound) {
  return Math.floor(Math.random() * upperBound);
}

window.addEventListener("load", function() {
  let greeting = getHeaderGreeting(getCurrentTime());
  setHeaderGreeting(greeting);
  startClock();
  setBehanceLink();
  setDribbbleLink();
  setRedditLink();
  setTypewolfLink();
  handleProjectUpdate();
  setSitesClickable();
  setLocalStorage();

  $('#reload-button').click(reloadPages);
});

function startClock() {
  setClock();
  setInterval(setClock, 1000);
}

function setClock() {
  let time = new Date(Date.now());
  let timestring = "";
  let minutes = zeroPad(time.getMinutes());
  let seconds = zeroPad(time.getSeconds());
  let hours = time.getHours();
  let half = "AM";
  if (hours >= 12) {
    half = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  }
  if (hours == 0) {
    hours = 12;
  }
  timestring = hours + ":" + minutes + ":" + seconds + " " + half;
  $('#time').text(timestring);
}

function zeroPad(time) {
  if (time < 10) {
    return "0" + time;
  }
  return time;
}

function setLocalStorage() {
  let now = new Date(Date.now());
  localStorage.setItem("newtab-last-updated", now.getDay());
}

function setSiteLocalStorage(site_name, site_cover, site_title, site_link) {
  console.log("Setting storage for " + site_name + ", storing:\n cover: " + site_cover + "\n title: " + site_title +"\n link: " + site_link);
  localStorage.setItem(site_name+"-site-cover", site_cover);
  localStorage.setItem(site_name+"-site-title", site_title);
  localStorage.setItem(site_name+"-site-link", site_link);
}
function getSiteLocalStorage(site_name) {
  console.log("Retrieving stored data for " + site_name);
  let data = [];
  var site_cover = localStorage.getItem(site_name + "-site-cover");
  var site_title = localStorage.getItem(site_name + "-site-title");
  var site_link = localStorage.getItem(site_name + "-site-link");
  data.push(site_cover, site_title, site_link);
  console.log(data);
  return data;
}

function getUpdate() {
  console.log("Checking if update needed.");
  let now = new Date(Date.now());
  return localStorage.getItem("newtab-last-updated") != now.getDay();
}

function setSitesClickable() {
  $('.site').on('mouseup', function(e) {
    window.location = $(this).attr("data-link");
  });
}

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

function setSiteCover(site_name, cover_url, site_title, site_link) {
  console.log("Setting cover for " + site_name + ", setting:\n cover: " + cover_url + "\n title: " + site_title +"\n link: " + site_link);
  $('#' + site_name).css("background-image", "url(" + cover_url + ")").attr("data-title", site_title).attr("data-link", site_link);
}

function setBehanceLink() {
  handleSiteUpdate("behance", "https://api.behance.net/v2/projects", {
    "field":44,
    "client_id":"xzMW6VhqpILVvGl6LVMbYJkUPKX7V3SA"
  }, function(data) {
    let project_index = getRandom(12);
    let cover_url = data.projects[project_index].covers["404"];
    let project_title = data.projects[project_index].name;
    let project_link = data.projects[project_index].url;
    setSiteLocalStorage("behance", cover_url, project_title, project_link);
    setSiteCover("behance", cover_url, project_title, project_link);
  });
}

function setDribbbleLink() {
  handleSiteUpdate("dribbble", "https://api.dribbble.com/v1/shots", {
    "access_token":"087dd103dd03b0a15732cc3fa5d3a662efdcfaf4ece50cf17b9f9d23ec804951"
  }, function(data) {
    let shot_index = getRandom(12);
    let cover_url = data[shot_index].images["normal"];
    let shot_title = data[shot_index].title;
    let shot_link = data[shot_index].html_url;
    setSiteLocalStorage("dribbble", cover_url, shot_title, shot_link);
    setSiteCover("dribbble", cover_url, shot_title, shot_link);
  });
}
function setRedditLink() {
  handleSiteUpdate("reddit", "https://reddit.com/r/wholesomememes/hot.json", {}, function(d) {
    let post_index = getRandom(27);
    let post_domain = "";
    while (post_domain != "i.imgur.com") {
      post_index = getRandom(27);
      post_domain = d.data.children[post_index].data.domain;
    }
    let cover_url = d.data.children[post_index].data.url;
    let post_title = d.data.children[post_index].data.title;
    setSiteLocalStorage("reddit", cover_url, post_title, cover_url);
    setSiteCover("reddit", cover_url, post_title, cover_url);
  });
}
function setTypewolfLink() {
  handleSiteUpdate("typewolf", "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=https://www.typewolf.com/feed&num=1", {}, function(data) {
    entry = JSON.parse(data).responseData.feed.entries[0];
    let post_title = entry.title;
    let post_link = entry.link;
    let cover_url = entry.content.substring(entry.content.indexOf("src=\"")+5, entry.content.indexOf("alt")-2);
    setSiteLocalStorage("typewolf", cover_url, post_title, post_link);
    setSiteCover("typewolf", cover_url, post_title, post_link);
  });
}

function handleSiteUpdate(site_name, site_api_url, site_data, site_callback) {
  if (getUpdate()) {
    console.log(site_name + " needs an update, updating...")
    $.ajax({
      url: site_api_url,
      crossDomain: true,
      data: site_data,
      success: site_callback
    });
  } else {
    console.log(site_name + " does not need an update, retrieving from storage.");
    let data = getSiteLocalStorage(site_name);
    setSiteCover(site_name, data[0], data[1], data[2]);
  }
}

function handleProjectUpdate() {
  if (getUpdate()) {
    console.log("Updating practice project...");
    generatePracticeProject();
  } else {
    let practice_project_sentence = localStorage.getItem("practice-project");
    setPracticeProject(practice_project_sentence);
  }
}

function generatePracticeProject() {
  let randomType = project_types[getRandom(project_types.length)];
  let randomName = company_names[getRandom(company_names.length)];
  let randomCompanyType = company_types[getRandom(company_types.length)];
  let randomCompanyVerb = company_verbs[getRandom(company_verbs.length)];
  let randomCompanyAdjective = company_adjectives[getRandom(company_adjectives.length)];
  let randomCompanyNoun = company_nouns[getRandom(company_nouns.length)];
  let practice_project_sentence = "Design a <span class='red'>" + randomType + "</span> for <span class='blue'>" + randomName +"</span>, a <span class='green'>" + randomCompanyType + "</span> company that specializes in " + randomCompanyVerb + " " + randomCompanyAdjective + " " + randomCompanyNoun + ".";
  setPracticeProject(practice_project_sentence);
  storePracticeProject(practice_project_sentence);
}

function storePracticeProject(sentence) {
  localStorage.setItem("practice-project", sentence);
}

function setPracticeProject(sentence) {
  $('#practice-project-description').html(sentence);
}

function reloadPages() {
  localStorage.setItem("newtab-last-updated",0);
  setBehanceLink();
  setRedditLink();
  setDribbbleLink();
  setTypewolfLink();
  setLocalStorage();
}
