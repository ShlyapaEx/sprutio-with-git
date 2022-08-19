// Generated by CoffeeScript 1.11.1
Ext.define('FM.view.toolbars.WebDavConnectionListTopToolbar', {
  extend: 'Ext.toolbar.Toolbar',
  alias: 'widget.webdav-connection-list-top-toolbar',
  cls: 'fm-webdav-connection-list-top-toolbar',
  items: [],
  height: 40,
  layout: {
    type: "hbox"
  },
  defaults: {
    margin: 0
  },
  initComponent: function() {
    FM.Logger.log('FM.view.toolbars.WebDavConnectionListTopToolbar');
    this.items = [];
    this.items.push({
      text: t("Save"),
      cls: "fm-webdav-connection-save",
      iconCls: "fm-icon-save",
      handler: (function(_this) {
        return function() {
          var connection, i, len, modified, results;
          FM.Logger.debug("WebDavConnectionListTopToolbar edit() handler called", arguments);
          modified = _this.ownerCt.getStore().getModifiedRecords();
          results = [];
          for (i = 0, len = modified.length; i < len; i++) {
            connection = modified[i];
            if (connection.get('id') > 0) {
              results.push(FM.backend.ajaxSend('/actions/webdav/update', {
                params: {
                  params: {
                    id: connection.get('id'),
                    host: connection.get('host'),
                    user: connection.get('user'),
                    password: connection.get('decryptedPassword')
                  }
                },
                success: function(response) {
                  var key, response_data;
                  response_data = Ext.util.JSON.decode(response.responseText).data;
                  FM.Logger.debug(response_data);
                  for (key in response_data) {
                    connection.set(key, response_data[key]);
                  }
                  return connection.commit();
                },
                failure: function(response) {
                  FM.Logger.debug(response);
                  FM.helpers.ShowError(t("Error during webdav server update.<br/> Please contact Support."));
                  return FM.Logger.error(response);
                }
              }));
            } else {
              results.push(FM.backend.ajaxSend('/actions/webdav/create', {
                params: {
                  params: {
                    host: connection.get('host'),
                    user: connection.get('user'),
                    password: connection.get('decryptedPassword')
                  }
                },
                success: function(response) {
                  var key, response_data;
                  response_data = Ext.util.JSON.decode(response.responseText).data;
                  FM.Logger.debug(response_data);
                  for (key in response_data) {
                    connection.set(key, response_data[key]);
                  }
                  return connection.commit();
                },
                failure: function(response) {
                  FM.Logger.debug(response);
                  FM.helpers.ShowError(t("Error during webdav connection creation.<br/> Please contact Support."));
                  return FM.Logger.error(response);
                }
              }));
            }
          }
          return results;
        };
      })(this)
    });
    this.items.push({
      text: t("Edit"),
      cls: "fm-webdav-connection-edit",
      iconCls: "fm-icon-edit",
      disabled: true,
      handler: (function(_this) {
        return function() {
          var connection, grid, plugin, row;
          FM.Logger.debug("ConnectionListTopToolbar edit() handler called", arguments);
          grid = _this.ownerCt;
          plugin = grid.getPlugin();
          if (plugin.editing) {
            return false;
          }
          row = grid.getSelectionModel().getSelection();
          if (row.length === 0) {
            return false;
          }
          plugin.editor.floatingButtons.items.get(0).setText(t("Update"));
          plugin.editor.floatingButtons.items.get(1).setText(t("Cancel"));
          connection = row[0];
          return plugin.startEdit(connection, 0);
        };
      })(this)
    });
    this.items.push({
      text: t("New WebDav"),
      cls: "fm-webdav-connection-add",
      iconCls: "fm-icon-add",
      handler: (function(_this) {
        return function() {
          var plugin;
          FM.Logger.debug("WebDavConnectionListTopToolbar new() handler called", arguments);
          plugin = _this.ownerCt.getPlugin();
          if (plugin.editing) {
            return false;
          }
          plugin.editor.floatingButtons.items.get(0).setText(t("Save"));
          plugin.editor.floatingButtons.items.get(1).setText(t("Cancel"));
          return plugin.startAdd({
            host: "",
            user: "user",
            decryptedPassword: "password"
          });
        };
      })(this)
    });
    this.items.push({
      text: t("Remove WebDav"),
      cls: "fm-webdav-connection-remove",
      iconCls: "fm-icon-remove",
      disabled: true,
      handler: (function(_this) {
        return function() {
          var question;
          FM.Logger.debug("WebDavConnectionListTopToolbar remove() handler called", arguments);
          question = Ext.create('FM.view.windows.QuestionWindow', {
            title: t("Delete WebDav Connection"),
            msg: t("Do you really want to remove this conneciton?"),
            modal: true,
            yes: function() {
              var connection, grid, row;
              grid = _this.ownerCt;
              grid.getPlugin().cancelEdit();
              row = grid.getSelectionModel().getSelection();
              if (row.length === 0) {
                return false;
              }
              connection = row[0];
              grid.getStore().remove(connection);
              if (connection.get('id').indexOf('FM.model.WebDavConnection') === -1) {
                return FM.backend.ajaxSend('/actions/webdav/remove', {
                  params: {
                    params: {
                      id: connection.get('id')
                    }
                  },
                  failure: function(response) {
                    FM.Logger.debug(response);
                    FM.helpers.ShowError(t("Error during webdav connection removal.<br/> Please contact Support."));
                    return FM.Logger.error(response);
                  }
                });
              }
            }
          });
          return question.show();
        };
      })(this)
    });
    return this.callParent(arguments);
  }
});
