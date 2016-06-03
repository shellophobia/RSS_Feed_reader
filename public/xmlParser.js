// unescapes the xml string with html escape characters
var div = document.createElement('div');
div.innerHTML = xml;
xml = div.childNodes[0].nodeValue;

// XML parser
parser = new DOMParser();
var xmlDoc = parser.parseFromString(xml, "application/xml");

var resultArr = xmlDoc.querySelectorAll('entry');

var container = document.querySelector('.container');

for (var i=0; i<resultArr.length; i++) {
  var xmlEl = resultArr[i];
  var postContainer = document.createElement('div');
  postContainer.setAttribute('class', 'post-container');
  var title = document.createElement('h3');
  var titleLink = document.createElement('a');
  title.setAttribute('class', 'post-title');
  titleLink.setAttribute('target', '_blank');
  titleLink.textContent = xmlEl.querySelector('title').textContent;
  title.appendChild(titleLink);
  postContainer.appendChild(title);
  var content = document.createElement('div');
  content.setAttribute('class', 'post-content');
  content.innerHTML = xmlEl.querySelector('content').textContent;
  
  var spanTags = content.querySelectorAll('span');
  var postLink = '';
  
  for (var j=0; j<spanTags.length; j++) {
    if (spanTags[j].textContent === "[link]") {
      postLink = spanTags[j].querySelector('a').getAttribute('href');
      break;
    }
  }
  
  postContainer.querySelector('.post-title a').setAttribute('href', postLink);
  
  postContainer.appendChild(content);
  var close = document.createElement('a');
  close.textContent = 'Hide';
  close.setAttribute('class', 'close');
  close.setAttribute('data-show', 'true');
  postContainer.appendChild(close);
  container.appendChild(postContainer);
}

document.querySelector('.container').onclick = function(e) {
  var close = e.target;
  if (e.target.getAttribute('class') !== "close") return false;
  if (close.getAttribute('data-show') == 'true') {
    close.parentNode.querySelector('.post-content').style.display = "none";
    close.setAttribute('data-show', 'false');
    close.textContent = "Show";
  } else {
    close.parentNode.querySelector('.post-content').style.display = "block";
    close.setAttribute('data-show', 'true');
    close.textContent = "Hide";
  }
}

