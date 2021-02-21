document.addEventListener('DOMContentLoaded', function() {

  chrome.storage.sync.get(["firstName", "lastName", "email"], ({firstName, lastName, email}) => {
    console.log(firstName)
    console.log(lastName)
    if (firstName && lastName && email) {
      hideSetupDiv();
      showSummaryDiv();
    }
  });

  var saveButton = document.getElementById('save-email');
  saveButton.addEventListener('click', function() {
    hideSetupDiv();

    chrome.storage.sync.set({
      'firstName': document.getElementById("first").value,
      'lastName': document.getElementById("last").value,
      'email': document.getElementById("email").value
    }, function() {
      showSummaryDiv();
    });
  }, false);

  var summarizeButton = document.getElementById('summarize');

  summarizeButton.addEventListener('click', function() {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.storage.sync.get(["firstName", "lastName", "email"], ({firstName, lastName, email}) => {
        console.log(email)
        fetch('https://hooks.zapier.com/hooks/catch/5584995/opjk997', {
          method: 'POST',
          body: JSON.stringify({ firstName, lastName, email, url: tab.url, name: document.getElementById("video").value })
        }).then(function() {
          hideSummaryDiv();
          showDoneDiv();
        })
      });
      /**
       *       .then(r => r.text()).then(result => {
        // Result now contains the response text, do what you want...
        console.log(result)
        
        d = document;

        var f = d.createElement('div');
        f.innerHTML = result
        d.body.appendChild(f);
      });
       */

    })

  }, false);
}, false);

function hideSetupDiv() {
  var setupDiv = document.getElementById('setup-div');
  setupDiv.style.display = "none";
}

function showSummaryDiv() {
  var summarizeDiv = document.getElementById('summarize-div');
  summarizeDiv.style.display = "block";
}


function hideSummaryDiv() {
  var summarizeDiv = document.getElementById('summarize-div');
  summarizeDiv.style.display = "none";
}

function showDoneDiv() {
  var summarizeDiv = document.getElementById('done-div');
  summarizeDiv.style.display = "block";
}


