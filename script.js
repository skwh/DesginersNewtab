const project_types = ["Logo", "Logonym", "Front Page", "Flyer", "Poster", "Magazine Advertisment", "Banner Ad"];
const company_names = ["Experia", "Zootax", "Apredbam", "Hextech", "Kondrill", "Kaycan", "Tempfase", "Qvotechi"];
const company_types = ["construction", "software", "design", "manufacturing", "cleaning", "hardware", "spaceflight", "commercial aviation", "retail", "pharmaceutical", "production"];
const company_verbs = ["making", "destroying", "coding", "developing", "researching", "creating", "launching", "selling", "buying", "investing", "cleaning", "recording"];
const company_adjectives = ["fancy", "blue", "green", "high-end", "cheap", "stylish"];
const company_nouns = ["armchairs", "sofas", "buildings", "boxes", "websites", "logos", "lamps", "rockets", "hospitals", "drugs", "bees", "youtube videos", "dicks in a box"];

const VERBOSE = false;

class Site {
  constructor(name, cover, title, link) {
    this.name = name;
    this.cover = cover;
    this.title = title;
    this.link = link;
  }
}

window.addEventListener("load", function() {
  DNT.doLoad();
});

let DNT = {
  doLoad: function() {
    DNT.greeting.makeGreeting();
    DNT.clock.startClock();
    DNT.site.loadSites();
    DNT.project.handleProjectUpdate();
    DNT.setSitesClickable();
    DNT.storage.setLocalStorage();

    $('#reload-button').click(DNT.reloadPages);
  },
  setSitesClickable: function() {
    $('.site').on('mouseup', function(e) {
      window.location = $(this).attr("data-link");
    });
  },
  reloadPages: function() {
    localStorage.setItem(DNT.storage.key,0);
    DNT.site.loadSites();
    DNT.storage.setLocalStorage();
  },
  clock: {
    startClock: function() {
      DNT.clock.setClock();
      setInterval(DNT.clock.setClock, 1000);
    },
    setClock: function() {
      let time = new Date(Date.now());
      let timestring = "";
      let minutes = Utils.zeroPad(time.getMinutes());
      let seconds = Utils.zeroPad(time.getSeconds());
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
  },
  storage: {
    key: "newtab-last-updated",
    setLocalStorage: function() {
      let now = new Date(Date.now());
      localStorage.setItem(DNT.storage.key, now.getDay());
    },
    setSiteLocalStorage: function(site) {
      Console.log("Setting storage for " + site.name + ", storing:\n cover: " + site.cover_url + "\n title: " + site.title +"\n link: " + site.link);
      localStorage.setItem(site.name+"-site-cover", site.cover);
      localStorage.setItem(site.name+"-site-title", site.title);
      localStorage.setItem(site.name+"-site-link", site.link);
    },
    getSiteLocalStorage: function(site_name) {
      Console.log("Retrieving stored data for " + site_name);
      var site_cover = localStorage.getItem(site_name + "-site-cover");
      var site_title = localStorage.getItem(site_name + "-site-title");
      var site_link = localStorage.getItem(site_name + "-site-link");
      let retrieved_site = new Site(site_name, site_cover, site_title, site_link)
      Console.log(retrieved_site);
      return retrieved_site;
    },
    getUpdate: function() {
      Console.log("Checking if update needed.");
      let now = new Date(Date.now());
      return localStorage.getItem(DNT.storage.key) != now.getDay();
    }
  },
  greeting: {
    makeGreeting: function() {
      let greeting = DNT.greeting.getHeaderGreeting(DNT.greeting.getCurrentTime());
      DNT.greeting.setHeaderGreeting(greeting);
    },
    getCurrentTime: function() {
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
    },
    getHeaderGreeting: function(time) {
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
    },
    setHeaderGreeting: function(greeting) {
      document.getElementById("header-text").innerText = greeting;
    }
  },
  site: {
    behance_api_url:"https://api.behance.net/v2/projects",
    dribbble_api_url: "https://api.dribbble.com/v1/shots",
    dribbble_access_token: "087dd103dd03b0a15732cc3fa5d3a662efdcfaf4ece50cf17b9f9d23ec804951",
    reddit_api_url: "https://reddit.com/r/wholesomememes/hot.json",
    typewolf_json_url: "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=https://www.typewolf.com/feed&num=1",
    setBehanceLink: function() {
      DNT.site.handleSiteUpdate("behance", DNT.site.behance_api_url, {
        "field":44,
        "client_id":"xzMW6VhqpILVvGl6LVMbYJkUPKX7V3SA"
      }, function(data) {
        let project_index = Utils.getRandom(12);
        let cover_url = data.projects[project_index].covers["404"];
        let project_title = data.projects[project_index].name;
        let project_link = data.projects[project_index].url;
        let behance = new Site("behance", cover_url, project_title, project_link);
        DNT.storage.setSiteLocalStorage(behance);
        DNT.site.setSiteCover(behance);
      });
    },
    setDribbbleLink: function() {
      DNT.site.handleSiteUpdate("dribbble", DNT.site.dribbble_api_url, {
        "access_token": DNT.site.dribbble_access_token
      }, function(data) {
        let shot_index = Utils.getRandom(12);
        let cover_url = data[shot_index].images["normal"];
        let shot_title = data[shot_index].title;
        let shot_link = data[shot_index].html_url;
        let dribbble = new Site("dribbble", cover_url, shot_title, shot_link);
        DNT.storage.setSiteLocalStorage(dribbble);
        DNT.site.setSiteCover(dribbble);
      });
    },
    setRedditLink: function() {
      DNT.site.handleSiteUpdate("reddit", DNT.site.reddit_api_url, {}, function(d) {
        let post_index = Utils.getRandom(27);
        let post_domain = "";
        while (post_domain != "i.imgur.com") {
          post_index = Utils.getRandom(27);
          post_domain = d.data.children[post_index].data.domain;
        }
        let cover_url = d.data.children[post_index].data.url;
        let post_title = d.data.children[post_index].data.title;
        let reddit = new Site("reddit", cover_url, post_title, cover_url)
        DNT.storage.setSiteLocalStorage(reddit);
        DNT.site.setSiteCover(reddit);
      });
    },
    setTypewolfLink: function() {
      DNT.site.handleSiteUpdate("typewolf", DNT.site.typewolf_json_url, {}, function(data) {
        entry = JSON.parse(data).responseData.feed.entries[0];
        let post_title = entry.title;
        let post_link = entry.link;
        let cover_url = entry.content.substring(entry.content.indexOf("src=\"")+5, entry.content.indexOf("alt")-2);
        let typewolf = new Site("typewolf", cover_url, post_title, post_link);
        DNT.storage.setSiteLocalStorage(typewolf);
        DNT.site.setSiteCover(typewolf);
      });
    },
    setSiteCover: function(site) {
      Console.log("Setting cover for " + site.name + ", setting:\n cover: " + site.cover + "\n title: " + site.title +"\n link: " + site.link);
      $('#' + site.name).css("background-image", "url(" + site.cover + ")").attr("data-title", site.title).attr("data-link", site.link);
    },
    handleSiteUpdate: function(site_name, site_api_url, site_data, site_callback) {
      if (DNT.storage.getUpdate()) {
        Console.log(site_name + " needs an update, updating...")
        $.ajax({
          url: site_api_url,
          crossDomain: true,
          data: site_data,
          success: site_callback
        });
      } else {
        Console.log(site_name + " does not need an update, retrieving from storage.");
        let site = DNT.storage.getSiteLocalStorage(site_name);
        DNT.site.setSiteCover(site);
      }
    },
    loadSites: function() {
      DNT.site.setRedditLink();
      DNT.site.setDribbbleLink();
      DNT.site.setBehanceLink();
      DNT.site.setTypewolfLink();
    }
  },
  project: {
    key:"practice-project",
    handleProjectUpdate: function() {
      if (DNT.storage.getUpdate()) {
        Console.log("Updating practice project...");
        DNT.project.generatePracticeProject();
      } else {
        let practice_project_sentence = localStorage.getItem(DNT.project.key);
        DNT.project.setPracticeProject(practice_project_sentence);
      }
    },
    generatePracticeProject: function() {
      let randomType = project_types[Utils.getRandom(project_types.length)];
      let randomName = company_names[Utils.getRandom(company_names.length)];
      let randomCompanyType = company_types[Utils.getRandom(company_types.length)];
      let randomCompanyVerb = company_verbs[Utils.getRandom(company_verbs.length)];
      let randomCompanyAdjective = company_adjectives[Utils.getRandom(company_adjectives.length)];
      let randomCompanyNoun = company_nouns[Utils.getRandom(company_nouns.length)];
      let practice_project_sentence = "Design a <span class='red'>" + randomType + "</span> for <span class='blue'>" + randomName +"</span>, a <span class='green'>" + randomCompanyType + "</span> company that specializes in " + randomCompanyVerb + " " + randomCompanyAdjective + " " + randomCompanyNoun + ".";
      DNT.project.setPracticeProject(practice_project_sentence);
      DNT.project.storePracticeProject(practice_project_sentence);
    },
    storePracticeProject: function(sentence) {
      localStorage.setItem(DNT.project.key, sentence);
    },
    setPracticeProject: function(sentence) {
      $('#practice-project-description').html(sentence);
    }
  }
}

let Console = {
  log: function(text) {
    if (VERBOSE) {
      console.log(text);
    }
  }
}

let Utils = {
  getRandom: function(upperBound) {
    return Math.floor(Math.random() * upperBound);
  },
  zeroPad: function(time) {
    if (time < 10) {
      return "0" + time;
    }
    return time;
  }
}
