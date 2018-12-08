import React from 'react';

const { ipcRenderer } = require('electron');

const { Loading } = require('./../staticComponents/staticComponents');


class GameItem extends React.Component {
  
  constructor(props) {
    super();
    this.state = {
      gameName: props.gameName,
      gameId: props.gameId,
    };
    // this.changeViewState = this.changeViewState.bind(this);
    this.openGameDetails = this.openGameDetails.bind(this);

  }

  openGameDetails() {
    ipcRenderer.send('openGameDetails', this.state);
    console.log('Click');
  }

  render() {
    return (
      <div className="col-sm gameCard">
        <div className="card">
          <img className="card-img-top" src="..." alt="Card image cap"/>
          <div className="card-body">
            <h5 className="card-title">{this.state.gameName}</h5>
            <a href="#" className="btn btn-primary" onClick={() => { this.openGameDetails(); }}>Show info</a>
          </div>
        </div>
      </div>
    );
  }
};

class GamesList extends React.Component {
  constructor() {
    super();
    this.state = { games: [], loading: true, loaded: false };
    this.changeViewState = this.changeViewState.bind(this);
  }

  componentDidMount() {
    const self = this;
    ipcRenderer.on('sendAllGamesInfo', (event, data) => {
      self.changeViewState({ games: data, loading: false, loaded: true });
      setTimeout(() => { self.changeViewState({ loaded: false }); }, 2000);
    });
  }

  changeViewState(viewState) {
    this.setState(viewState);
  }

  render() {
    if (!this.state.games.length) {
      return (
        <div className="alert alert-primary" role="alert">
          No Games Created
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    }
    return (
      <div className="container">
        <div className="row">
          {this.state.games.map((game) => {
            return <GameItem gameName={game.name} gameId={game.id} key={game.id} />;
          })}
        </div>
        <Loading loaded={this.state.loaded} loading={this.state.loading} />
      </div>
    );
  }
}

module.exports = {
  GamesList,
};
