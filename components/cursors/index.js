/**
 *
 * @type {getDomElementClientRectangles|*}
 */
var getDomElementClientRectangles = require('dom-element-client-rectangles');

/**
 *
 * @type {DTextareaCursors}
 */
module.exports = DTextareaCursors;

/**
 * Must be empty - DerbyJS rule
 * @class DTextareaCursors
 * @constructor
 */
function DTextareaCursors() {
}

DTextareaCursors.prototype.view = __dirname;
DTextareaCursors.prototype.name = 'd-textarea-cursors';

DTextareaCursors.prototype.init = function () {

  this.model.start('cursorsIds', 'data', function(items){
    if (!items) return [];
    return Object.keys(items);
  });
};

DTextareaCursors.prototype.create = function () {

  this.repositionCursors();
  this.model.on('change', 'data**', this.repositionCursors.bind(this));
};

/**
 * Modified version of https://github.com/component/textarea-caret-position/blob/master/index.js
 * @param wrapper {Element}
 * @param textarea {Element|Node|{value: String}}
 * @param mirror {Element}
 * @param cursor {{start: number, end: number}}
 * @returns {{top: number, left: number, height: number, width: number}[]}
 */
DTextareaCursors.prototype.getCursorPositions = function (wrapper, textarea, mirror, cursor) {

  if (!mirror) return; // not load yet?

// The properties that we copy into a mirrored div.
// Note that some browsers, such as Firefox,
// do not concatenate properties, i.e. padding-top, bottom etc. -> padding,
// so we have to do every single property specifically.
  var properties = [
    'boxSizing',
    'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    'height',
    'overflowX',
    'overflowY',  // copy the scrollbar for IE

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',  // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing'
  ];

  var isFirefox = !(window['mozInnerScreenX'] == null);

  var style = mirror.style;
  /**
   * Window.prototype.getComputedStyle
   * @type {CSSStyleDeclaration}
   */
  var computed = getComputedStyle(textarea);

  // default textarea styles
  //style.whiteSpace = 'pre-wrap'; // in styles
  // only for textarea-s
  //style.wordWrap = 'break-word'; // in styles

  // position off-screen
  //style.position = 'absolute';  // required to return coordinates properly // in styles
  style.top = textarea.offsetTop + parseInt(computed.borderTopWidth) + 'px';
  //style.left = '0px'; // in styles
  // not 'display: none' because we want rendering
  //style.visibility = 'hidden'; // in styles

  // transfer the element's properties to the div
  properties.forEach(function (prop) {
    style[prop] = computed[prop];
  });

  if (isFirefox) {
    // Firefox adds 2 pixels to the padding - https://bugzilla.mozilla.org/show_bug.cgi?id=753662
    style.width = parseInt(computed.width) - 2 + 'px';
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (textarea.scrollHeight > parseInt(computed.height)) {

      style.overflowY = 'scroll';
    }

  } else {
    // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
    style.overflow = 'hidden';
  }

  var headText = textarea.value.substring(0, cursor.start);

  if (headText) {

    mirror.appendChild(document.createTextNode(headText));
  }
  /**
   *
   * @type {Element}
   */
  var precursor = document.createElement('span');

  precursor.appendChild(document.createTextNode(textarea.value.substring(cursor.start, cursor.end) || '\u200b'));
  mirror.appendChild(precursor);

  // Does this help us? I'll leave it here for now
  var tailText = textarea.value.substring(cursor.end);

  if (tailText) {

    mirror.appendChild(document.createTextNode(tailText));
  }

  var positions = getDomElementClientRectangles(precursor, wrapper);

  positions.forEach(function (item) {

    item.top = item.top + parseInt(computed['borderTopWidth']);
    item.left = item.left + parseInt(computed['borderLeftWidth']);
  });

  mirror.textContent = '';

  return positions;
};

/**
 *
 * @returns {string}
 */
DTextareaCursors.prototype.getUserId = function () {

  return this.model.get('userId');
};

/**
 * TODO Why not used value???
 * @param [cursorId] {string}
 * @param [value]
 * @param [previous]
 * @param [passed] {{}}
 */
DTextareaCursors.prototype.repositionCursors = function (cursorId, value, previous, passed) {

  var self = this;
  var cursorsData = self.model.at('data');
  var wrapper = self.parent.getWrapper();
  /**
   *
   * @type {Element|Node|{value: String}}
   */
  var textarea = self.parent.getTextArea();
  var mirror = self.parent.getMirror();
  var localUserId = self.getUserId();
  var reposition = function (cursorId) {

    /**
     * @type {{userId: String, selected: {path: String, start: Number, end: Number}[]}}
     */
    var cursor = cursorsData.get(cursorId);

    if (!cursor) return;
    if (cursor.userId === localUserId) return;

    setTimeout(function () {
      self.model.set('positions.' + cursorId, self.getCursorPositions(wrapper, textarea, mirror, cursor.selected));
    }, 0)
  };

  if (passed && passed['$remote']) {

    reposition(cursorId);
    return;
  }
  if (!cursorId) {

    this.model.get('cursorsIds').forEach(reposition);
  }

};

