import React from 'react';
import { Link } from 'react-router';

export default () => {
  return (
    <div className="center jumbotron">
      <h1 className="jumboTitle">Elixir Phoenix - I got your back!</h1>
      <h1 className="jumboTitle">React&Redux - I got your front!</h1>
      <Link to="/rooms"><button className="btn btn-primary btn-lg"><h2>Start socializing!</h2></button></Link>
    </div>
  );
}
