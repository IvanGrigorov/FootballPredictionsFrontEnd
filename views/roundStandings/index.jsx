import React from 'react';
import { ipcRenderer } from 'electron';

const { Loading } = require('./../staticComponents/staticComponents');
const { getRequest } = require('./../../tools/ajax');
const { hostUrlForRequests } = require('./../../tools/settings');
const { StandingsList } = require('./../standings/index');
const remote = require('electron').remote;

class RoundStandings extends React.Component {
  constructor() {
    super();
    this.state = {
      standings: [],
      loading: true,
      loaded: false,
    };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.prepareDataToDisplay = this.prepareDataToDisplay.bind(this);
  }

  componentWillMount() {
    const me = this;
    ipcRenderer.send('getRoundStandings');
    ipcRenderer.on('loadedRoundStandings', (event, data) => {
      const predparedData = me.prepareDataToDisplay(data);
      me.setState({
        standings: predparedData,
        loading: false,
        loaded: true,
      });
      setTimeout(() => {
        me.setState({ loaded: false });
      }, 2000);
    });
  }

  prepareDataToDisplay(standings) {
    const preparedData = [];
    standings.forEach((standing) => {
      preparedData.push({
        name: standing.username,
        Points: standing.points,
      });
    });
    return preparedData;
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container"> 
          <div className="alert alert-warning" role="alert">
            Getting Standings Info...
          </div>
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    } 
    if (!this.state.standings.length) {
      return (
        <div className="container">
          <div className="alert alert-secondary" role="alert">
            There are no standings for this round yet !         
          </div>
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    }
    return (
      <div className="container">
        <StandingsList standings={this.state.standings} />
        <Loading loading={this.state.loading} loaded={this.state.loaded} />
      </div>
    )
  }
}

module.exports = {
  RoundStandings,
};
