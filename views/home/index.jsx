import React from 'react';

const { Header } = require('./../staticComponents/staticComponents');
const { PredictionList } = require('./../predictions/index');
const { StandingsList } = require('./../standings/index');

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
    this.state = { View: 'Home' };
    this.changeViewState = this.changeViewState.bind(this);
  }

  changeViewState(viewState) {
    this.setState(viewState);
  }

  render() {
    return (
      <div className="container">
        <NavBar handler={this.changeViewState} />
        {(this.state.View === 'Standings') ? <StandingsList predictions={[{ title: 'Test1' }, { title: 'Test2' }]} /> : null}
        {(this.state.View === 'Predictions') ? <PredictionList predictions={[{ title: 'Test1' }, { title: 'Test2' }]} /> : null}
        {(this.state.View === 'Home') ? <HomeInfo /> : null}
      </div>
    );
  }
}

module.exports = {
  Home: () => (
    <div>
      <Header />
      <Main />
    </div>
  ),
};
