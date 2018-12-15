import React from 'react';

const { RoundsList } = require('./../rounds');
const { Loading } = require('./../staticComponents/staticComponents');


const { ipcRenderer } = require('electron');


class Rounds extends React.Component {

  constructor() {
    super();
    this.state = {
      rounds: [],
      loading: true,
      loaded: false,
    };
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    const self = this;
    ipcRenderer.on('recieveRoundRealResults', (event, data) => {
      self.setState({ rounds: data });
      self.setState({ loaded: true, loading: false });
      setTimeout(() => {
        self.setState({ loaded: false });
      }, 2000);
    });
  }

  render() {
    if (!this.state.rounds.length) {
      return (
        <div className="alert alert-primary" role="alert">
          No Rounds Created
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-8">
            <RoundsList rounds={this.state.rounds} />
          </div>
        </div>
        <Loading loaded={this.state.loaded} loading={this.state.loading} />
      </div>
    );
  }
}

module.exports = {
  Rounds,
};
