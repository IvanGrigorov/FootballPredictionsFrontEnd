import React from 'react';

const { postRequest } = require('./../../tools/ajax');
const { hostUrlForRequests } = require('./../../tools/settings');
const { SuccessfullAlert, ErrorAlert, Loading } = require('./staticComponents');


//const 
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: '',
      Password: '',
      loading: false,
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
    me.setState({
      loading: true,
    });
    const dataToSend = {
      username: this.state.UserName,
      password: this.state.Password,
    };
    const url = hostUrlForRequests + 'signUp';
    const callback = function(body) {
      const parsedBody = JSON.parse(body);
      console.log(parsedBody);
      if (parsedBody.Success) {
        me.setState({
          SuccessfulMsg: parsedBody.Msg,
          ErrorMsg: '',
          loading: false,
        });
      } else if (parsedBody.Error) {
        me.setState({
          ErrorMsg: parsedBody.Msg,
          SuccessfulMsg: '',
          loading: false,
        });
      }
    };
    postRequest(dataToSend, url, callback);
  }

  render() {
    return (
    <div className="container">
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Name:
            <input name="UserName" id="name" aria-describedby="nameHelp" placeholder="Enter Username" className="form-control" type="text" value={this.state.value} onChange={this.handleChange} />
            <small id="nameHelp" className="form-text text-muted"> We need your username for login. </small>
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password:
            <input name="Password" id="password" placeholder="Enter Password" className="form-control" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <Loading loading={this.state.loading} loaded={false} />
      <SuccessfullAlert successfulMsg={this.state.SuccessfulMsg} />
      <ErrorAlert errorMsg={this.state.ErrorMsg} />
    </div>
    );
  }
}

module.exports = {
  RegisterForm,
};
