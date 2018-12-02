import React from 'react';

const { Header } = require('./../staticComponents/staticComponents');
const { PredictionList } = require('./../predictions/index');
const { StandingsList } = require('./../standings/index');


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
    <li className="nav-item">
      <a className="nav-link" href="#" onClick={() => props.handler({ View: 'Predictions' })} id="predictionsButton">Predictions</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#" onClick={() => props.handler({ View: 'Standings' })} id="standingsButton">Standings</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#">Games</a>
    </li>
  </ul>
);

const HomeInfo = () => (
  <div className="alert alert-success homeInfo" role="alert">
      Home view
  </div>
);

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { View: 'Home', userName: '', role: '' };
    this.changeViewState = this.changeViewState.bind(this);
    this.handleLogOutClick = this.handleLogOutClick.bind(this);
    this.clearUserViewState = this.clearUserViewState.bind(this);
  }

  componentDidMount() {
    const self = this;
    ipcRenderer.on('recieveUserInfo', (event, data) => {
      self.changeViewState({ userName: data.Msg.name, role: data.Msg.role });
    });
  }

  changeViewState(viewState) {
    this.setState(viewState);
  }

  clearUserViewState() {
    this.setState({
      userName: '',
      role: '',
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

  render() {
    return (
      <div className="container">
        <UserInfo userName={this.state.userName} role={this.state.role} handleLogOutClick={this.handleLogOutClick} />
        <NavBar handler={this.changeViewState} />
        {(this.state.View === 'Standings') ? <StandingsList predictions={[{ title: 'Test1' }, { title: 'Test2' }]} /> : null}
        {(this.state.View === 'Predictions') ? <PredictionList predictions={[{ title: 'Test1' }, { title: 'Test2' }]} /> : null}
        {(this.state.View === 'Home') ? <HomeInfo /> : null}
      </div>
    );
  }
}

const UserInfo = (props) => {
  if (!props.userName) {
    return null;
  }
  return (
    <div className="alert alert-primary" role="alert">
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
