Ext.define 'FM.view.toolbars.ViewerBottomToolbar',
  extend: 'Ext.toolbar.Toolbar'
  alias: 'widget.viewer-bottom-toolbar'
  cls: 'fm-viewer-bottom-toolbar'
  items: [
    { xtype: "tbtext", cls: "fm-viewer-mode" },
    "-",
    { xtype: "tbtext", cls: "fm-viewer-encoding" },
    "-",
    { xtype: "tbtext", cls: "fm-viewer-size" },
    "->",
    { xtype: "tbtext", cls: "fm-viewer-status", text: "READONLY" },
    "-",
    { xtype: "tbtext", cls: "fm-viewer-position", text: "1 : 0" }
  ]
  initComponent: () ->
    FM.Logger.log('FM.view.toolbars.ViewerBottomToolbar')
    @callParent(arguments)