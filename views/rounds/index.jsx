import React from 'react';
import { ipcRenderer } from 'electron';
const remote = require('electron').remote;
const { ErrorAlert } = require('./../staticComponents/staticComponents');



class RoundListItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      round: props.round
    };
    this.openPredictions = this.openPredictions.bind(this);
    this.openRoundStandings = this.openRoundStandings.bind(this);
    this.openGenerateStandingsOptions = this.openGenerateStandingsOptions.bind(this);
  }

  openPredictions() {
    ipcRenderer.send('openPredictions', this.state.round.id);
  }

  openRoundStandings() {
    ipcRenderer.send('openRoundStandings', this.state.round.id);
  }

  openGenerateStandingsOptions() {
    if (!remote.getGlobal('UserInfo') ||
     !(remote.getGlobal('UserInfo').Msg.role === 'ADMIN')) {
      this.setState({
        ErrorMsg: 'You are not admin !',
      });
      return;
    }
    ipcRenderer.send('openGenerateStandings', this.state.round.id);
  }

  render() {
    let key = -1;
    return (
      <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">Round {this.state.round.roundNumber}</h5>
        </div>
        {this.state.round.realResults.map((result) => {
          key++;
          return (
            <p className="mb-1" key={key}>{result.HostTeam} {result.Host}:{result.Guest} {result.GuestTeam}</p>
          );
        })}
        <a href="#" className="btn btn-primary" onClick={() => { this.openPredictions(); }}>Predictions</a>
        <a href="#" className="btn btn-primary" onClick={() => { this.openRoundStandings(); }}>Round Standings</a>
        <a href="#" className="btn btn-primary" onClick={() => { this.openGenerateStandingsOptions(); }}>Generate</a>
        <ErrorAlert errorMsg={this.state.ErrorMsg} />
      </a>
    );
  }
}

class RoundsList extends React.Component {

  constructor(props) {
    super();
    this.state = {
      rounds: props.rounds, 
    };
  }

  render() {
    let key = -1;
    return (
      <div className="container">
        <div className="row">
          <div className="list-group">
            {this.state.rounds.map((round) => {
              key++;
              return <RoundListItem round={round} key={key} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = {
  RoundsList,
};
