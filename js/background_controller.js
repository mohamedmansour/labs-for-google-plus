/**
 * Manages a single instance of the entire application.
 * @constructor
 */
BackgroundController = function()
{
  this.onExtensionLoaded();
};

/**
 * Triggered when the extension just loaded. Should be the first thing
 * that happens when chrome loads the extension.
 */
BackgroundController.prototype.onExtensionLoaded = function()
{
  var currVersion = chrome.app.getDetails().version;
  var prevVersion = settings.version;
  if (currVersion != prevVersion) {
    // Check if we just installed this extension.
    if (typeof prevVersion == 'undefined') {
      this.onInstall();
    } else {
      this.onUpdate(prevVersion, currVersion);
    }
    settings.version = currVersion;
  }
};

/**
 * Triggered when the extension just installed.
 */
BackgroundController.prototype.onInstall = function()
{
  var self = this;
  // Inject the content script to all opened window.
  chrome.windows.getAll({ populate: true }, function(windows) {
    for (var w = 0; w < windows.length; w++) {
      var tabs = windows[w].tabs;
      for (var t = 0; t < tabs.length; t++) {
        var tab = tabs[t];
        if (self.isValidURL(tab.url)) {
          chrome.tabs.executeScript(tab.id, { file: '/js/functions.js', allFrames: true }, function() {
            chrome.tabs.executeScript(tab.id, { file: '/js/labs_enum.js', allFrames: true }, function() {
              chrome.tabs.executeScript(tab.id, { file: '/js/injection.js', allFrames: true });
            });
          });
        }
      }
    }
  });
};

/**
 * Check if the URL is a valid URL that we support for injection and processing.
 *
 * @param {string} url The URL to check.
 */
BackgroundController.prototype.isValidURL = function(url)
{
  return (url.indexOf('https://plus.google.com') == 0 ||
      url.indexOf('http://plus.google.com') == 0 ||
      url.indexOf('https://talkgadget.google.com') == 0 ||
      url.indexOf('http://talkgadget.google.com') == 0)
};

/**
 * Triggered when the extension just uploaded to a new version. DB Migrations
 * notifications, etc should go here.
 *
 * @param {string} previous The previous version.
 * @param {string} current  The new version updating to.
 */
BackgroundController.prototype.onUpdate = function(previous, current)
{
};

/**
 * Initialize the main Background Controller
 */
BackgroundController.prototype.init = function()
{
  chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
  chrome.extension.onRequest.addListener(this.onExtensionRequest.bind(this));
};

/**
 * Listen for extension requests.
 *
 * @param {Object} request The request sent by the calling script.
 * @param {Object<MessageSender>} sender The location where the script has spawned.
 * @param {Function} request Function to call when you have a response. The 
                              argument should be any JSON-ifiable object, or
                              undefined if there is no response.
 */
BackgroundController.prototype.onExtensionRequest = function(request, sender, sendResponse) {
  if (sender.tab && request.method == 'GetModules') {
    console.log('Content Script requesting data for modules');
    sendResponse({data: settings.modules});
  }
  else {
    sendResponse({}); // snub
  }
};

/**
 * Listens on new tab updates. Google+ uses new sophisticated HTML5 history
 * push API, so content scripts don't get recognized always. We inject
 * the content script once, and listen for URL changes.
 *
 * @param {number} tabId Tab identifier that changed.
 * @param {object} changeInfo lists the changes of the states.
 * @param {object<Tab>} tab The state of the tab that was updated.
 */
BackgroundController.prototype.onTabUpdated = function(tabId, changeInfo, tab)
{
  if (changeInfo.status == 'complete' && this.isValidURL(tab.url)) {
    chrome.tabs.sendRequest(tabId, { method: 'render' });
  }
};