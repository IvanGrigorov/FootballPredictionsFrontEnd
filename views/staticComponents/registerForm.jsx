import React from 'react';

//const 
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: '',
      Password: '',
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
    event.preventDefault();
    console.log('Register');
    console.log('Name' + this.state.UserName);
    console.log('Password' + this.state.Password);
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
    </div>
    );
  }
}

module.exports = {
  RegisterForm,
};
