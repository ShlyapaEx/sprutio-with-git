// Generated by CoffeeScript 1.11.1
Ext.define('FM.action.OpenSite', {
  extend: 'FM.overrides.Action',
  config: {
    iconCls: "fm-action-open-site",
    text: t("Open"),
    handler: function(panel, path) {
      FM.Logger.info('Run Action FM.action.OpenSite', panel, path);
      if (panel.session.type === FM.Session.HOME) {
        return FM.Actions.Open.execute(panel, path);
      } else {
        FM.helpers.SetLoading(panel.body, t("Loading..."));
        return FM.backend.ajaxSend('/actions/main/init_session', {
          params: {
            session: {
              type: FM.Session.HOME,
              path: path
            }
          },
          success: function(response) {
            var listing, response_data;
            response_data = Ext.util.JSON.decode(response.responseText).data;
            listing = response_data.listing;
            if (listing.path !== '/') {
              listing.items.unshift({
                name: "..",
                is_dir: true
              });
            }
            return FM.getApplication().fireEvent(FM.Events.main.initSession, response_data, [panel]);
          },
          failure: function(response) {
            FM.Logger.debug(response);
            FM.helpers.ShowError(t("Unable to open site path.<br/> Please contact support."));
            return FM.Logger.error(response);
          }
        });
      }
    }
  }
});
