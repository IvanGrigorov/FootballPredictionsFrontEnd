import React from 'react';

const { Header } = require('./../staticComponents/staticComponents');
const { PredictionList } = require('./../predictions/index');
const { StandingsList } = require('./../standings/index');
const { GamePage } = require('./../gamePage/index');




const { ipcRenderer } = require('electron');
const { getRequest } = require('./../../tools/ajax');
const { deleteToken, hostUrlForRequests } = require('./../../tools/settings');


const NavBar = (props) => (
  <ul className="nav nav-pills nav-fill">
    <li className="nav-item">
      <a className="nav-link" onClick={() => props.handler({ View: 'Home' })} href="#">Home</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#" id="logInButton">Login</a>
    </li>
    {/*
    <li className="nav-item">
      <a className="nav-link" href="#" onClick={() => props.handler({ View: 'Predictions' })} id="predictionsButton">Predictions</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#" onClick={() => props.handler({ View: 'Standings' })} id="standingsButton">Standings</a>
    </li>
    */}
    <li className="nav-item">
      <a className="nav-link" href="#" onClick={() => {
        if (props.isGamesDisabled) {
          alert('You are not logged');
          return;
        }
        props.handler({ View: 'Games' });
      }} id="gamesButton">Games</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#" onClick={() => props.refreshHandler()} id="gamesButton">Refresh</a>
    </li>
  </ul>
);

const HomeInfo = () => (
  <div>
    <div className="alert alert-success homeInfo" role="alert">
      Home view
    </div>
    <div className="jumbotron">
      <h1 className="display-4">Hello, players!</h1>
      <p className="lead">This is the first version of the game for predicting the scores of different sport tournaments, created by you and for you!</p>
      <hr className="my-4" />
      <p>For any issues, problems, suggestions or any other ophinions about the game, you can contact me on email: <strong><em>ivangrigorov9@gmail.com </em></strong></p>
    </div>
  </div>
);

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { View: 'Home', userName: '', role: '', isGamesDisabled: true };
    this.changeViewState = this.changeViewState.bind(this);
    this.handleLogOutClick = this.handleLogOutClick.bind(this);
    this.clearUserViewState = this.clearUserViewState.bind(this);
  }

  componentDidMount() {
    const self = this;
    ipcRenderer.on('recieveUserInfo', (event, data) => {
      self.changeViewState({ userName: data.Msg.name, role: data.Msg.role, isGamesDisabled: false });
    });
  }

  changeViewState(viewState) {
    this.setState(viewState);
  }

  clearUserViewState() {
    this.setState({
      userName: '',
      role: '',
      isGamesDisabled: true,
    });
  }

  handleLogOutClick() {
    const me = this;
    const url = hostUrlForRequests + 'logOut';
    getRequest(url, () => {
      deleteToken().then(() => {
        me.clearUserViewState();
      });
    });
  }

  handleRefreshClick() {
    ipcRenderer.send('refresh');
  }

  render() {
    return (
      <div className="container">
        <UserInfo userName={this.state.userName} role={this.state.role} handleLogOutClick={this.handleLogOutClick} />
        <NavBar isGamesDisabled={this.state.isGamesDisabled} refreshHandler={this.handleRefreshClick} handler={this.changeViewState} />
        {(this.state.View === 'Standings') ? <StandingsList predictions={[{ title: 'Test1' }, { title: 'Test2' }]} /> : null}
        {(this.state.View === 'Predictions') ? <PredictionList predictions={[{ title: 'Test1' }, { title: 'Test2' }]} /> : null}
        {(this.state.View === 'Home') ? <HomeInfo /> : null}
        {(this.state.View === 'Games') ? <GamePage /> : null}
      </div>
    );
  }
}

const UserInfo = (props) => {
  if (!props.userName) {
    return null;
  }
  return (
    <div style={{ height: 70 }} className="alert alert-primary" role="alert">
      Name: {props.userName} Role: {props.role}
      <button type="button" className="btn btn-danger" onClick={() => { props.handleLogOutClick(); }}>
        Log Out
      </button>
    </div>
  );
};

module.exports = {
  Home: () => (
    <div>
      <Header />
      <Main />
    </div>
  ),
};
