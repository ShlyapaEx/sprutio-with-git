// Generated by CoffeeScript 1.11.1
Ext.define('FM.action.Settings', {
  extend: 'FM.overrides.Action',
  requires: ['FM.view.windows.SettingsWindow'],
  config: {
    iconCls: "fm-action-settings",
    text: t("System Settings"),
    handler: function() {
      var bottom_toolbar, win;
      FM.Logger.info('Run Action FM.action.Settings', arguments);
      if (FM.Viewer.settings == null) {
        FM.helpers.ShowError(t("Viewer settings not loaded. Please contact Support."));
      }
      if (FM.Editor.settings == null) {
        FM.helpers.ShowError(t("Editor settings not loaded. Please contact Support."));
      }
      bottom_toolbar = Ext.ComponentQuery.query("bottom-panel")[0].getDockedItems("toolbar[dock='top']")[0];
      win = Ext.create("FM.view.windows.SettingsWindow", {
        taskBar: bottom_toolbar,
        save: (function(_this) {
          return function(button, settings_window, e, params) {
            button.disable();
            FM.helpers.SetLoading(settings_window.body);
            return FM.Actions.Settings.process(settings_window, button, params);
          };
        })(this)
      });
      return win.show();
    }
  },
  process: function(settings_window, button, params) {
    FM.Logger.debug('FM.action.Settings process() called = ', arguments);
    return FM.backend.ajaxSend('/actions/main/save_settings', {
      params: {
        session: {
          type: FM.Session.HOME
        },
        params: params
      },
      success: (function(_this) {
        return function(response) {
          var response_data;
          response_data = Ext.util.JSON.decode(response.responseText).data;
          button.enable();
          FM.helpers.UnsetLoading(settings_window.body);
          FM.getApplication().fireEvent(FM.Events.main.saveSettings, response_data);
          return settings_window.close();
        };
      })(this),
      failure: (function(_this) {
        return function(response) {
          button.enable();
          FM.helpers.UnsetLoading(settings_window.body);
          FM.Logger.debug(response);
          FM.helpers.ShowError(t("Error during saving settings. Please contact Support."));
          return FM.Logger.error(response);
        };
      })(this)
    });
  }
});