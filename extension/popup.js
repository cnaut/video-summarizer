document.addEventListener('DOMContentLoaded', function() {
  var summarizeButton = document.getElementById('summarize');
  summarizeButton.addEventListener('click', function() {
    chrome.tabs.getSelected(null, function(tab) {
      d = document;

      var f = d.createElement('div');
      f.innerHTML = tab.url
      d.body.appendChild(f);
    });
  }, false);
}, false);