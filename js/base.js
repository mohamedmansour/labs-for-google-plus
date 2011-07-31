/**
 * Base class that everyone shares.
 *
 * @author Mohamed Mansour 2011 (http://mohamedmansour.com)
 */
 
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

/**
 * Base namespace for the Labs Library.
 *
 * @const
 */
var labs = labs || {};
labs.injection = labs.injection || {};

/**
 * Inherit the prototype methods from one constructor into another.
 * Borrowed from Closure Library.
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
labs.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};