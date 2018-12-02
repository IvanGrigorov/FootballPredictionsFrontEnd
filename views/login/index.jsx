import React from 'react';

const { LoginForm } = require('./../staticComponents/loginForm');
const { RegisterForm } = require('./../staticComponents/registerForm');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { View: 'Login' };
    this.changeViewState = this.changeViewState.bind(this);
  }

  changeViewState(viewState) {
    this.setState(viewState);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-primary" onClick={() => this.changeViewState({ View: 'Login' })}>Login</button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-primary" onClick={() => this.changeViewState({ View: 'Register' })}>Register</button>
          </div>
        </div>
        <div className="row">
          {(this.state.View === 'Login') ? <LoginForm /> : null}
          {(this.state.View === 'Register') ? <RegisterForm /> : null}
        </div>
      </div>
    );
  }
}

module.exports = {
  Login,
};
