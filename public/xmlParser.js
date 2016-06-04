function bindEvents() {
  // delegated event handler for hide/show item
  document.querySelector('.container').onclick = function(e) {
    var close = e.target;
    
    // if the target element is other than hide/show btn then return false
    if (e.target.getAttribute('class') !== "close") return;
    
    // if the area is open
    if (close.getAttribute('data-show') == 'true') {
      close.parentNode.querySelector('.post-content').style.display = "none";
      close.setAttribute('data-show', 'false');
      close.textContent = "Show";
    } else {
      // if the area is hidden
      close.parentNode.querySelector('.post-content').style.display = "block";
      close.setAttribute('data-show', 'true');
      close.textContent = "Hide";
    }
  }
}

function parseXML(isXML) {
  // unescapes the xml string with html escape characters
  if (!isXML) {
    var div = document.createElement('div');
    div.innerHTML = xml;
    xml = div.childNodes[0].nodeValue;
  }
  // XML parser
  parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xml, "application/xml");

  var resultArr = xmlDoc.querySelectorAll('entry');

  var container = document.querySelector('.container');
  
  // iterate over the xml results 
  for (var i=0; i<resultArr.length; i++) {
    
    var xmlEl = resultArr[i];
    
    // container for the post
    var postContainer = document.createElement('div');
    postContainer.setAttribute('class', 'post-container');
    
    // adds the title to the post
    var title = document.createElement('h3');
    var titleLink = document.createElement('a');
    title.setAttribute('class', 'post-title');
    titleLink.setAttribute('target', '_blank');
    titleLink.textContent = xmlEl.querySelector('title').textContent;
    title.appendChild(titleLink);
    postContainer.appendChild(title);
    
    // adds the main content of post
    var content = document.createElement('div');
    content.setAttribute('class', 'post-content');
    content.innerHTML = xmlEl.querySelector('content').textContent;
    
    // this code section looks out for the [link] area inside the content
    // and stores the link of post
    var spanTags = content.querySelectorAll('span');
    var postLink = '';
    
    for (var j=0; j<spanTags.length; j++) {
      if (spanTags[j].textContent === "[link]") {
        postLink = spanTags[j].querySelector('a').getAttribute('href');
        break;
      }
    }
    
    // adds the link to the title of post
    postContainer.querySelector('.post-title a').setAttribute('href', postLink);
    
    postContainer.appendChild(content);
    
    // adds the show hide button on right top
    var close = document.createElement('a');
    close.textContent = 'Hide';
    close.setAttribute('class', 'close');
    close.setAttribute('data-show', 'true');
    postContainer.appendChild(close);
    
    // code for updated at segment for post
    var updatedAt = xmlEl.querySelector('updated').textContent;
    var updated = document.createElement('span');
    updated.setAttribute('class', 'updated-at');
    updated.textContent = 'Updated At ' + getDateString(new Date(updatedAt));
    postContainer.appendChild(updated);
    
    container.appendChild(postContainer); // append the post to main container
  }
  
  // populate the date and time section with the iso 8601 string
  document.querySelector('.date-time').textContent = new Date().toISOString();
}

// starts the timer for time spent on page
function startTimer() {
  var timeSpent = 0;
  var startTime = new Date().getTime();
  window.setInterval(function() {
    timeSpent++;
    
    // check if the timer is not lagging by comparing
    // with the starttime in milliseconds
    var currTime = new Date().getTime();
    var diff = Math.round((currTime - startTime) / 1000);
    if (diff > timeSpent) {
      timeSpent = diff;
    }
    
    // set the time at 1s interval
    var minutes = parseInt(timeSpent / 60);
    var seconds = timeSpent % 60;
    var displayTime = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    document.querySelector('.timer').textContent = displayTime;
  }, 1000);
}

// returns the formatted date string
function getDateString(date) {
  var day = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
  var month = (date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
  var year = date.getFullYear();
  var hour = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours());
  var minutes = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
  var seconds = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
  return day + '-' + month + '-' + year + ' ' + hour + ':' + minutes + ':' + seconds;
}

// initializer function for feeder
function initializeFeeder() {
  parseXML(); // parse the xml content
  startTimer(); // start the timer for time spent on page
  bindEvents(); // bind the delegated event to show/hide
}

// method for refreshing feed
function refreshFeed() {
  
  // makes an ajax request to server to fetch current data
  var xmlHTTP = new XMLHttpRequest();
  var url = "/refresh";
  
  var refresh = document.querySelector('.refresh');
  refresh.setAttribute('class', 'refresh loading');
  
  xmlHTTP.onreadystatechange = function() {
    if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) {
      xml = xmlHTTP.response;
      
      // remove all previous posts
      var container = document.querySelector('.container');
      while (document.querySelector('.post-container')) {
        container.removeChild(document.querySelector('.post-container'));
      }
      
      // parse the xml
      parseXML(true);
      refresh.setAttribute('class', 'refresh');
    } 
  }
  
  xmlHTTP.open('GET', url, true);
  xmlHTTP.send();
}

window.onload = initializeFeeder;