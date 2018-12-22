import React from 'react';


class RoundListItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      round: props.round
    };
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
        <small>Click for details</small>
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
