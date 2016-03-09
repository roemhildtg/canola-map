/* jshint esnext: true */

import Map from 'can/map/';
import List from 'can/list/';
import Component from 'can/component/';
//import './widget.css!';
import template from './template.stache!';
import {
  FlaskConnectFactory
} from 'models/FlaskModelFactory';

import 'components/list-table/';
import 'components/property-table/';
import 'components/form-widget/';
import 'components/filter-widget/';
import 'components/paginate-widget/';

export let viewModel = Map.extend({
  define: {
    connection: {
      value: null
    },
    editable: {
      type: 'boolean',
      value: false
    },
    parameters: {
      Value: Map
    },
    page: {
      value: 'all'
    },
    promise: {
      get: function(prev, setAttr) {
        return this.attr('connection.connection').getList(this.attr('parameters').attr());
      }
    },
    buttons: {
      type: '*',
      value: [{
        iconClass: 'fa fa-pencil',
        eventName: 'edit',
        title: 'Edit Row'
      }, {
        iconClass: 'fa fa-trash',
        eventName: 'delete'
      }, {
        iconClass: 'fa fa-list-ul',
        eventName: 'view'
      }]
    },
    editFields: {
      value: null
    },
    tableFields: {
      value: null
    },
    detailFields: {
      value: null
    },
    queryFilters: {
      Value: List
    },
    queryPage: {
      type: 'number',
      value: 1
    },
    formObject: {
      value: null
    }
  },
  updateFilterParam: function() {
    var filters = this.attr('queryFilters');
    if (filters.length) {
      this.removeAttr('parameters.page');
      this.attr('parameters.filter[objects]', JSON.stringify(filters.attr()));
    } else {
      this.removeAttr('parameters.filter[objects]');
    }
    return filters;
  },
  updatePageParam: function() {
    this.attr('parameters.page', this.attr('queryPage') - 1);
  },
  editObject: function(scope, dom, event, obj) {
    this.attr('viewId', this.attr('connection.connection').id(obj));
    this.attr('page', 'edit');
  },
  viewObject: function(scope, dom, event, obj) {
    this.attr('viewId', this.attr('connection.connection').id(obj));
    this.attr('page', 'details');
  },
  resetPage: function() {
    this.attr('viewId', null);
    this.attr('page', 'all');
  },
  createObject: function() {
    var newObject = this.attr('connection.map')();
    this.attr('formObject', newObject);
    this.attr('page', 'edit');
  },
  deleteObject: function(scope, dom, event, obj, skipConfirm) {
    if (obj && (skipConfirm || confirm('Are you sure you want to delete this record?'))) {
      obj.destroy();
    }
  },
  deleteMultiple: function() {
    var self = this;
    if (confirm('Are you sure you want to delete the selected records?')) {
      this.attr('selectedObjects').forEach(function(obj) {
        self.deleteObject(null, null, null, obj, true);
      });
      this.attr('selectedObjects').replace([]);
    }
  }
});

Component.extend({
  tag: 'crud-manager',
  viewModel: viewModel,
  template: template,
  events: {
    '{viewModel.queryFilters} change': function() {
      this.viewModel.updateFilterParam();
    },
    '{viewModel.queryPage} change': function() {
      this.viewModel.updatePageParam();
    }
  }
});
