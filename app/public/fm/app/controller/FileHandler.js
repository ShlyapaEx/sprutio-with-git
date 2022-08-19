// Generated by CoffeeScript 1.11.1
Ext.define('FM.controller.FileHandler', {
  extend: 'Ext.app.Controller',
  views: [],
  init: function() {
    FM.Logger.log('FileHandler init!');
    return this.listen({
      controller: {
        '*': {
          eventFilesDirectoryOpen: 'openDirectory',
          eventFilesListFiles: 'listFiles',
          eventFilesRemoveFiles: 'removeFiles',
          eventFilesChmodFiles: 'chmodFiles',
          eventFilesMakeDirectory: 'makeDirectory',
          eventFilesNewFile: 'newFile',
          eventFilesRenameFile: 'renameFile',
          eventFilesAnalyzeSize: 'analyzeSize',
          eventFilesCreateCopy: 'createCopy',
          eventFilesCopy: 'copyFiles',
          eventFilesMove: 'moveFiles'
        }
      }
    });
  },
  onLaunch: function() {},
  openDirectory: function(session, path, panels) {
    var i, len, panel, results;
    FM.Logger.log('Event openDirectory run in FileHandler! data = ', session, path, panels);
    results = [];
    for (i = 0, len = panels.length; i < len; i++) {
      panel = panels[i];
      if (panel.filelist.hasListCache(path)) {
        FM.Logger.log('Has cache for path = ', path);
        results.push(this.fireEvent(FM.Events.file.listFiles, panel.filelist.getListCache(path), [panel]));
      } else {
        FM.helpers.SetLoading(panel.body, t("Loading..."));
        results.push(FM.backend.ajaxSend('/actions/files/list', {
          params: {
            session: session,
            path: path
          },
          success: (function(_this) {
            return function(response) {
              var listing, response_data;
              response_data = Ext.util.JSON.decode(response.responseText).data;
              listing = response_data;
              if (listing.path !== '/') {
                listing.items.unshift({
                  name: "..",
                  is_dir: true
                });
              }
              _this.fireEvent(FM.Events.file.listFiles, listing, [panel]);
              return _this.fireEvent(FM.Events.main.saveSession, [panel]);
            };
          })(this),
          failure: function() {
            FM.helpers.UnsetLoading(panel.body);
            FM.helpers.ShowError(t("Directory doesn't exists"));
            return FM.Logger.error(response);
          }
        }));
      }
    }
    return results;
  },
  listFiles: function(listing, panels) {
    var i, len, panel, results;
    FM.Logger.log('Event listFiles run in FileHandler! data = ', listing, panels);
    results = [];
    for (i = 0, len = panels.length; i < len; i++) {
      panel = panels[i];
      if (panel.session.type === FM.Session.HOME) {
        panel.setShareStatus(listing.is_share, listing.is_share_write);
      }
      panel.filelist.setFileList(listing);
      results.push(FM.helpers.SelectDefault(panel));
    }
    return results;
  },
  makeDirectory: function(item, session) {
    FM.Logger.log('Event makeDirectory run in FileHandler! data = ', item, session);
    return FM.helpers.ApplySession(session, function(panel) {
      var name;
      panel.filelist.clearListCache();
      if (panel.session.path === session.path) {
        name = FM.helpers.GetRelativePath(panel.session, item.name);
        return panel.filelist.addFile({
          is_dir: true,
          name: name,
          mode: item.mode,
          mtime: item.mtime
        });
      }
    });
  },
  renameFile: function(source, target, session) {
    FM.Logger.log('Event renameFile run in FileHandler! data = ', arguments);
    return FM.helpers.ApplySession(session, function(panel) {
      var record;
      panel.filelist.clearListCache();
      if (panel.session.path === session.path) {
        record = panel.filelist.store.findRecord("name", source.name);
        if (record != null) {
          record.set("name", target.name, {
            dirty: false
          });
          record.set("ext", target.ext, {
            dirty: false
          });
        } else {
          panel.filelist.addFile(target);
        }
        return panel.filelist.getView().refresh();
      }
    });
  },
  newFile: function(item, session) {
    FM.Logger.log('Event newFile run in FileHandler! data = ', item, session);
    return FM.helpers.ApplySession(session, function(panel) {
      panel.filelist.clearListCache();
      if (panel.session.path === session.path) {
        item.name = FM.helpers.GetRelativePath(panel.session, item.name);
        return panel.filelist.addFile(item);
      }
    });
  },
  removeFiles: function(status, session, progress_window) {
    FM.Logger.log('Event removeFiles run in FileHandler! data = ', arguments);
    if ((status.status != null) && (status.status === FM.Status.STATUS_SUCCESS || status.status === FM.Status.STATUS_ABORT)) {
      progress_window.hide();
      FM.helpers.ApplySession(session, function(panel) {
        var file, file_name, i, j, len, len1, record, ref, ref1, results;
        panel.filelist.clearListCache();
        if (panel.session.path === session.path) {
          if (status.data.success != null) {
            ref = status.data.success;
            for (i = 0, len = ref.length; i < len; i++) {
              file = ref[i];
              file_name = FM.helpers.GetRelativePath(panel.session, file);
              record = panel.filelist.store.findRecord("name", file_name);
              panel.filelist.store.remove(record);
            }
          }
          panel.updateStatusBar();
          if (status.status === FM.Status.STATUS_ABORT) {
            return FM.Actions.Refresh.execute([panel]);
          }
        } else {
          if (status.data.success != null) {
            ref1 = status.data.success;
            results = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              file = ref1[j];
              if (FM.helpers.IsSubpathOf(panel.session, file)) {
                FM.Actions.Open.execute(panel, FM.helpers.GetRootPath(panel.session));
                break;
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        }
      });
      if ((status.data.errors != null) && status.data.errors.length > 0) {
        FM.helpers.ShowError(Ext.util.Format.format(t("Unable to remove {0} elements."), status.data.errors.length));
      }
      if (status.status === FM.Status.STATUS_ABORT) {
        return FM.Logger.info('Remove Operation Aborted', status);
      } else {
        return FM.Logger.info('Operation success', status);
      }
    } else if ((status.status != null) && status.status === FM.Status.STATUS_ERROR) {
      progress_window.hide();
      FM.Logger.info('Operation error', status);
      return FM.helpers.ShowError(t("Error during operation. Please contact Support."));
    } else {
      return FM.helpers.ShowError(t("Unknown operation status. Please contact Support."));
    }
  },
  createCopy: function(status, session, progress_window) {
    FM.Logger.log('Event createCopy run in FileHandler! data = ', arguments);
    if ((status.status != null) && (status.status === FM.Status.STATUS_SUCCESS || status.status === FM.Status.STATUS_ABORT)) {
      progress_window.close();
      FM.helpers.ApplySession(session, function(panel) {
        panel.filelist.clearListCache();
        if (panel.session.path === session.path) {
          if (status.data.items != null) {
            panel.filelist.addFiles(status.data.items);
          }
          panel.updateStatusBar();
          if (status.status === FM.Status.STATUS_ABORT) {
            return FM.Actions.Refresh.execute([panel]);
          }
        }
      });
      if ((status.data.errors != null) && status.data.errors.length > 0) {
        FM.helpers.ShowError(Ext.util.Format.format(t("Unable to copy {0} elements."), status.data.errors.length));
      }
      if (status.status === FM.Status.STATUS_ABORT) {
        return FM.Logger.info('Create Copy Operation Aborted', status);
      } else {
        return FM.Logger.info('Operation success', status);
      }
    } else if ((status.status != null) && status.status === FM.Status.STATUS_ERROR) {
      progress_window.hide();
      FM.Logger.info('Operation error', status);
      FM.helpers.ShowError(t("Error during operation. Please contact Support."));
    } else {
      FM.helpers.ShowError(t("Unknown operation status. Please contact Support."));
    }
  },
  copyFiles: function(status, session, target_session, progress_window) {
    FM.Logger.log('Event copyFiles run in FileHandler! data = ', arguments);
    if ((status.status != null) && (status.status === FM.Status.STATUS_SUCCESS || status.status === FM.Status.STATUS_ABORT)) {
      progress_window.hide();
      FM.helpers.ApplySession(target_session, function(panel) {
        panel.filelist.clearListCache();
        if (panel.session.path === target_session.path) {
          return FM.Actions.Refresh.execute([panel]);
        }
      });
      if ((status.data.errors != null) && status.data.errors.length > 0) {
        FM.helpers.ShowError(Ext.util.Format.format(t("Unable to copy {0} elements."), status.data.errors.length));
      }
      if (status.status === FM.Status.STATUS_ABORT) {
        return FM.Logger.info('Copy Operation Aborted', status);
      } else {
        return FM.Logger.info('Operation success', status);
      }
    } else if ((status.status != null) && status.status === FM.Status.STATUS_ERROR) {
      progress_window.hide();
      FM.Logger.info('Operation error', status);
      FM.helpers.ShowError(t("Error during operation. Please contact Support."));
    } else {
      FM.helpers.ShowError(t("Unknown operation status. Please contact Support."));
    }
  },
  moveFiles: function(status, session, target_session, progress_window) {
    FM.Logger.log('Event moveFiles run in FileHandler! data = ', arguments);
    if ((status.status != null) && (status.status === FM.Status.STATUS_SUCCESS || status.status === FM.Status.STATUS_ABORT)) {
      progress_window.hide();
      FM.helpers.ApplySession(target_session, function(panel) {
        panel.filelist.clearListCache();
        if (panel.session.path === target_session.path) {
          return FM.Actions.Refresh.execute([panel]);
        }
      });
      FM.helpers.ApplySession(session, function(panel) {
        panel.filelist.clearListCache();
        if (panel.session.path === session.path) {
          return FM.Actions.Refresh.execute([panel]);
        }
      });
      if ((status.data.errors != null) && status.data.errors.length > 0) {
        FM.helpers.ShowError(Ext.util.Format.format(t("Unable to move {0} elements."), status.data.errors.length));
      }
      if (status.status === FM.Status.STATUS_ABORT) {
        return FM.Logger.info('Move Operation Aborted', status);
      } else {
        return FM.Logger.info('Operation success', status);
      }
    } else if ((status.status != null) && status.status === FM.Status.STATUS_ERROR) {
      progress_window.hide();
      FM.Logger.info('Operation error', status);
      FM.helpers.ShowError(t("Error during operation. Please contact Support."));
    } else {
      FM.helpers.ShowError(t("Unknown operation status. Please contact Support."));
    }
  },
  chmodFiles: function(status, session, progress_window, params) {
    FM.Logger.log('Event chmodFiles run in FileHandler! data = ', arguments);
    if ((status.status != null) && (status.status === FM.Status.STATUS_SUCCESS || status.status === FM.Status.STATUS_ABORT)) {
      progress_window.close();
      FM.helpers.ApplySession(session, function(panel) {
        panel.filelist.clearListCache();
        if (panel.session.path === session.path) {
          return FM.Actions.Refresh.execute([panel]);
        }
      });
      if ((status.data.errors != null) && status.data.errors.length > 0) {
        FM.helpers.ShowError(Ext.util.Format.format(t("Unable to change attributes of {0} elements."), status.data.errors.length));
      }
      if (status.status === FM.Status.STATUS_ABORT) {
        return FM.Logger.info('Remove Operation Aborted', status);
      } else {
        return FM.Logger.info('Operation success', status);
      }
    } else if ((status.status != null) && status.status === FM.Status.STATUS_ERROR) {
      progress_window.close();
      FM.Logger.info('Operation error', status);
      FM.helpers.ShowError(t("Error during operation. Please contact Support."));
    } else {
      FM.helpers.ShowError(t("Unknown operation status. Please contact Support."));
    }
  },
  analyzeSize: function(status, session, chart_window) {
    var chart_colors, chart_list, chart_series, file, files_chart, files_list, i, index, item, j, k, l, len, len1, len2, len3, len4, m, min_sector, other_data, other_size, percent, ref, ref1, ref2, total_size;
    FM.Logger.log('Event analyzeSize run in FileHandler! data = ', arguments);
    files_list = Ext.ComponentQuery.query("file-size-list", chart_window)[0];
    files_chart = Ext.ComponentQuery.query("file-size-chart", chart_window)[0];
    if ((status.status != null) && (status.status === FM.Status.STATUS_SUCCESS || status.status === FM.Status.STATUS_ABORT)) {
      if (status.status === FM.Status.STATUS_ABORT) {
        FM.Logger.info('Analyze Size Operation Aborted', status);
      } else {
        FM.Logger.info('Operation success', status);
      }
      chart_list = [];
      if ((status.data != null) && status.data.length > 0) {
        total_size = 0;
        min_sector = 3;
        other_data = [];
        other_size = 0;
        ref = status.data;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          total_size += item.size;
        }
        ref1 = status.data;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          item = ref1[j];
          percent = (item.size / total_size) * 100;
          if (percent <= min_sector) {
            other_data.push(item);
          } else {
            chart_list.push(item);
          }
        }
        if (other_data.length > 0) {
          for (k = 0, len2 = other_data.length; k < len2; k++) {
            item = other_data[k];
            other_size += item.size;
          }
          chart_list.push({
            name: t("others"),
            size: other_size
          });
        }
      } else {
        chart_list.push({
          name: chart_window.getPath(),
          size: 0
        });
      }
      files_chart.setChartData(chart_list);
      chart_series = files_chart.series.getAt(0);
      chart_colors = [];
      index = 0;
      chart_series.eachRecord(function(record) {
        FM.Logger.debug('Chart series record color', record, this.getLegendColor(index));
        chart_colors.push({
          item: record,
          color: this.getLegendColor(index)
        });
        return index++;
      }, chart_series);
      ref2 = status.data;
      for (l = 0, len3 = ref2.length; l < len3; l++) {
        item = ref2[l];
        for (m = 0, len4 = chart_colors.length; m < len4; m++) {
          file = chart_colors[m];
          if (file.item.get('name') === item.name) {
            item.color = file.color;
          }
        }
        if (!item.color) {
          item.color = chart_colors[chart_colors.length - 1].color;
        }
      }
      FM.Logger.info('Chart colors');
      files_list.setFileList(status.data);
      FM.helpers.UnsetLoading(files_list.body);
      return FM.helpers.UnsetLoading(files_chart);
    } else if ((status.status != null) && status.status === FM.Status.STATUS_ERROR) {
      FM.helpers.UnsetLoading(files_list.body);
      FM.helpers.UnsetLoading(files_chart);
      FM.Logger.info('Operation error', status);
      FM.helpers.ShowError(t("Error during operation. Please contact Support."));
    } else {
      FM.helpers.UnsetLoading(files_list.body);
      FM.helpers.UnsetLoading(files_chart);
      FM.helpers.ShowError(t("Unknown operation status. Please contact Support."));
    }
  }
});
