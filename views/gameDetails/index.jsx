import React from 'react';

const { StandingsList } = require('./../standings/index');
const { GameSettings } = require('./../gameSettingsForm/index');
const { Loading } = require('./../staticComponents/staticComponents');


const { ipcRenderer } = require('electron');

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      Standings: [],
      GameId: null,
      loading: true,
      loaded: false,
    };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.changeViewState = this.changeViewState.bind(this);
  }

  componentWillMount() {
    const me = this;
    ipcRenderer.send('getGameStandings');
    ipcRenderer.on('sendStandings', (event, data) => {
      me.changeViewState({ Standings: data.standings, GameId: data.gameId, loading: false, loaded: true });
      setTimeout(() => { me.changeViewState({ loaded: false }); }, 2000);
    });
  }

  changeViewState(newState) {
    this.setState(newState);
  }

  render() {
    if (!this.state.Standings.length) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-8">
              <div className="alert alert-primary" role="alert">
                No Standings Created
                <Loading loaded={this.state.loaded} loading={this.state.loading} />
              </div>
            </div>
            <div className="col-4">
              <GameSettings gameId={this.state.GameId} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-8">
            <StandingsList standings={this.state.Standings} />
          </div>
          <div className="col-4">
            <GameSettings gameId={this.state.GameId} />
          </div>
        </div>
        <Loading loaded={this.state.loaded} loading={this.state.loading} />
      </div>
    );
  }
}

module.exports = {
  Game,
};
