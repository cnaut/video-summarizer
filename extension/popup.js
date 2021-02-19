document.addEventListener('DOMContentLoaded', function() {
  var summarizeButton = document.getElementById('summarize');
  summarizeButton.addEventListener('click', function() {
    chrome.tabs.getSelected(null, function(tab) {
      fetch('http://localhost:3000?url='+tab.url).then(r => r.text()).then(result => {
        // Result now contains the response text, do what you want...
        console.log(result)
        
        d = document;

        var f = d.createElement('div');
        f.innerHTML = result
        d.body.appendChild(f);
      });
    })

  }, false);
}, false);