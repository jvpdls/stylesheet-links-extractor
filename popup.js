/**
 * Prints the URLs in the given array to a article element.
 *
 * @param {string[]} urls - An array of URLs to be printed.
 * @returns {void}
 */
function printURLs(urls) {
  return new Promise((resolve) => {
    let responseContainer = document.getElementById("response-container");

    let table = document.createElement("table");
    table.id = "response";

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    let headerCell1 = document.createElement("th");
    headerCell1.textContent = "Stylesheet Links";
    headerRow.appendChild(headerCell1);
    let headerCell2 = document.createElement("th");
    headerCell2.textContent = "File Size (bytes)";
    headerRow.appendChild(headerCell2);
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
      Promise.all(urls.map(getStylesheetSize)).then((sizes) => {
        urls.forEach((url, index) => {
          let size = sizes[index];
          let row = document.createElement("tr");
          let cell = document.createElement("td");
          let link = document.createElement("a");
          link.href = url;
          link.target = "_blank";
          link.textContent = url;
          cell.appendChild(link);
          row.appendChild(cell);
          let sizeCell = document.createElement("td");
          sizeCell.textContent = size;
          row.appendChild(sizeCell);
          tbody.appendChild(row);
        });
      });
    }

    table.appendChild(tbody);

    if (responseContainer.children.length > 0) {
      responseContainer.removeChild(responseContainer.children[0]);
    }
    responseContainer.classList.remove("is-hidden");
    responseContainer.appendChild(table);
    resolve();
  });
}

/**
 * Gets the size of an stylesheet.
 *
 * @param {string} url - The URL to be analyzed.
 * @returns {Promise<string>}
 */
function getStylesheetSize(url) {
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.headers.get("content-length");
      } else {
        return "N/A";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * Adds a button to the popup that allows the user to download the URLs as a CSV file.
 *
 * @returns {void}
 */
function addDownloadButton() {
  let downloadButton = document.createElement("button");
  downloadButton.type = "button";
  downloadButton.textContent = "Download as CSV";
  downloadButton.addEventListener("click", function () {
    downloadTableAsCSV("response");
  });
  document.getElementById("response-container").appendChild(downloadButton);
}

/**
 * Downloads the given table as a CSV file.
 *
 * @param {string} tableId
 * @param {*} separator
 */
function downloadTableAsCSV(tableId, separator = ",") {
  var rows = document.querySelectorAll("table#" + tableId + " tr");
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");
    for (var j = 0; j < cols.length; j++) {
      var data = cols[j].innerText
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/(\s\s)/gm, " ");
      data = data.replace(/"/g, '""');
      row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
  }
  var csvString = csv.join("\n");
  var filename =
    "export_" + tableId + "_" + new Date().toLocaleDateString() + ".csv";
  var link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("target", "_blank");
  link.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(csvString)
  );
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
          printURLs(response.content).then(() => {
            if (response.content.length > 0) {
              addDownloadButton();
            }
          });
        }
      );
    });
  });
});
