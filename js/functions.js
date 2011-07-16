/**
 * Short form for getting elements by id.
 * @param {string} id The id.
 */
function $(id) {
  return document.getElementById(id);
}

/**
 * Asynchronously load the file to the current DOM.
 *
 * @parm {HTMLElement} parent The DOM to append to.
 * @parma {string} file The file to inject.
 */
function loadScript(parent, file) {
  console.log('Loading Lab script: ' + file);
  var script = document.createElement('script');
  script.src = chrome.extension.getURL(file);
  parent.appendChild(script);
}
