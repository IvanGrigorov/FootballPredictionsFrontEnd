import React from 'react';

module.exports = {
  Header: () => (
    <div className="alert alert-success" role="alert">
            Welcome to the football prediction app.
    </div>
    ),

  SuccessfullAlert: (props) => {
    if (!props.successfulMsg) {
      return null;
    }
    return (<div className="alert alert-success" role="alert">
      {props.successfulMsg}
    </div>);
  },
  ErrorAlert: (props) => {
    if (!props.errorMsg) {
      return null;
    }
    return (<div className="alert alert-danger" role="alert">
      {props.errorMsg}
    </div>);
  },
};
