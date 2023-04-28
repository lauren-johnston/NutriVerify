document.addEventListener("DOMContentLoaded", () => {
    const scrapeBtn = document.getElementById("scrape-btn");
    const statusElement = document.getElementById("status");
  
    function displaySuccess() {
      statusElement.innerText = "Success!";
      statusElement.style.color = "black";
    }
  
    function displayError() {
      statusElement.innerText = "Error!";
      statusElement.style.color = "red";
    }

    function displayLoading() {
        statusElement.innerHTML = "<div class='loading'></div>";
      }
      
      function displayResults(data) {
        let totalClaims = 0;
        let supportedClaims = 0;
        
        data.active_ingredients.forEach(result => {
          totalClaims += result.claims.length;
          supportedClaims += result.claims.filter(
            (claim) => claim.correctness === "Found potential supporting evidence"
          ).length;
        });
      
        const supportedPercentage = ((supportedClaims / totalClaims) * 100).toFixed(2);
      
        document.getElementById("claims-supported").innerText = supportedPercentage;
        document.getElementById("results").style.display = "block";
      }
      
      function displayReport(data) {
        const reportTableBody = document.getElementById("report-table-body");
        reportTableBody.innerHTML = "";
        data.active_ingredients.forEach((result) => {
            result.claims.forEach((claim) => {
                const row = document.createElement("tr");
      
                const ingredientCell = document.createElement("td");
                ingredientCell.textContent = result.ingredient;
                row.appendChild(ingredientCell);
      
                const claimCell = document.createElement("td");
                claimCell.textContent = claim.claim;
                row.appendChild(claimCell);
            
                const correctnessCell = document.createElement("td");
                correctnessCell.textContent = claim.correctness;
                row.appendChild(correctnessCell);
            
                const supportingEvidenceCell = document.createElement("td");
                supportingEvidenceCell.innerHTML = claim.supporting_evidence
                  .map(
                    (evidence) =>
                      `<a href="${evidence.url}" target="_blank">${evidence.source}</a>`
                  )
                  .join(", ");
                row.appendChild(supportingEvidenceCell);
            
                const conflictingEvidenceCell = document.createElement("td");
                conflictingEvidenceCell.innerHTML = claim.conflicting_evidence
                  .map(
                    (evidence) =>
                      `<a href="${evidence.url}" target="_blank">${evidence.source}</a>`
                  )
                  .join(", ");
                row.appendChild(conflictingEvidenceCell);
            
                reportTableBody.appendChild(row);
              });            
        })
      
        document.getElementById("report").style.display = "block";
      }

    function handleResponse(response) {
        displayResults(response);
      
        document.getElementById("view-report").addEventListener("click", () => {
          displayReport(response);
        });
      }

    function createTimeoutSignal(timeout) {
        const controller = new AbortController();
        const signal = controller.signal;
        
        setTimeout(() => controller.abort(), timeout);
        return signal;
    }
  
    function sendToServer(textContent) {
        fetch("http://localhost:3000/process-webpage-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: textContent }),
          signal: createTimeoutSignal(7 * 60 * 1000), // 7 minutes
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
            handleResponse(data);
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
    
  document.getElementById("back").addEventListener("click", () => {
    document.getElementById("report").style.display = "none";
    document.getElementById("results").style.display = "block";
  });
  
});
});