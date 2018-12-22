import React from 'react';

const { postRequest, getRequest } = require('./../../tools/ajax');
const { hostUrlForRequests } = require('./../../tools/settings');
const { SuccessfullAlert, Loading, ErrorAlert } = require('./../staticComponents/staticComponents');
const remote = require('electron').remote;


class NewRoundForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      idToInsert: props.idToInsert,
      teamsFormLenght: 10,
      rowsData: [],
      until: '',
      successfulMsg: '',
      errorMsg: '',
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.prepareRoundFormRows = this.prepareRoundFormRows.bind(this);
    this.prepareSubmit = this.prepareSubmit.bind(this);
    this.testUntilForRightSyntax = this.testUntilForRightSyntax.bind(this);
  }

  prepareRoundFormRows() {
    const roundFormsRowsArray = [];
    for (let index = 0; index < this.state.teamsFormLenght; index++) {
      roundFormsRowsArray.push(<RoundFormRow key={index} idKey={index} handleChange={this.handleChange} />);
    }
    return roundFormsRowsArray;
  }

  prepareSubmit(event) {
    event.preventDefault();
    if (!this.testUntilForRightSyntax()) {
      this.setState({ errorMsg: 'Until date is invalid !' });
      return;
    }
    this.setState({ errorMsg: '' });
    const me = this;
    let lengthOfPreparedTeams = 0;
    this.state.rowsData.forEach((element) => {
      if (element.Host && element.Guest) {
        lengthOfPreparedTeams++;
      }
    });

    const dialogOptions = { type: 'info',
      buttons: ['OK', 'Cancel'],
      message: 'The round will have only ' + lengthOfPreparedTeams + ' fixtures ?' };
    const dialog = remote.dialog;
    dialog.showMessageBox(dialogOptions, (i) => {
      if (!i) {
        me.handleSubmit(event);
      }
    });
  }

  handleSubmit(event) {
    const me = this;
    const currentGameName = remote.getGlobal('CurrentSelectedGame').gameName;
    const currentGameRoundNumber = remote.getGlobal('CurrentSelectedGame').roundNumber;

    const urlToCreateRound = hostUrlForRequests + 'round/create';
    const dataToSend = {
      gameName: currentGameName,
      roundNumber: currentGameRoundNumber + 1,
    };
    me.setState({ loading: true });
    postRequest(dataToSend, urlToCreateRound, (body) => {
      const parsedBody = JSON.parse(body);
      const insertedRound = parsedBody.Msg.Msg;
      const promiseCollection = [];
      me.state.rowsData.forEach(element => {
        if (element.Host && element.Guest) {
          const urlToAddTeamsForRoumd = hostUrlForRequests + insertedRound + '/teams/insert';
          const teamsDataToSend = {
            host: element.Host,
            guest: element.Guest,
          };
          promiseCollection.push(new Promise((resolve, reject) => {
            postRequest(teamsDataToSend, urlToAddTeamsForRoumd, (body) => {
              resolve();
            });
          }));
        }
      });
      Promise.all(promiseCollection).then(() => {
        const urlToAddPredictionSettings = hostUrlForRequests + insertedRound + '/predictions/settings/insert';
        const predictionsSettingsDataToSend = {
          until: me.state.until,
        };
        postRequest(predictionsSettingsDataToSend, urlToAddPredictionSettings, (body) => {
          me.setState({
            loading: false,
            successfulMsg: 'Teams Inserted Successfully',
          });
          setTimeout(() => {
            me.setState({
              successfulMsg: '',
            });
          }, 2000);
        });
      });
    });
  }

  handleChange(key, event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (!this.state.rowsData[key]) {
      this.state.rowsData[key] = {};
    }
    this.state.rowsData[key][name] = value;
  }

  handleUntil(event) {
    const target = event.target;
    const value = target.value;
    this.setState({ until: value });
  }

  testUntilForRightSyntax() {
    const regexForRightDateSyntax = RegExp('^[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}$', 'gmi');
    if (this.state.until.match(regexForRightDateSyntax)) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.prepareSubmit}>
          {this.prepareRoundFormRows()}
          <div className="row">
            <div className="col">
              <input name="until" type="text" onChange={(event) => { this.handleUntil(event); }} className="form-control" placeholder="Until" />
            </div>
          </div>
          <input type="submit" className="btn btn-primary" value="Create Round" />
        </form>
        <SuccessfullAlert successfulMsg={this.state.successfulMsg} />
        <ErrorAlert errorMsg={this.state.errorMsg} />
        <Loading loading={this.state.loading} loaded={false} />
      </div>
    );
  }


}

class RoundFormRow extends React.Component {

  constructor(props) {
    super();
    this.state = {
      key: props.idKey,
      handleChange: props.handleChange,
    };
  }
  render() {
    return (
      <div className="row">
        <div className="col">
          <input name="Host" type="text" onChange={(event) => this.state.handleChange(this.state.key, event)} className="form-control" placeholder="Host name" />
        </div> -
        <div className="col">
          <input name="Guest" type="text" onChange={(event) => this.state.handleChange(this.state.key, event)} className="form-control" placeholder="Guest name" />
        </div>
      </div>
    );
  }
}

module.exports = {
  NewRoundForm,
};

