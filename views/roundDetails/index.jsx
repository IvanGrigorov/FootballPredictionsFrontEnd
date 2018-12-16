import React from 'react';

const { RoundsList } = require('./../rounds');
const { Loading, ErrorAlert } = require('./../staticComponents/staticComponents');


const { ipcRenderer } = require('electron');
const remote = require('electron').remote;


class Rounds extends React.Component {

  constructor() {
    super();
    this.state = {
      rounds: [],
      loading: true,
      loaded: false,
      errorMsg: '',
    };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.handleCreateNewRoundAction = this.handleCreateNewRoundAction.bind(this);
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

  handleCreateNewRoundAction() {
    if (remote.getGlobal('UserInfo') &&
      remote.getGlobal('UserInfo').Msg.role === 'ADMIN') {
      ipcRenderer.send('openCreateNewRoundWindow');
    }
    else {
      this.setState({ errorMsg: 'You are not Admin' });
    }
  }

  render() {
    if (!this.state.rounds.length) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-8">
              <div className="alert alert-primary" role="alert">
                No Rounds Created
              </div>
            </div>
            <div className="col-4">
              <button type="button" className="btn btn-primary" onClick={this.handleCreateNewRoundAction}>Create new round</button>
              <div className="alert alert-secondary" role="alert">
                You have to be admin to modify this
              </div>
              <ErrorAlert errorMsg={this.state.errorMsg} />
            </div>
          </div>
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
          <div className="col-4">
            <button type="button" className="btn btn-primary" onClick={this.handleCreateNewRoundAction}>Create new round</button>
            <div className="alert alert-secondary" role="alert">
              You have to be admin to modify this
            </div>
            <ErrorAlert errorMsg={this.state.errorMsg} />
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
