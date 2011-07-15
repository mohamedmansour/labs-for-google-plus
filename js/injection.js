/**
 *
 */
Injection = function()
{
  this.STREAM_CONTAINER_CLASS = '.a-b-f-i-oa';
  this.TRAVERSED_CLASS = 'lfgp-crx';
};

/**
 * Initilaization routine for loading all the content script modules.
 */
Injection.prototype.init = function()
{
  chrome.extension.sendRequest({method: 'GetModules'}, this.onModulesReceived.bind(this));
};

/**
 * The JSON response object sent by the handler of the request.
 *
 * @param {Object} response  The response object that contains the list of modules.
 */
Injection.prototype.onModulesReceived = function(response)
{
  // Preload the content script module only since it is activated.
  var modules = response.data;

  // TODO(mohamed): Define a Plugins Manifest page so we can define what injection
  //                points exist.
  for (var m in modules) {
    var module = modules[m];
    var lab = LabsEnum[module.toUpperCase()];
    if (lab.content_script) {
      var oHead = document.getElementsByTagName("head")[0] || document.documentElement;
      loadScript(oHead, '/js/' + module + '/content_script.js');
    }
  }
  console.log(modules);

  // Listen on new external extension requests coming from the extension process.
  chrome.extension.onRequest.addListener(this.onExtensionRequest.bind(this));

  // Listen when the subtree is modified for new posts.
  var googlePlusContentPane = document.querySelector(this.STREAM_CONTAINER_CLASS);
  if (googlePlusContentPane) {
     googlePlusContentPane.addEventListener('DOMSubtreeModified',
                                            this.onNewPost.bind(this), false);
  }
};

/**
 * Google Plus has an HTML5 push API. This somehow doesn't play well with
 * DOMSubtreeModified so something like this will fix issues where the posts
 * do not get updated when we visit another tab.
 *
 * @param {Object} request The request sent by the calling script.
 * @param {Object<MessageSender>} sender The location where the script has spawned.
 * @param {Function} request Function to call when you have a response. The
                              argument should be any JSON-ifiable object, or
                              undefined if there is no response.
 */
Injection.prototype.onExtensionRequest = function(request, sender, sendResponse) {
  if (request.method == 'render') {
    this.renderAll();
  }
  sendResponse({});
};

/**
 * Render all the items in the current page.
 */
Injection.prototype.renderAll = function()
{
  var actionBars = document.querySelectorAll(this.STREAM_CONTAINER_CLASS);
  for (var i = 0; i < actionBars.length; i++) {
    this.renderItem(actionBars[i]);
  }
};

/**
 * Render the "Share on ..." Link on each post.
 *
 * @param {Object<ModifiedDOM>} itemDOM modified event.
 */
Injection.prototype.renderItem = function(itemDOM)
{
  if (itemDOM && !itemDOM.classList.contains(this.TRAVERSED_CLASS)) {
    //console.log('New Item Received!', itemDOM);
    itemDOM.classList.add(this.TRAVERSED_CLASS);
  }
};

/**
 * Listen on new posts coming into Google Plus
 *
 * @param {Object<MutationEvent>} e modified event.
 */
Injection.prototype.onNewPost = function(e) {
	if (e.target.id) {
		if (e.target.id.indexOf('update') == 0) {
			this.renderItem(e.target);
		}
	} // if got e.target.id at all
};


// Main Content Script injection
var injection = new Injection();
injection.init();
