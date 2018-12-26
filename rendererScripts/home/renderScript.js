const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

  ipcRenderer.send('getUserData');

  const logInButton = document.querySelector('#logInButton');
  const standingsButton = document.querySelector('#standingsButton');
  const gamesButton = document.querySelector('#gamesButton');

  logInButton.addEventListener('click', () => {
    ipcRenderer.send('loginViewInitiate');
  });

  gamesButton.addEventListener('click', () => {
    ipcRenderer.send('showGames');
  });
});

ipcRenderer.on('sendStandingsData', (ev, data) => {
  console.log(JSON.stringify(data));
});
