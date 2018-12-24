import React from 'react';
import { ipcRenderer } from 'electron';


class RoundListItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      round: props.round
    };
    this.openPredictions = this.openPredictions.bind(this);
    this.openRoundStandings = this.openRoundStandings.bind(this);
  }

  openPredictions() {
    ipcRenderer.send('openPredictions', this.state.round.id);
  };

  openRoundStandings() {
    console.log('Show standings', this.state.round.id);
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
