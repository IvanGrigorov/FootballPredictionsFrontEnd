import React from 'react';

const PredictionListItem = (props) => (
    <div className="list-group">
        <button type="button" className="list-group-item list-group-item-action">
            <span>{props.title.title}</span>
        </button>
    </div>
);


module.exports = {
    PredictionList: (props) => (
        <div className="list-group">
            {props.predictions.map((prediction) => <PredictionListItem title={prediction} key={prediction.title} />)}
        </div>
    ),
};

