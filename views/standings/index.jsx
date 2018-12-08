import React from 'react';
import PropTypes from 'prop-types';


const StandingsListItem = props => (
  <div className="list-group">
    <button type="button" className="list-group-item list-group-item-action">
      <span>{props.standing.name}</span> <span style={{ float: 'right' }}>{props.standing.Points}</span>
    </button>
  </div>
);

StandingsListItem.propTypes = {
  standing: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

class StandingsList extends React.Component {
  constructor(props) {
    super();
    this.state = { standings: props.standings };
    this.changeViewState = this.changeViewState.bind(this);
  }

  changeViewState(viewState) {
    this.setState(viewState);
  }

  render() {
    let standingsId = 0;
    return (
      <div className="list-group">
        <StandingsListItem standing={{ name: 'Name', Points: 'Points' }} key={standingsId} />
        {this.state.standings.map((standing) => {
          standingsId += 1;
          return <StandingsListItem standing={standing} key={standingsId} />
        })}
      </div>
    );
  }
}

module.exports = {
  StandingsList,
};
