const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

    const logInButton = document.querySelector('#logInButton');
    const standingsButton = document.querySelector('#standingsButton');


    logInButton.addEventListener('click', () => {
        ipcRenderer.send('loginViewInitiate');
    });
    
    standingsButton.addEventListener('click', () => {
        ipcRenderer.send('showStandings');
    });
});

ipcRenderer.on('sendStandingsData', (ev, data) => {
    console.log(JSON.stringify(data));
});
