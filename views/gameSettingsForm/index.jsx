import React from 'react';

const { SuccessfullAlert, ErrorAlert } = require('./../staticComponents/staticComponents');
const { postRequest } = require('./../../tools/ajax');
const { hostUrlForRequests } = require('./../../tools/settings');
const remote = require('electron').remote;



class GameSettings extends React.Component {
  constructor(props) {
    super();
    this.state = {
      pointsRightResult: '',
      pointsRightFixture: '',
      gameId: props.gameId,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    const me = this;
    event.preventDefault();
    const dataToSend = {
      PointsCorrectResult: this.state.pointsRightResult,
      PointsCorrectFixture: this.state.pointsRightFixture,
      PointsAmountOfGoals: 0,
    };
    let url = hostUrlForRequests + this.state.gameId + '/point/settings/update';

    if (!this.state.gameId) {
      const currentGameId = remote.getGlobal('CurrentSelectedGame').gameId;
      this.setState({
        gameId: currentGameId,
      });
      url = hostUrlForRequests + currentGameId + '/point/settings/update';
    }
    console.log(this.state);

    const preparedData = {
      pointSettingsInfo: JSON.stringify(dataToSend),
    }
    postRequest(preparedData, url, (body) => {
      const parsedBody = JSON.parse(body);
      if (parsedBody.Success) {
        me.setState({
          SuccessfulMsg: parsedBody.Msg,
          ErrorMsg: '',
        });
      } else if (parsedBody.Error) {
        me.setState({
          ErrorMsg: parsedBody.Msg,
          SuccessfulMsg: '',
        });
      }
    });
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="pointsRightResult">
            Points for right result:
            <input name="pointsRightResult" aria-describedby="pointsRightResultHelp" placeholder="" className="form-control" type="text" value={this.state.value} onChange={this.handleChange} />
            <small id="pointsRightResultHelp" className="form-text text-muted"> Points to give for right result. </small>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="name">
            Points for right fixture:
            <input name="pointsRightFixture" aria-describedby="pointsRightFixtureHelp" placeholder="" className="form-control" type="text" value={this.state.value} onChange={this.handleChange} />
            <small id="pointsRightFixtureHelp" className="form-text text-muted"> Points to give for right fixture. </small>
            </label>
          </div>
          <input type="submit" className="btn btn-primary" value="Set" />
        </form>
        <div className="alert alert-secondary" role="alert">
          You have to be admin to modify this
        </div>
        <SuccessfullAlert successfulMsg={this.state.SuccessfulMsg} />
        <ErrorAlert errorMsg={this.state.ErrorMsg} />
      </div>
    );
  }
}

module.exports = {
    GameSettings,
};
