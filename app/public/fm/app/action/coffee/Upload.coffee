Ext.define 'FM.action.Upload',
  extend: 'FM.overrides.Action'
  requires: [
    'Ext.ux.upload.Dialog'
  ]
  config:
    scale: "large"
    iconAlign: "top"
    iconCls: "fm-action-upload"
    text: t("Upload Files")
    handler: () ->
      FM.Logger.info('Run Action FM.action.Upload', arguments)

      dialog = Ext.create "Ext.ux.upload.Dialog",
        cls: "fm-upload-dialog"
        dialogTitle: t("Upload Files")
        textOk : t("OK")
        textClose : t("Close")
        textUpload : t("Upload")
        textBrowse : t("Browse")
        textAbort : t("Abort")
        textRemoveSelected : t("Remove selected")
        textRemoveAll : t("Remove all")
        buttonText : t("Browse...")
        selectionMessageText : t("Selected {0} file(s), {1}")
        uploadMessageText : t("Upload progress {0}% ({1} of {2} files)")

        # grid strings
        textFilename : t("Filename")
        textSize : t("Size")
        textType : t("Type")
        textStatus : t("Status")
        textProgress : '%'
        uploadUrl: "/upload"
        modal: false
        resizable: true
        uploadTimeout : 60000000
        uploadParams:
          session: Ext.JSON.encode(FM.Active.session)
          overwrite: false
      dialog.show();