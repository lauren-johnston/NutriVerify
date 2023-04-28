document.addEventListener("DOMContentLoaded", () => {
    const scrapeBtn = document.getElementById("scrape-btn");
    const statusElement = document.getElementById("status");
  
    function displaySuccess() {
      statusElement.innerText = "Success!";
      statusElement.style.color = "green";
    }
  
    function displayError() {
      statusElement.innerText = "Error!";
      statusElement.style.color = "red";
    }
  
    function sendToServer(textContent) {
      fetch("http://localhost:3000/process-webpage-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: textContent }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Server returned non-200 status code");
          }
        })
        .then((data) => {
          console.log("Server response:", data);
          displaySuccess();
        })
        .catch((error) => {
          console.error("Error:", error);
          displayError();
        });
    }
  
    scrapeBtn.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const [activeTab] = tabs;
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            func: () => {
              return document.body.innerText;
            },
          },
          (resultsArray) => {
            if (resultsArray && resultsArray.length > 0 && resultsArray[0].result) {
              const textContent = resultsArray[0].result;
              sendToServer(textContent);
            } else {
              console.log("No results found.");
            }
          }
        );
      });
    });
  });
  