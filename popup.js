/**
 * Prints the URLs in the given array to a article element.
 *
 * @param {string[]} urls - An array of URLs to be printed.
 * @returns {void}
 */
function printURLs(urls) {
  let responseContainer = document.getElementById("response-container");
  responseContainer.classList.add("mt-4");
  let message = document.createElement("article");
  message.classList.add("message");
  let messageHeader = document.createElement("div");
  messageHeader.classList.add("message-header");
  let messageHeaderParagraph = document.createElement("p");
  messageHeaderParagraph.textContent = "Extracted Stylesheet URLs";
  messageHeader.appendChild(messageHeaderParagraph);
  message.appendChild(messageHeader);
  let messageBody = document.createElement("div");
  messageBody.classList.add("message-body");

  // If no URLs were found, print a message
  if (urls.length === 0) {
    let noURLsParagraph = document.createElement("p");
    noURLsParagraph.textContent = "No stylesheet URLs were found.";
    messageBody.appendChild(noURLsParagraph);
  } else {
    // Print URLs line by line
    urls.forEach((url) => {
      let urlParagraph = document.createElement("p");
      urlParagraph.textContent = url;
      messageBody.appendChild(urlParagraph);
    });
  }

  // Remove the previous response if it exists
  if (responseContainer.children.length > 0) {
    responseContainer.removeChild(responseContainer.children[0]);
  }
  message.appendChild(messageBody);
  responseContainer.appendChild(message);
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
