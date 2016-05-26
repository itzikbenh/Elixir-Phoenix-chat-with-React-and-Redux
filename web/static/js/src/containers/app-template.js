import React from 'react';
import Navbar from './navbar';
import { connect } from 'react-redux'
import { verifyUserToken } from '../actions/index';

class AppTemplate extends React.Component {
  //When User first hits the app we want to try to verify him so we can log him in right away.
  componentWillMount() {
    this.props.actions.verifyUserToken();
  }

  //renders the Nav component and all the childrens we defined in the routes in the App.js file.
  render() {
    return (
      <div className="container">
        <Navbar />
        { this.props.children }
      </div>
    );
  }
}

//Here we define all actions we might need.
let mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      verifyUserToken: () => { dispatch(verifyUserToken()) }
    }
  }
}

//FIrst argument always is "mapStateToProps", but since we don't need to subscribe to Redux state
//we just pass null instead.
export default connect(null, mapDispatchToProps)(AppTemplate);
