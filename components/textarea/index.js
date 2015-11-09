/**
 *
 * @type {DTextarea}
 */
module.exports = DTextarea;

/**
 * Must be empty - DerbyJS rule
 * @class DTextarea
 * @constructor
 */
function DTextarea() {
}

DTextarea.prototype.view = __dirname;
DTextarea.prototype.name = 'd-textarea';

DTextarea.prototype.init = function () {

  this.model.setNull('scroll', 0);
  this.inFocus(false);

  this.on('destroy', this.clearLocalCursor); // not works with close window
};

DTextarea.prototype.create = function () {

  this.listenDomEvents(this.domEvents);

};

/**
 *
 * @param scroll {number}
 */
DTextarea.prototype.setScroll = function (scroll) {

  this.model.set('scroll', scroll);
};


/**
 *
 * @returns {Element|Node}
 */
DTextarea.prototype.getWrapper = function () {

  return this['$wrapper'];
};

/**
 *
 * @returns {Element|Node}
 */
DTextarea.prototype.getTextArea = function () {

  return this['$textarea'];
};

/**
 *
 * @returns {Element|Node}
 */
DTextarea.prototype.getMirror = function () {

  return this['$mirror'];
};

/**
 *
 * @returns {string}
 */
DTextarea.prototype.getUserId = function () {

  return this.model.get('userId') || this.model.root.get('_session.userId')
};

/**
 *
 * @param selected {{start: Number, end: Number}}
 * @returns {DTextarea}
 */
DTextarea.prototype.setLocalCursor = function (selected) {

  var userId = this.getUserId();
  var cursor = {
    userId: userId,
    selected: selected
  };
  this.model.set('cursors.' + userId, cursor);

  return this;
};

/**
 *
 */
DTextarea.prototype.clearLocalCursor = function () {

  this.model.del('cursors.' + this.getUserId());
};

/**
 *
 * @param textarea
 * @returns {{start: Number, end: Number}}
 */
DTextarea.prototype.getSelection = function(textarea) {

  if (textarea.createTextRange) {

    var range = document.selection.createRange().duplicate();

    range.moveStart('character', -textarea.value.length);

    var end = textarea.value.length;

    range.moveEnd('character', end);

    var start = 0;

    if (range.text == '') {

      start = textarea.value.length;

    } else {

      start = textarea.value.lastIndexOf(range.text);
    }

    return {
      start: start,
      end: end
    };
  }
  return {
    start: textarea.selectionStart,
    end: textarea.selectionEnd
  };
};

/**
 * throttle ???
 * @param event {Event|*}
 */
DTextarea.prototype.setPosition = function (event) {

  var textarea = this.getTextArea();

  if (event.target !== textarea) return;

  this.setLocalCursor(this.getSelection(textarea));
};

/**
 *
 * @param state {boolean}
 * @returns {DTextarea}
 */
DTextarea.prototype.inFocus = function (state) {

  this.model.set('focus', state);

  return this;
};

/**
 *
 * @param domEvents {Object}
 * @returns {DTextarea}
 */
DTextarea.prototype.listenDomEvents = function (domEvents) {

  var node = this.getTextArea();

  for (var event in domEvents) if (domEvents.hasOwnProperty(event)) {

    this.dom.on(event, node, domEvents[event].bind(this), false);
  }
  return this;
};

DTextarea.prototype.domEvents = {

  'focusin': function () {

    this.inFocus(true);
  },

  'focusout': function () {

    this.inFocus(false);

    this.clearLocalCursor();
  },

  'keydown': function (event) {

    this.setPosition(event);
  },

  'keyup': function (event) {

    this.setPosition(event);
  },

  'mousedown': function (event) {

    this.setPosition(event);
  },

  'mouseup': function (event) {

    this.setPosition(event);
  },

  'touchstart': function (event) {

    this.setPosition(event);
  },

  'touchend': function (event) {

    this.setPosition(event);
  },

  'scroll': function (event) {

    this.setScroll(event.target.scrollTop);
  }
};
