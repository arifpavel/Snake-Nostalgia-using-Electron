const {app, BrowserWindow, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Accessing Menubar Adding Custom Menu items.

const template = [
  {
    role: 'help',
    submenu: [
      {
        label: 'Control',
        click () { 
          //require('electron').shell.openExternal('https://electron.atom.io') 
          let child = new BrowserWindow({
            modal: true, 
            show: false,
            resizable: false,
            width: 400,
            height: 400
          })
          child.loadURL(`file://${__dirname}/help.html`)
          child.once('ready-to-show', () => {
            child.setMenu(null),
            child.show()
          })
        }
      },
      {
        label: 'About',
        click(){
          let child = new BrowserWindow({
            modal: true, 
            show: false,
            resizable: false,
            width: 400,
            height: 400
          })
          child.loadURL(`file://${__dirname}/about.html`)
          child.once('ready-to-show', () => {
            child.setMenu(null),
            child.show()
          })
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// Init window

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    resizable: false,
    show: false,
    width: 800, 
    height: 600
  })

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  //Show main window

  win.once('ready-to-show', () => {
            win.show()
          })

  // Open the DevTools.
  //win.webContents.openDevTools()
  win.resizeable = null
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.