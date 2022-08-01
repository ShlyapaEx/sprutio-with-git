// Generated by CoffeeScript 1.11.1
Ext.define('FM.view.grids.FileSearchList', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.file-search-list',
  cls: 'fm-file-search-list',
  columns: [],
  stateful: true,
  multiSelect: false,
  viewConfig: {
    stripeRows: false,
    deferEmptyText: false,
    emptyText: t('No results found')
  },
  requires: ['FM.model.File'],
  defaults: {
    flex: 1
  },
  height: 150,
  initComponent: function() {
    FM.Logger.log('FM.view.grids.FileSearchList init');
    this.callParent(arguments);
    this.initEventsHandlers();
    this.initGridConfig();
    if (this.ownerCt != null) {
      return this.ownerCt.fileListStore = this.store;
    }
  },
  initEventsHandlers: function() {
    this.handlers = {
      gridview: {
        itemdblclick: function(view, record) {
          return FM.Actions.Open.execute(FM.Active, record.get('path'));
        }
      }
    };
    return FM.Logger.log('FileList initEventsHandlers() called', this.handlers);
  },
  initGridConfig: function() {
    var gridView;
    this.setConfig({
      columns: [
        {
          header: t("Name"),
          dataIndex: "name",
          hideable: false,
          draggable: false,
          flex: true,
          renderer: function(value, metaData, record) {
            var ext, is_dir, is_link, is_share;
            is_dir = record.get("is_dir");
            is_link = record.get("is_link");
            is_share = record.get("is_share");
            ext = '';
            if (is_dir) {
              ext = "_dir";
            } else {
              ext = record.get("ext").toLowerCase();
            }
            if (is_link) {
              ext = "_link";
            }
            if (is_share) {
              ext = "_share";
            }
            metaData.style = "background-image: url(/fm/resources/images/sprites/icons_16.png)";
            metaData.tdCls = ext !== '' ? "cell-icon icon-16-" + ext : "cell-icon icon-16-_blank";
            return value;
          }
        }, {
          header: t("Size"),
          dataIndex: "size",
          width: 55,
          renderer: function(value, metaData, record) {
            if (record.get("is_dir") && !record.get('loaded')) {
              return "[DIR]";
            }
            if (record.get("is_link")) {
              return "[LINK]";
            }
            return Ext.util.Format.fileSize(value);
          }
        }, {
          header: t("Path"),
          dataIndex: "path",
          hidden: false,
          flex: true,
          renderer: function(value, metaData, record) {
            metaData.style = "background-image: url(/fm/resources/images/sprites/icons_16.png)";
            metaData.tdCls = "cell-icon icon-16-_dir";
            return value;
          }
        }
      ]
    });
    gridView = this.getView();
    return gridView.on({
      itemdblclick: this.handlers.gridview.itemdblclick
    });
  },
  setFileList: function(listing) {
    var columns, store;
    FM.Logger.log("setFileList in FileSearchList called ", listing);
    store = Ext.create("Ext.data.Store", {
      sortOnLoad: false,
      model: 'FM.model.File'
    });
    this.ownerCt.updateSearchFilterState(listing.length < 1);
    this.setStore(store);
    this.store.loadData(listing);
    if (this.ownerCt != null) {
      this.ownerCt.fileListStore = this.store;
    }
    columns = Ext.ComponentQuery.query('gridcolumn[dataIndex=name]', this);
    return columns[0].sort("ASC");
  }
});