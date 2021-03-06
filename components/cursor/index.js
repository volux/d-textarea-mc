/**
 *
 * @type {DTextareaCursor}
 */
module.exports = DTextareaCursor;

/**
 * Must be empty - DerbyJS rule
 * @class DTextareaCursor
 * @constructor
 */
function DTextareaCursor() {
}

DTextareaCursor.prototype.view = __dirname;
DTextareaCursor.prototype.name = 'd-textarea-cursor';

DTextareaCursor.prototype.init = function () {

  this.model.setNull('isTop', false);
  this.model.setNull('isLeft', true);
  this.model.setNull('isRight', false);

  this.model.on('change', 'positions**', this.changeOrientation.bind(this));
  this.model.on('change', 'scroll**', this.onScroll.bind(this));
};

DTextareaCursor.prototype.onScroll = function () {

  this.changeOrientation('', this.model.get('positions'));
};
/**
 * QuillJS method
 */
DTextareaCursor.prototype.changeOrientation = function (path, positions) {

  if (!positions) return;
  if (!positions.length) return;

  var top = parseInt(positions[0].top) - parseInt(this.model.get('scroll.y')) || 0;
  var left = parseInt(positions[0].left) - parseInt(this.model.get('scroll.x')) || 0;
  var textarea = this.parent.parent.getTextArea();

  this.model.set('isTop', top <= this['$flag'].offsetHeight);
  this.model.set('isLeft', top <= this['$flag'].offsetHeight);
  this.model.set('isRight', textarea.offsetWidth - left <= this['$flag'].offsetWidth);
};