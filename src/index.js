import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

// let request = require('ajax-request');
const { getRequest, postRequest } = require('./../tools/ajax');
const { hostUrlForRequests, getToken } = require('./../tools/settings');
const url = require('url');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let gameWin;
let roundsWin;
let createRoundsWindow;
let loginWin;
let predictionsWin;


const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

// ///////////////////////////////////////////////////
// Check for user info before opening main window ////
// ///////////////////////////////////////////////////

const openMainWindowWithUserInfo = () => {
  return new Promise(function(resolve, reject) {
    getToken().then(
      (token) => {
        if (token) {
          getRequest(hostUrlForRequests+'info', (body) => {
            global.UserInfo = JSON.parse(body);
            createWindow();
            resolve();
          });
        } else {
          createWindow();
          resolve();
        }
      }
    );
  });
};

// ////////////////////////
// Opening main window ////
// ////////////////////////

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../views/home/index.html'),
      protocol: 'file:',
      slashes: true,
    }));
  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', openMainWindowWithUserInfo);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


// /////////////////////////////////////////
// /////////////////////////////////////////
// Ipc Communication for HOME VIEW//////////
// /////////////////////////////////////////
// /////////////////////////////////////////


// ////////////////////////
// Create Login Window ////
// ////////////////////////

ipcMain.on('loginViewInitiate', () => {
  loginWin = new BrowserWindow({ width: 300, height: 400 });
  loginWin.setResizable(false);
  loginWin.loadURL(
      url.format({
        pathname: path.join(__dirname, '../views/login/index.html'),
        protocol: 'file:',
        slashes: true,
      }));


  loginWin.on('closed', () => {
    loginWin = null;
  });
});

ipcMain.on('showStandings', () => {
  // Get Standings from server
  const callback = function(body) {
    console.log(body);
    const info = JSON.parse(body);
    mainWindow.webContents.send('sendStandingsData', info.Msg);
  };
  getRequest('http://localhost:8080/my-project/public/11/general/standings', callback);
});


// //////////////////////////////////////////////////////
// Load user data (if exists) on rendering Main View ////
// //////////////////////////////////////////////////////

ipcMain.on('getUserData', () => {
  if (global.UserInfo) {
    mainWindow.webContents.send('recieveUserInfo', global.UserInfo);
  }
});


// //////////////////////////////////////////////////////
// Load user data (if exists) on rendering Main View ////
// //////////////////////////////////////////////////////

ipcMain.on('showGames', () => {
  const urlForGettingAllGames = hostUrlForRequests + 'allGames';
  getRequest(urlForGettingAllGames, (body) => {
    const parsedRequestBody = JSON.parse(body);
    mainWindow.webContents.send('sendAllGamesInfo', parsedRequestBody.Msg.Msg);
  });
});


// //////////////////////////////////////////////////////
// Load game data and open GAME Window //////////////////
// //////////////////////////////////////////////////////

ipcMain.on('openGameDetails', (event, data) => {
  global.CurrentSelectedGame = data;
  gameWin = new BrowserWindow({ width: 800, height: 600 });
  gameWin.setResizable(false);
  gameWin.loadURL(
      url.format({
        pathname: path.join(__dirname, '../views/gameDetails/index.html'),
        protocol: 'file:',
        slashes: true,
      }));


  gameWin.on('closed', () => {
    gameWin = null;
  });
});

// ////////////////////////////////////////////////////////
// Load game data and open ROUNDS Window //////////////////
// ////////////////////////////////////////////////////////

ipcMain.on('openRoundDetails', (event, data) => {
  global.CurrentSelectedGame = data;
  roundsWin = new BrowserWindow({ width: 800, height: 600 });
  roundsWin.setResizable(false);
  roundsWin.loadURL(
      url.format({
        pathname: path.join(__dirname, '../views/roundDetails/index.html'),
        protocol: 'file:',
        slashes: true,
      }));


  roundsWin.on('closed', () => {
    roundsWin = null;
  });
});

// ////////////////////////////////////////////////////////
// Load game data and open PREDICTIONS Window /////////////
// ////////////////////////////////////////////////////////

ipcMain.on('openPredictions', (event, data) => {
  global.CurrentSelectedRound = data;
  predictionsWin = new BrowserWindow({ width: 800, height: 600 });
  predictionsWin.setResizable(false);
  predictionsWin.loadURL(
      url.format({
        pathname: path.join(__dirname, '../views/predictionsDetails/index.html'),
        protocol: 'file:',
        slashes: true,
      }));


  predictionsWin.on('closed', () => {
    predictionsWin = null;
  });
});


// //////////////////////////////////////////////////////
// Join Game after click  ///////////////////////////////
// //////////////////////////////////////////////////////

ipcMain.on('joinGame', (event, data) => {
  global.CurrentSelectedGame = data;
  const urlForAddingUserToGame = hostUrlForRequests + global.CurrentSelectedGame.gameId + '/user/insert';
  if (!global.UserInfo) {
    mainWindow.webContents.send('joinGameFailiure', 'You are not logged');
  } else {
    console.log(global.UserInfo);
    postRequest({ userId: global.UserInfo.Msg.id }, urlForAddingUserToGame, (body) => {
      //console.log(body);
      const parsedBody = JSON.parse(body);
      mainWindow.webContents.send('joinGameSuccess', parsedBody.Msg);
    });
  }
});


// ////////////////////////////////////////////
// REFRESH App  ///////////////////////////////
// ////////////////////////////////////////////

ipcMain.on('refresh', () => {
  app.relaunch();
  app.exit();
});

// //////////////////////////////////////////
// //////////////////////////////////////////
// Ipc Communication for LOGIN VIEW /////////
// //////////////////////////////////////////
// //////////////////////////////////////////


// //////////////////////////////////////////
// Load user data in Main View on log in ////
// //////////////////////////////////////////

ipcMain.on('onLogin', (event, data) => {
  const userInfo = JSON.parse(data);
  global.UserInfo = userInfo;
  mainWindow.webContents.send('recieveUserInfo', userInfo);
});


// //////////////////////////////////////////
// //////////////////////////////////////////
// Ipc Communication for GAME VIEW /////////
// //////////////////////////////////////////
// //////////////////////////////////////////


// //////////////////////////////////////////
// Load game standings in GAME Window ///////
// //////////////////////////////////////////

ipcMain.on('getGameStandings', () => {
  const urlForGettingStandingsForGame = hostUrlForRequests + global.CurrentSelectedGame.gameId + '/general/standings';
  getRequest(urlForGettingStandingsForGame, (body) => {
    const parsedBody = JSON.parse(body);
    gameWin.webContents.send('sendStandings', { standings: parsedBody.Msg, gameId: global.CurrentSelectedGame.gameId });
  });
});


// //////////////////////////////////////////
// //////////////////////////////////////////
// Ipc Communication for ROUND VIEW /////////
// //////////////////////////////////////////
// //////////////////////////////////////////


// //////////////////////////////////////////
// Load rounds in Round Window //////////////
// //////////////////////////////////////////

ipcMain.on('getRoundRealResults', () => {
  const urlForGettingRoundsForGame = hostUrlForRequests + global.CurrentSelectedGame.gameId + '/rounds';
  getRequest(urlForGettingRoundsForGame, (body) => {
    const parsedBody = JSON.parse(body);
    const roundCollection = parsedBody.Msg;
    const promiseCollection = [];
    const preparedRoundData = [];
    for (let i = 0; i < roundCollection.length; i++) {
      promiseCollection.push(
        new Promise((resolve, reject) => {
          const urlForGettingRoundRealResilts = hostUrlForRequests + roundCollection[i].id + '/results/real';
          getRequest(urlForGettingRoundRealResilts, (roundBody) => {
            const parsedRoundInfoBody = JSON.parse(roundBody);
            const roundInfoCollection = parsedRoundInfoBody.Msg;
            const preparedRoundTeamsData = [];
            for (let j = 0; j < roundInfoCollection.length; j++) {
              preparedRoundTeamsData.push({
                HostTeam: roundInfoCollection[j].HostTeam,
                Host: roundInfoCollection[j].Host,
                Guest: roundInfoCollection[j].Guest,
                GuestTeam: roundInfoCollection[j].GuestTeam,
              });
            }
            preparedRoundData.push({
              id: roundCollection[i].id,
              roundNumber: roundCollection[i].RoundNumber,
              realResults: preparedRoundTeamsData,
            });
            global.CurrentSelectedGame.roundNumber = preparedRoundData.length;
            resolve();
          });
        }),
      );
    }
    Promise.all(promiseCollection).then(() => {
      preparedRoundData.sort((a, b) => {
        return a.roundNumber - b.roundNumber;
      });
      roundsWin.webContents.send('recieveRoundRealResults', preparedRoundData);
    });
  });
});

// //////////////////////////////////////////
// Open CreateNewRound Window ///////////////
// //////////////////////////////////////////

ipcMain.on('openCreateNewRoundWindow', () => {
  createRoundsWindow = new BrowserWindow({ width: 500, height: 600 });
  createRoundsWindow.setResizable(false);
  createRoundsWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../views/createRound/index.html'),
        protocol: 'file:',
        slashes: true,
      }));

  createRoundsWindow.on('closed', () => {
    createRoundsWindow = null;
  });
});


// //////////////////////////////////////////
// //////////////////////////////////////////
// Ipc Communication for PREDICTIONS VIEW ///
// //////////////////////////////////////////
// //////////////////////////////////////////

// /////////////////////////////////////////////////
// Load predictions if any in Predictions Window ///
// /////////////////////////////////////////////////

ipcMain.on('getPredictionsIfAny', () => {
  const urlToGetPredictions = hostUrlForRequests + global.UserInfo.Msg.id + '/' + global.CurrentSelectedRound + '/predictions';
  getRequest(urlToGetPredictions, (body) => {
    const parsedBody = JSON.parse(body);
    predictionsWin.webContents.send('loadedPredictions', parsedBody.Msg);
  });
});

// //////////////////////////////////////////
// Load round teams in Predictions Window ///
// //////////////////////////////////////////

ipcMain.on('getPredictionsIfAny', () => {
  const urlToGetPredictions = hostUrlForRequests + global.CurrentSelectedRound + '/teams';
  getRequest(urlToGetPredictions, (body) => {
    const parsedBody = JSON.parse(body);
    predictionsWin.webContents.send('loadedRoundTeams', parsedBody.Msg);
  });
});
