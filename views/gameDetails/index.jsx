import React from 'react';

const { StandingsList } = require('./../standings/index');
const { GameSettings } = require('./../gameSettingsForm/index');

const { ipcRenderer } = require('electron');

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      Standings: [],
      GameId: null,
    };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.changeViewState = this.changeViewState.bind(this);
  }

  componentWillMount() {
    const me = this;
    ipcRenderer.on('sendStandings', (event, data) => {
      me.changeViewState({ Standings: data.standings, GameId: data.gameId });
    });
  }

  changeViewState(newState) {
    this.setState(newState);
  }

  render() {
    if (!this.state.Standings.length) {
      return (
        <div className="alert alert-primary" role="alert">
          No Standings Created
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
      </div>
    );
  }
}

module.exports = {
  Game,
};
