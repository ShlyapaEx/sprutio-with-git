// Generated by CoffeeScript 1.11.1
Ext.define('FM.view.forms.SearchFileForm', {
  extend: 'Ext.form.Panel',
  alias: 'widget.search-file-form',
  cls: 'fm-search-file-form',
  items: [],
  bodyStyle: {
    background: 'none'
  },
  bodyPadding: '10 15 15 15',
  requires: ['Ext.ux.form.SearchField', 'Ext.form.field.Checkbox', 'Ext.form.Label'],
  initComponent: function() {
    var store;
    FM.Logger.log('FM.view.fieldsets.SearchTextForm init');
    this.items = [];
    this.items.push({
      xtype: 'textfield',
      name: 'search-file-name',
      cls: 'search-file-name',
      fieldLabel: t("File Name"),
      labelAlign: 'top',
      allowBlank: false,
      minLength: 1,
      maxLength: 255,
      enforceMaxLength: 255,
      regex: /^[a-zA-Z.0-9\-_\*а-яА-Я]{1,255}$/,
      regexText: t("Incorrect filename"),
      anchor: '100%'
    });
    this.items.push({
      xtype: 'textfield',
      name: 'search-file-path',
      cls: 'search-file-path',
      fieldLabel: t("Search Path"),
      labelAlign: 'top',
      allowBlank: false,
      minLength: 1,
      maxLength: 255,
      enforceMaxLength: 255,
      regex: /^[a-zA-Z.0-9\-_а-яА-Я\/]{1,255}$/,
      regexText: t("Incorrect path"),
      anchor: '100%'
    });
    this.items.push({
      xtype: 'form',
      layout: {
        type: 'hbox',
        padding: 1
      },
      bodyStyle: {
        background: 'none'
      },
      bodyPadding: '3 0 3 0',
      items: [
        {
          xtype: 'checkbox',
          checked: true,
          boxLabel: t("Files"),
          name: 'search-type-file',
          margin: '6 50 0 0',
          listeners: {
            change: (function(_this) {
              return function(field, newValue) {
                if (newValue) {
                  Ext.ComponentQuery.query("[name=search-file-size]", _this)[0].setDisabled(false);
                  Ext.ComponentQuery.query("[name=search-file-size-direction]", _this)[0].setDisabled(false);
                  return Ext.ComponentQuery.query("[name=search-file-size-label]", _this)[0].setDisabled(true);
                } else {
                  Ext.ComponentQuery.query("[name=search-file-size]", _this)[0].setDisabled(true);
                  Ext.ComponentQuery.query("[name=search-file-size-direction]", _this)[0].setDisabled(true);
                  return Ext.ComponentQuery.query("[name=search-file-size-label]", _this)[0].setDisabled(true);
                }
              };
            })(this)
          }
        }, {
          xtype: 'checkbox',
          checked: true,
          boxLabel: t("Directories"),
          name: 'search-type-dir',
          margin: '6 0 0 0'
        }, {
          xtype: 'combobox',
          name: 'search-file-size-direction',
          fieldLabel: t("File Size"),
          displayField: 'title',
          labelAlign: 'right',
          valueField: 'slug',
          queryMode: 'local',
          width: 230,
          hideLabel: false,
          labelWidth: 100,
          value: 'more',
          store: new Ext.data.Store({
            fields: ['title', 'slug'],
            id: "size-direction-store",
            data: [
              {
                title: t("More"),
                slug: 'more'
              }, {
                title: t("Lower"),
                slug: 'lower'
              }
            ],
            forceSelection: true
          })
        }, {
          xtype: 'textfield',
          name: 'search-file-size',
          cls: 'search-file-size',
          allowBlank: true,
          style: "margin-left: 5px;",
          width: 115,
          minLength: 0,
          hideLabel: false,
          maxLength: 16,
          enforceMaxLength: 16,
          maskRe: /[0-9]/,
          regex: /^[0-9]{0,16}$/,
          regexText: t("Incorrect size")
        }, {
          xtype: 'label',
          name: 'search-file-size-label',
          text: t("Mb"),
          padding: 7
        }
      ]
    });
    store = Ext.create("Ext.data.Store", {
      model: 'FM.model.File'
    });
    this.items.push({
      xtype: 'searchfield',
      fieldLabel: t("Filter"),
      labelAlign: 'top',
      name: 'search-file-filter',
      cls: 'search-file-filter',
      anchor: '100%',
      store: store,
      onClearClick: function() {
        var fileListStore;
        if (this.activeFilter) {
          this.setValue('');
          fileListStore = this.ownerCt.ownerCt.fileListStore;
          fileListStore.getFilters().remove(this.activeFilter);
          this.activeFilter = null;
          this.getTrigger('clear').hide();
          return this.updateLayout();
        }
      },
      onSearchClick: function() {
        var fileListStore;
        fileListStore = this.ownerCt.ownerCt.fileListStore;
        this.activeFilter = new Ext.util.Filter({
          anyMatch: true,
          exactMatch: false,
          caseSensitive: true,
          property: 'name',
          value: this.getValue()
        });
        fileListStore.addFilter(this.activeFilter);
        this.getTrigger('clear').show();
        return this.updateLayout();
      }
    });
    return this.callParent(arguments);
  }
});
