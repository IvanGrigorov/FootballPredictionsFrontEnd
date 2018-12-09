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
      <div className="list-group">
        <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">Round {this.state.round.id}</h5>
          </div>
          {this.state.round.realResults.map((result) => {
            key++;
            return (
              <p className="mb-1" key={key}>{result.HostTeam} {result.Host}:{result.Guest} {result.GuestTeam}</p>
            );
          })}
          <small>Click for details</small>
        </a>
      </div>
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
    console.log(this.state.rounds);
    let key = -1;
    return (
      <div className="container">
        <div className="row">
          {this.state.rounds.map((round) => {
            key++;
            console.log(round);
            return <RoundListItem round={round} key={key} />;
          })}
        </div>
      </div>
    );
  }
}

module.exports = {
  RoundsList,
};
