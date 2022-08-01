// Generated by CoffeeScript 1.11.1
Ext.define('FM.view.panels.CenterPanel', {
  extend: 'Ext.panel.Panel',
  requires: ['FM.view.panels.FileListPanel'],
  alias: 'widget.center-panel',
  region: "center",
  id: "fm-panels",
  layout: {
    type: "hbox",
    align: "stretch"
  },
  defaults: {
    flex: 1
  },
  items: [
    {
      xtype: 'filelist-panel'
    }, {
      xtype: 'filelist-panel'
    }
  ],
  initComponent: function() {
    FM.Logger.log('FM.view.panels.CenterPanel init');
    return this.callParent(arguments);
  }
});
