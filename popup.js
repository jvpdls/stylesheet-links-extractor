/**
 * Prints the URLs in the given array to a article element.
 *
 * @param {string[]} urls - An array of URLs to be printed.
 * @returns {void}
 */
function printURLs(urls) {
  let responseContainer = document.getElementById("response-container");

  let table = document.createElement("table");

  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  let headerCell = document.createElement("th");
  headerCell.textContent = "Stylesheet Links";
  headerRow.appendChild(headerCell);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  let tbody = document.createElement("tbody");

  if (urls.length === 0) {
    let row = document.createElement("tr");
    let cell = document.createElement("td");
    cell.textContent = "No stylesheet URLs were found.";
    row.appendChild(cell);
    tbody.appendChild(row);
  } else {
    urls.forEach((url) => {
      let row = document.createElement("tr");
      let cell = document.createElement("td");
      let link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.textContent = url;
      cell.appendChild(link);
      row.appendChild(cell);
      tbody.appendChild(row);
    });
  }

  table.appendChild(tbody);

  if (responseContainer.children.length > 0) {
    responseContainer.removeChild(responseContainer.children[0]);
  }
  responseContainer.classList.remove("is-hidden");
  responseContainer.appendChild(table);
}

/*
 * When the popup is opened, send a message to the content script to extract
 * the URLs of the stylesheets. When the content script responds, print the
 * URLs to the popup.
 */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("extractBtn").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "extract" },
        function (response) {
          printURLs(response.content);
        }
      );
    });
  });
});
