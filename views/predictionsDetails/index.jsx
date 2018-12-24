import React from 'react';

const { ipcRenderer } = require('electron');
const { Loading, ErrorAlert, SuccessfullAlert } = require('./../staticComponents/staticComponents');
const { postRequest, getRequest } = require('./../../tools/ajax');
const { hostUrlForRequests } = require('./../../tools/settings');
const remote = require('electron').remote;


class Predictions extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loaded: false,
      predictions: [],
      predictionsToEdit: [],
      edditedPredictions: [],
      errorMsg: '',
      successfulMsg: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.convertEdditedData = this.convertEdditedData.bind(this);
    this.prepareSubmit = this.prepareSubmit.bind(this);
  }

  componentWillMount() {
    const me = this;
    ipcRenderer.send('getPredictionsIfAny');
    ipcRenderer.on('loadedPredictions', (event, data) => {
      if (data.length) {
        this.setState({
          predictions: data,
          loading: false,
          loaded: true,
        });
        setTimeout(() => {
          me.setState({
            loaded: false,
          });
        }, 2000);
      }
      else {
        ipcRenderer.send('getRoundTeams');
      }
    });

    ipcRenderer.on('loadedRoundTeams', (event, data) => {
      if (data.length) {
        this.setState({
          predictionsToEdit: data,
        });
      }
      this.setState({
        predictionsToEdit: data,
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
    if (!this.state.edditedPredictions[roundTeamsId]) {
      this.state.edditedPredictions[roundTeamsId] = {};
      this.state.edditedPredictions[roundTeamsId].roundTeamsId = roundTeamsId;
    }
    this.state.edditedPredictions[roundTeamsId][name] = value;
  }

  convertEdditedData() {
    const dataToSend = [];
    this.state.edditedPredictions.forEach(edditedPrediction => {
      dataToSend.push(edditedPrediction);
    });
    return dataToSend;
  }

  prepareSubmit(event) {
    event.preventDefault();
    const me = this;
    let lengthOfPreparedPredictions = 0;
    this.state.edditedPredictions.forEach((edditedPrediction) => {
      if (edditedPrediction.host && edditedPrediction.guest) {
        lengthOfPreparedPredictions++;
      }
    });
    const dialogOptions = { type: 'info',
      buttons: ['OK', 'Cancel'],
      message: 'You have eddited only ' + lengthOfPreparedPredictions + ' fixtures out of ' + this.state.predictionsToEdit.length + ' ?' };
    const dialog = remote.dialog;
    dialog.showMessageBox(dialogOptions, (i) => {
      if (!i) {
        me.handleSubmit(event);
      }
    });
  }

  handleSubmit() {
    const me = this;
    this.setState({ loading: true });
    const currentRoundId = remote.getGlobal('CurrentSelectedRound');
    const urlToGivePredictions = hostUrlForRequests + currentRoundId + '/predictions/insert';
    const dataToSend = JSON.stringify(this.convertEdditedData());
    postRequest(dataToSend, urlToGivePredictions, (body) => {
      const parsedBody = JSON.parse(body);
      if (parsedBody.Error) {
        me.setState({
          errorMsg: parsedBody.Msg,
          loading: false,
        });
      }
      else {
        me.setState({ 
          successfulMsg: parsedBody.Msg,
          loading: false,
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container">
          <div className="alert alert-warning" role="alert">
            Getting predictions Info...
          </div>
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    }
    else if (this.state.predictions.length) {
      return (
        <div className="container">
          <ul className="list-group">
            {this.state.predictions.map((prediction) => {
              return <li className="list-group-item">{prediction.HostName} {prediction.Host} : {prediction.GuestName} {prediction.Guest}</li>
            })}
          </ul>
          <div className="alert alert-success" role="alert">
            You completed your predictions for the game !
          </div>
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    } else if (this.state.predictionsToEdit.length) {
      return (
        <div className="container">
          <form onSubmit={this.prepareSubmit}>
            <ul className="list-group">
              {this.state.predictionsToEdit.map((predictionToEdit) => {
                return <PredictionsEditItem handleOnChange={this.handleOnChange} predictionToEdit={predictionToEdit} key={predictionToEdit.id} />;
              })}
            </ul>
            <input type="submit" className="btn btn-primary" value="Predict" />
          </form>
          <SuccessfullAlert successfulMsg={this.state.successfulMsg} />
          <ErrorAlert errorMsg={this.state.errorMsg} />
          <Loading loaded={this.state.loaded} loading={this.state.loading} />
        </div>
      );
    }
    return (
      <div className="container">
        <div className="alert alert-secondary" role="alert">
          Teams for round are not given.
        </div>
        <Loading loaded={this.state.loaded} loading={this.state.loading} />
      </div>
    );
  }

}

const PredictionsEditItem = (props) => {
  return (
    <div className="form-group row">
      <label htmlFor="inputHost" className="col-2 col-form-label">{props.predictionToEdit.host}</label>
      <div className="col-3">
        <input name="host" type="number" onChange={(event) => { props.handleOnChange(props.predictionToEdit.id, event); }} className="form-control" id="inputHost" placeholder="Host" />
      </div>
      -
      <div className="col-3">
        <input name="guest" type="number" onChange={(event) => { props.handleOnChange(props.predictionToEdit.id, event); }} className="form-control" id="inputGuest" placeholder="Guest" />
      </div>
      <label htmlFor="inputGuest" className="col-2 col-form-label">{props.predictionToEdit.guest}</label>
    </div>
  );
};


module.exports = {
  Predictions,
};
