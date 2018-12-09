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
    return (<div className="alert alert-success loadingInfo" role="alert">
      {props.successfulMsg}
    </div>);
  },
  ErrorAlert: (props) => {
    if (!props.errorMsg) {
      return null;
    }
    return (<div className="alert alert-danger loadingInfo" role="alert">
      {props.errorMsg}
    </div>);
  },
  Loading: (props) => {
    console.log(props);
    if (props.loading) {
      return (
        <div className="alert alert-warning loadingInfo" role="alert">
          Loading...
        </div>
      );
    }
    else if (props.loaded) {
      return (
        <div className="alert alert-success loadingInfo" role="alert">
          Loaded !
        </div>
      );
    }
    return null;
  },
};
