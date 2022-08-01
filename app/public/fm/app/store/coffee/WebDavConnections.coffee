Ext.define 'FM.store.WebDavConnections',
  extend: 'Ext.data.Store'
  storeId: 'WebDavConnections'
  sortOnLoad: true
  model: 'FM.model.WebDavConnection'
  sorters: [
    property: "id"
    direction: "ASC"
  ]