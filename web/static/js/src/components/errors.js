import React from 'react';

//Stateless component for errors storage. This will hold the backend errors.
export default (props) => {
  return (
      <div className="errors"> 
        {props.errors.map((error, i) => <li className="list-group-item list-group-item-danger" key={i}> {error} </li>)}
      </div>
  );
}
