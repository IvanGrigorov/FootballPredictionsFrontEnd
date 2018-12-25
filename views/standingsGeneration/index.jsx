import React from 'react';

const { ipcRenderer } = require('electron');
const { Loading, ErrorAlert, SuccessfullAlert } = require('./../staticComponents/staticComponents');
const { postRequest, getRequest } = require('./../../tools/ajax');
const { hostUrlForRequests } = require('./../../tools/settings');
const remote = require('electron').remote;

class StandingsGeneration extends React.Component {

  constructor() {
    super();
    this.state = {
      edditedRealResults: [],
      roundTeams: [],
      loading: true,
      loaded: false,
    };
    this.componentWillMount = this.componentWillMount.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.prepareSubmit = this.prepareSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.convertEdditedData = this.convertEdditedData.bind(this);
  }

  componentWillMount() {
    const me = this;
    ipcRenderer.send('getRoundTeamsInGenerationStandingsView');
    ipcRenderer.on('loadedRoundTeamsInGenerationStandingsView', (event, data) => {
      me.setState({
        roundTeams: data,
        loading: false,
        loaded: true,
      });
      setTimeout(() => {
        me.setState({
          loaded: false,
        });
      }, 2000);
    });
  }

  handleOnChange(roundTeamsId, event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (!this.state.edditedRealResults[roundTeamsId]) {
      this.state.edditedRealResults[roundTeamsId] = {};
      this.state.edditedRealResults[roundTeamsId].roundTeamsId = roundTeamsId;
    }
    this.state.edditedRealResults[roundTeamsId][name] = value;
  }

  convertEdditedData() {
    const dataToSend = [];
    this.state.edditedRealResults.forEach(edditedRealResult => {
      dataToSend.push(edditedRealResult);
    });
    return dataToSend;
  }

  prepareSubmit(event) {
    event.preventDefault();
    const me = this;
    let lengthOfEdditedResults = 0;
    this.state.edditedRealResults.forEach((edditedRealResult) => {
      if (edditedRealResult.host && edditedRealResult.guest) {
        lengthOfEdditedResults++;
      }
    });
    const dialogOptions = { type: 'info',
      buttons: ['OK', 'Cancel'],
      message: 'You have eddited only ' + lengthOfEdditedResults + ' fixtures out of ' + this.state.roundTeams.length + ' ?' };
    const dialog = remote.dialog;
    dialog.showMessageBox(dialogOptions, (i) => {
      if (!i) {
        me.handleSubmit(event);
      }
    });
  }

  handleSubmit() {
    const me = this;
    const dataToSend = { results: JSON.stringify(this.convertEdditedData()) };
    const currentSelectedRound = remote.getGlobal('CurrentSelectedRound');
    const urlToUploadRealResults = hostUrlForRequests + currentSelectedRound + '/results/real';
    postRequest(dataToSend, urlToUploadRealResults, (body) => {
      const currentSelectedGame = remote.getGlobal('CurrentSelectedGame').gameId;
      const urlToGenerateStandings = hostUrlForRequests + currentSelectedGame + '/' + currentSelectedRound + '/standings/generation';
      getRequest(urlToGenerateStandings, (bodyAfterGeneration) => {
        const parsedBody = JSON.parse(bodyAfterGeneration);
        me.setState({
          successfulMsg: parsedBody.Msg,
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container">
          <div className="alert alert-warning" role="alert">
            Getting round teams info...
          </div>
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    }
    if (!this.state.roundTeams.length) {
      return (
        <div className="container">
          <div className="alert alert-secondary" role="alert">
            Teams for round are not given.
          </div>
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    }
    return (
      <div className="container">
        <form onSubmit={this.prepareSubmit}>
          <ul className="list-group">
            {this.state.roundTeams.map((roundTeamPair) => {
              return <RealResultsItem handleOnChange={this.handleOnChange} roundTeamPair={roundTeamPair} key={roundTeamPair.id} />;
            })}
          </ul>
          <input type="submit" className="btn btn-primary" value="Generate" />
        </form>
        <SuccessfullAlert successfulMsg={this.state.successfulMsg} />
        <ErrorAlert errorMsg={this.state.errorMsg} />
        <Loading loaded={this.state.loaded} loading={this.state.loading} />
      </div>
    );
  }
}

const RealResultsItem = (props) => {
  return (
    <div className="form-group row">
      <label htmlFor="inputHost" className="col-2 col-form-label">{props.roundTeamPair.host}</label>
      <div className="col-3">
        <input name="host" type="number" onChange={(event) => { props.handleOnChange(props.roundTeamPair.id, event); }} className="form-control" id="inputHost" placeholder="Host" />
      </div>
      -
      <div className="col-3">
        <input name="guest" type="number" onChange={(event) => { props.handleOnChange(props.roundTeamPair.id, event); }} className="form-control" id="inputGuest" placeholder="Guest" />
      </div>
      <label htmlFor="inputGuest" className="col-2 col-form-label">{props.roundTeamPair.guest}</label>
    </div>
  );
};

module.exports = {
  StandingsGeneration,
};
