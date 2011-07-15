// Extensions pages can all have access to the background page.
var bkg = chrome.extension.getBackgroundPage();

// When the DOM is loaded, make sure all the saved info is restored.
window.addEventListener('load', onLoad, false);

var dialog = null;

/**
 * When the options window has been loaded.
 */
function onLoad() {
  onRestore();
  $('button-save').addEventListener('click', onSave, false);
  $('button-close').addEventListener('click', onClose, false);
}

/**
 *  When the options window is closed;
 */
function onClose() {
  window.close();
}

/**
 * Saves options to localStorage.
 */
function onSave() {
  // Save settings.
  bkg.settings.opt_out = $('opt_out').checked;

  var modules = [];
  var moduleNodes = document.querySelectorAll("input[name='modules']");
  for (var node in moduleNodes) {
    var module = moduleNodes[node];
    if (module.checked) {
      modules.push(module.id);
    }
  }
  bkg.settings.modules = modules;

  // Update status to let user know options were saved.
  var info = $('info-message');
  info.style.display = 'inline';
  info.style.opacity = 1;
  setTimeout(function() {
    info.style.opacity = 0.0;
  }, 1000);
}

/**
* Restore all options.
*/
function onRestore() {
  // Restore settings.
  $('version').innerHTML = ' (v' + bkg.settings.version + ')';
  $('opt_out').checked = bkg.settings.opt_out;

  var container_modules = $('container-modules');
  for (var lab in LabsEnum) {
    if (LabsEnum.hasOwnProperty(lab)) {
      container_modules.appendChild(createLabItem(lab));
    }
  }

  if (bkg.settings.modules) {
    var modules = bkg.settings.modules;
    for (var lab in modules) {
      var moduleDOM =  $(modules[lab]);
      if (moduleDOM) {
        moduleDOM.checked = true;
      }
    }
  }
}

function createLabItem(labItem) {
  //var container = document.createElement('p');
  var item = labItem.toLowerCase();

  // Render label.
  var label = document.createElement('label');
  label.setAttribute('for', item);

  // Text formatted into Camel Case
  var item_formatted = item.split('_').map(function(v){
    return v.slice(0,1).toUpperCase() + v.slice(1);
  }).join(' ');

  label.appendChild(document.createTextNode(item_formatted));

  // Render input.
  var input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('name', 'modules');
  input.setAttribute('id', item);
  label.appendChild(input);

  return label;
}
