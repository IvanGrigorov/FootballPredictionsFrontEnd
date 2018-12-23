import React from 'react';

const { ipcRenderer } = require('electron');

const { Loading, ErrorAlert, SuccessfullAlert } = require('./../staticComponents/staticComponents');


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
  }

  openRoundDetails() {
    ipcRenderer.send('openRoundDetails', this.state);
  }

  openPredictions() {
    ipcRenderer.send('openPredictions', this.state);
  }

  joinGame() {
    this.props.setLoading();
    ipcRenderer.send('joinGame', this.state);
  }
  render() {
    return (
      <div className="col-sm gameCard">
        <div className="card">
          <img className="card-img-top" src="..." alt="Card image cap"/>
          <div className="card-body">
            <h5 className="card-title">{this.state.gameName}</h5>
            <a href="#" className="btn btn-primary" onClick={() => { this.openGameDetails(); }}>Show info</a>
            <a href="#" className="btn btn-primary" onClick={() => { this.joinGame(); }}>Join Game</a>
            <a href="#" className="btn btn-primary" onClick={() => { this.openRoundDetails(); }}>Rounds</a>
            <a href="#" className="btn btn-primary" onClick={() => { this.openPredictions(); }}>Predictions</a>
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
    this.setLoading = this.setLoading.bind(this);

  }


  componentDidMount() {
    const self = this;
    ipcRenderer.on('sendAllGamesInfo', (event, data) => {
      self.changeViewState({ games: data, loading: false, loaded: true });
      self.clearMessages();
    });
    ipcRenderer.on('joinGameFailiure', (event, data) => {
      self.setState({
        SuccessfulMsg: '',
        ErrorMsg: data,
        loading: false,
      });
      self.clearMessages();
    });
    ipcRenderer.on('joinGameSuccess', (event, data) => {
      self.setState({
        SuccessfulMsg: data,
        ErrorMsg: '',
        loading: false,
      });
      self.clearMessages();
    });
  }

  setLoading() {
    this.changeViewState({ loading: true });
  }

  clearMessages() {
    const self = this;
    setTimeout(() => { self.changeViewState({ loaded: false, SuccessfulMsg: '', ErrorMsg: '' }); }, 2000);
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
            return <GameItem setLoading={this.setLoading} gameName={game.name} gameId={game.id} key={game.id} />;
          })}
        </div>
        <Loading loaded={this.state.loaded} loading={this.state.loading} />
        <SuccessfullAlert successfulMsg={this.state.SuccessfulMsg} />
        <ErrorAlert errorMsg={this.state.ErrorMsg} />
      </div>
    );
  }
}

module.exports = {
  GamesList,
};
