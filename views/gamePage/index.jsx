import React from 'react';
const { GamesList } = require('./../games/index');
const { CreateGame } = require('./../createGame/index');

const GamePage = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-8">
          <GamesList />
        </div>
        <div className="col-4">
          <CreateGame />
        </div>
      </div>
    </div>
  );
};

module.exports = {
  GamePage,
};
