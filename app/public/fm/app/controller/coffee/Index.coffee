Ext.define 'FM.controller.Index',
  extend: 'Ext.app.Controller'
  views: [
    'panels.TopPanel',
    'panels.CenterPanel',
    'panels.BottomPanel',

    'grids.FileList'
  ]

  requires: [
    'FM.action.HomeFtp'
    'FM.action.RemoteConnections'
    'FM.action.RemoteWebDav'
    'FM.action.Local'

    'FM.action.Refresh'
    'FM.action.Upload'
    'FM.action.CreateArchive'
    'FM.action.ExtractArchive'
    'FM.action.DownloadArchive'
    'FM.action.SearchFiles'
    'FM.action.SearchText'
    'FM.action.AnalyzeSize'

    'FM.action.DownloadBasic'
    'FM.action.DownloadZip'
    'FM.action.DownloadGZip'
    'FM.action.DownloadBZ2'
    'FM.action.DownloadTar'

    'FM.action.Open'
    'FM.action.OpenFile'
    'FM.action.OpenSite'
    'FM.action.OpenRemoteConnection'
    'FM.action.OpenWebDav'
    'FM.action.Navigate'
    'FM.action.CopyEntry'
    'FM.action.CopyPath'

    'FM.action.Up'
    'FM.action.Root'

    'FM.action.View'
    'FM.action.ViewImage'
    'FM.action.Edit'
    'FM.action.Chmod'
    'FM.action.Copy'
    'FM.action.CreateCopy'
    'FM.action.Move'
    'FM.action.Rename'
    'FM.action.NewFolder'
    'FM.action.NewFile'
    'FM.action.Remove'

    'FM.action.IPBlock'
    'FM.action.Settings'

    'FM.action.Help'
    'FM.action.Logout'

    'FM.store.Connections'
    'FM.store.WebDavConnections'
    'FM.store.Sites'

    'Ext.layout.container.Anchor'

    'Ext.ux.window.Window'
    'Ext.ux.grid.plugin.RowEditing'
  ]

  init: () ->
    FM.Logger.log('Index init')

    @initActions()
    @initStores()
    @initEvents()

  onLaunch: () ->
    FM.panels = {}
    FM.grids = {}

    FM.panels.Top = FM.viewport.down('top-panel')
    FM.panels.Center = FM.viewport.down('center-panel')
    FM.panels.Bottom = FM.viewport.down('bottom-panel')

    FM.Left = FM.panels.Center.items.getAt(0)
    FM.Right = FM.panels.Center.items.getAt(1)

    FM.Left.grid = FM.Left.items.getAt(0)
    FM.Right.grid = FM.Right.items.getAt(0)

    FM.Left.filelist = FM.Left.grid
    FM.Right.filelist = FM.Right.grid

    FM.Active = FM.Right;
    FM.Inactive = FM.Left;

    FM.Left.toString = () -> return "Left"
    FM.Right.toString = () -> return "Right"

    FM.helpers.SetActivePanel(FM.Left)

    @initHotKeys()
    @restoreSession()

  initActions: () ->
    FM.Actions = {}

    FM.Actions.HomeFtp = Ext.create "FM.action.HomeFtp"
    FM.Actions.RemoteConnections = Ext.create "FM.action.RemoteConnections"
    FM.Actions.RemoteWebDav = Ext.create "FM.action.RemoteWebDav"
    FM.Actions.Local = Ext.create "FM.action.Local"

    FM.Actions.Refresh = Ext.create "FM.action.Refresh"

    FM.Actions.Upload = Ext.create "FM.action.Upload"
    FM.Actions.CreateArchive = Ext.create "FM.action.CreateArchive"
    FM.Actions.ExtractArchive = Ext.create "FM.action.ExtractArchive"
    FM.Actions.DownloadArchive = Ext.create "FM.action.DownloadArchive"
    FM.Actions.SearchFiles = Ext.create "FM.action.SearchFiles"
    FM.Actions.SearchText = Ext.create "FM.action.SearchText"
    FM.Actions.AnalyzeSize = Ext.create "FM.action.AnalyzeSize"

    FM.Actions.DownloadBasic = Ext.create "FM.action.DownloadBasic"
    FM.Actions.DownloadZip = Ext.create "FM.action.DownloadZip"
    FM.Actions.DownloadGZip = Ext.create "FM.action.DownloadGZip"
    FM.Actions.DownloadBZ2 = Ext.create "FM.action.DownloadBZ2"
    FM.Actions.DownloadTar = Ext.create "FM.action.DownloadTar"

    FM.Actions.Open = Ext.create "FM.action.Open"
    FM.Actions.OpenFile = Ext.create "FM.action.OpenFile"
    FM.Actions.OpenSite = Ext.create "FM.action.OpenSite"
    FM.Actions.OpenRemoteConnection = Ext.create "FM.action.OpenRemoteConnection"
    FM.Actions.OpenWebDav = Ext.create "FM.action.OpenWebDav"
    FM.Actions.Navigate = Ext.create "FM.action.Navigate"
    FM.Actions.CopyEntry = Ext.create "FM.action.CopyEntry"
    FM.Actions.CopyPath = Ext.create "FM.action.CopyPath"

    FM.Actions.Up = Ext.create "FM.action.Up"
    FM.Actions.Root = Ext.create "FM.action.Root"

    FM.Actions.View = Ext.create "FM.action.View"
    FM.Actions.ViewImage = Ext.create "FM.action.ViewImage"
    FM.Actions.Edit = Ext.create "FM.action.Edit"
    FM.Actions.Chmod = Ext.create "FM.action.Chmod"
    FM.Actions.Copy = Ext.create "FM.action.Copy"
    FM.Actions.CreateCopy = Ext.create "FM.action.CreateCopy"
    FM.Actions.Move = Ext.create "FM.action.Move"
    FM.Actions.Rename = Ext.create "FM.action.Rename"
    FM.Actions.NewFolder = Ext.create "FM.action.NewFolder"
    FM.Actions.NewFile = Ext.create "FM.action.NewFile"
    FM.Actions.Remove = Ext.create "FM.action.Remove"

    FM.Actions.IPBlock = Ext.create "FM.action.IPBlock"
    FM.Actions.Settings = Ext.create "FM.action.Settings"

    FM.Actions.Help = Ext.create "FM.action.Help"
    FM.Actions.Logout = Ext.create "FM.action.Logout"

  initStores: () ->
    FM.Stores = {}
    FM.Stores.Conenctions = Ext.create "FM.store.Connections"
    FM.Stores.WebDavConenctions = Ext.create "FM.store.WebDavConnections"
    FM.Stores.Sites = Ext.create "FM.store.Sites"

  initEvents: () ->
    FM.Events = {}

    FM.Events.main = {}
    FM.Events.main.restoreSession = 'eventMainRestoreSession'
    FM.Events.main.saveSession = 'eventMainSaveSession'
    FM.Events.main.loadSettings = 'eventMainLoadSettings'
    FM.Events.main.initSession = 'eventMainInitSession'
    FM.Events.main.saveSettings = 'eventMainSaveSettings'
    FM.Events.main.selectPanel = 'eventMainSelectPanel'
    FM.Events.main.selectFiles = 'eventMainSelectFiles'

    FM.Events.home = {}
    FM.Events.home.homeInitCallback = 'eventHomeInitCallback'
    FM.Events.home.processInit = 'eventHomeProcessInit'

    FM.Events.file = {}
    FM.Events.file.openDirectory = 'eventFilesDirectoryOpen'
    FM.Events.file.listFiles = 'eventFilesListFiles'
    FM.Events.file.removeFiles = 'eventFilesRemoveFiles'
    FM.Events.file.chmodFiles = 'eventFilesChmodFiles'
    FM.Events.file.makeDirectory = 'eventFilesMakeDirectory'
    FM.Events.file.newFile = 'eventFilesNewFile'
    FM.Events.file.renameFile = 'eventFilesRenameFile'
    FM.Events.file.analyzeSize = 'eventFilesAnalyzeSize'
    FM.Events.file.createCopyFiles = 'eventFilesCreateCopy'
    FM.Events.file.copyFiles = 'eventFilesCopy'
    FM.Events.file.moveFiles = 'eventFilesMove'

    FM.Events.archive = {}
    FM.Events.archive.createArchive = 'eventArchiveCreate'
    FM.Events.archive.extractArchive = 'eventArchiveExtract'

    FM.Events.search = {}
    FM.Events.search.findFiles = 'eventSearchFindFiles'
    FM.Events.search.findText = 'eventSearchFindText'

  initHotKeys: () ->
    FM.Logger.log("Application HotKeys init")

    FM.HotKeys = {}

    FM.HotKeys.HotKeyDecorator = (callback) ->
      FM.Logger.log("HotKeyDecorator called", arguments)
      return () ->
        if true #!Ext.MessageBox.isVisible()
          callback.apply(callback, arguments)
        else
          FM.Logger.log('HotKeyDecorator MessageBox.isVisible() - not processed key event', Ext.MessageBox,
            Ext.EventObject.getKey())

  restoreSession: () ->
    FM.backend.ajaxSend '/actions/main/restore_session',
      success: (response) =>
        response_data = Ext.util.JSON.decode(response.responseText).data
        @fireEvent(FM.Events.main.restoreSession, response_data)