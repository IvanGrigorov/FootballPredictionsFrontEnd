import React from 'react';
import PropTypes from 'prop-types';

const { ipcRenderer } = require('electron');


const StandingsListItem = props => (
  <div className="list-group">
    <button type="button" className="list-group-item list-group-item-action">
      <span>{props.standing.name}</span> <span>{props.standing.points}</span>
    </button>
  </div>
);

StandingsListItem.propTypes = {
  standing: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

class StandingsList extends React.Component {
  constructor() {
    super();
    this.state = { standings: [] };
    this.changeViewState = this.changeViewState.bind(this);
  }

  componentDidMount() {
    const self = this;
    ipcRenderer.on('sendStandingsData', (event, data) => {
      console.log(JSON.stringify(data));
      console.log('Message received');
      self.changeViewState({ standings: data });
    });
  }

  changeViewState(viewState) {
    this.setState(viewState);
  }

  render() {
    return (
      <div className="list-group">
        {this.state.standings.map(standing =>
          <StandingsListItem standing={standing} key={standing.name} />)}
      </div>
    );
  }
}

module.exports = {
  StandingsList,
};
