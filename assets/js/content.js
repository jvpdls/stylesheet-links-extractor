/**
 * Retrieves all stylesheet links from the current document.
 * @returns {string[]} An array of stylesheet URLs.
 */
function getAllStyleSheetLinks() {
  let stylesheets = [];
  let links = document.getElementsByTagName("link");
  for (let i = 0; i < links.length; i++) {
    if (links[i].rel.toLowerCase() === "stylesheet" && links[i].href) {
      stylesheets.push(links[i].href);
    }
  }
  return stylesheets;
}

/**
 * Adds the domain to relative links.
 * @param {string[]} stylesheets - An array of stylesheet URLs.
 * @returns {string[]} An array of stylesheet URLs.
 */
function addDomainToRelativeLinks(stylesheets) {
  let domain = window.location.origin;
  for (let i = 0; i < stylesheets.length; i++) {
    if (
      stylesheets[i].indexOf("http") !== 0 ||
      stylesheets[i].indexOf("https") !== 0
    ) {
      stylesheets[i] = domain + stylesheets[i];
    } else if (stylesheets[i].indexOf("./") === 0) {
      stylesheets[i] = domain + stylesheets[i].substring(2);
    } else if (stylesheets[i].indexOf("../") === 0) {
      stylesheets[i] = domain + stylesheets[i].substring(3);
    } else if (stylesheets[i].indexOf("//") === 0) {
      stylesheets[i] = domain + stylesheets[i].substring(2);
    }
  }

  return stylesheets;
}

/**
 * Extracts the content from the current document.
 * @returns {string[]} An array of stylesheet URLs.
 */
function extractContent() {
  let stylesheets = getAllStyleSheetLinks();
  fullStylesheetsURLs = addDomainToRelativeLinks(stylesheets);
  return fullStylesheetsURLs;
}

/**
 * Listens for messages from the popup.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "extract") {
    sendResponse({ content: extractContent() });
  }
});
