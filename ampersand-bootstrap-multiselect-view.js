/*global window*/
var SelectView  = require('ampersand-select-view');
var $           = window.$; // || require('jquery'); //use $ if exists, else load dep.
// var MultiSelect = require('bootstrap-tagsinput');
// MultiSelect = MultiSelect; //ignore JSHint defined/!used

// Private Helpers:
function newObject() { return {}; }
function newFunction() { return function () {}; }

////////////////////////////////////////////////////////////////////////////////

module.exports = SelectView.extend({
  props: {
    multiple:             'any',
    bsMultiselectOptions: [ 'object', true, newObject   ],  // Options for bootstrap-multiselect plug-in setup
    preRenderBsPluginCb:  [ 'any',    true, newFunction ]   // Prerequisite functionality to run before plug-in initialization
  },
  initialize: function (spec) {
    $.extend(this, spec);
    SelectView.prototype.initialize.call(this, spec);
  },
  render: function () {
    var self = this;
    SelectView.prototype.render.call(this);
    this.preRenderBsPluginCb();
    $(this.select).multiselect(this.bsMultiselectOptions);
    if (this.select && [ true, 'multiple' ].indexOf(this.multiple) > -1) {
      this.select.setAttribute('multiple', 'multiple');
      if (this.selectAll) { $(this.select).multiselect('selectAll', false); }
      $(this.select).multiselect('rebuild');

      if (this.selectNone) {
        //Allow the 'ampersand-select-view' first option if none select code to run before deselecting all
        setTimeout(function () {
          $(self.select).multiselect('deselectAll', false)
          $(self.select).multiselect('rebuild');
        }, 0);
      }
    }
    return this;
  },
  updateSelectedOption: function () {
    SelectView.prototype.updateSelectedOption.call(this);
    $(this.select)
      .multiselect('destroy')
      .multiselect(this.bsMultiselectOptions);
  },
});
