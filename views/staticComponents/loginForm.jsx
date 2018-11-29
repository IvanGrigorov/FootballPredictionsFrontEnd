import React from 'react';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: '',
      Password: '',
      SuccessfulMsg: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event);
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    console.log('Login');
    event.preventDefault();
    console.log('Name' + this.state.UserName);
    console.log('Password' + this.state.Password);
    this.setState({
      SuccessfulMsg: 'Hooray Hooray !',
    });
    this.setState({
      ErrorMsg: 'No No !',
    });
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
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <SuccessfullAlert successfulMsg={this.state.SuccessfulMsg} />
      <ErrorAlert errorMsg={this.state.ErrorMsg} />
    </div>
    );
  }
} 

function SuccessfullAlert(props) {
  if (!props.successfulMsg) {
    return null;
  }
  return (<div className="alert alert-success" role="alert">
    {props.successfulMsg}
  </div>);
}

function ErrorAlert(props) {
  if (!props.errorMsg) {
    return null;
  }
  return (<div className="alert alert-danger" role="alert">
    {props.errorMsg} 
  </div>);
}

module.exports = {
  LoginForm,
};
