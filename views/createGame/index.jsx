import React from 'react';

const { SuccessfullAlert, ErrorAlert, Loading } = require('./../staticComponents/staticComponents');
const { postRequest } = require('./../../tools/ajax');
const { hostUrlForRequests } = require('./../../tools/settings');
const { ipcRenderer } = require('electron');
const remote = require('electron').remote;


class CreateGame extends React.Component {
  constructor() {
    super();
    this.state = {
      SuccessfulMsg: '',
      ErrorMsg: '',
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    if (!remote.getGlobal('UserInfo') ||
      !(remote.getGlobal('UserInfo').Msg.role === 'ADMIN')) {
      me.setState({
        ErrorMsg: 'You are not admin !',
        SuccessfulMsg: '',
      });
      return;
    }
    this.setState({ loading: true });
    const dataToSend = {
      gameName: this.state.gameName,
    };
    const urlToCreateGame = hostUrlForRequests + 'insertGame';
    postRequest(dataToSend, urlToCreateGame, (body) => {
      ipcRenderer.send('showGames');
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
      this.setState({ loading: false });
      setTimeout(() => { me.setState({ ErrorMsg: '', SuccessfulMsg: '' }); }, 3000);
    });
  }

  render () {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="gameName">
              Game Name:
              <input name="gameName" aria-describedby="gameName" placeholder="" className="form-control" type="text" onChange={this.handleChange} />
              <small id="gameNameHelp" className="form-text text-muted"> Name of the game. </small>
            </label>
          </div>
          <input type="submit" className="btn btn-primary" value="Create" />
        </form>
        <div className="alert alert-secondary" role="alert">
          You have to be admin to modify this
        </div>
        <SuccessfullAlert successfulMsg={this.state.SuccessfulMsg} />
        <ErrorAlert errorMsg={this.state.ErrorMsg} />
        <Loading loading={this.state.loading} loaded={false} />
      </div>
    );
  }
}

module.exports = {
  CreateGame,
};
