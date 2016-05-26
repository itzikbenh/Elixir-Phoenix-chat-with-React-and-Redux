import React from 'react';
import Errors from '../components/errors';
import { connect } from 'react-redux'
import { setUser } from '../actions/index';
import { hashHistory } from 'react-router';

class Login extends React.Component {
  constructor(){
    super();
    this.state = {
      buttonText: "Login",
      errors: [],
      email: "",
      password: "",
      rememberMe: false,
    }
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({buttonText: "Logging in..."})
    $.ajax({
      type: 'POST',
      url: "http://localhost:4000/api/sessions",
      data: {
        session:{
          email: this.state.email,
          password: this.state.password,
        }
      },
      success: function(data) {
        console.log("data is: ", data);
        let accessToken = data.token;
        if(this.state.rememberMe) {
            localStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
            sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        } else {
            sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        }
        //setUser action
        this.props.actions.setUser(data);
        hashHistory.push('/')
      }.bind(this),
      error: function(error) {
        let errors = error.responseText;
        this.setState({buttonText: "Login"})
        this.setState({errors: [errors]})
      }.bind(this),
    });
  }

  render(){
    return (
      <div className="login col-md-3">
        <Errors errors={this.state.errors}/>
        <form>
          <div className="form-group">
            <input
              className ="form-control"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={e => this.setState({email: e.target.value})} />
          </div>
          <div className="form-group">
            <input
              className ="form-control"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={e => this.setState({password: e.target.value})} />
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              checked={this.state.rememberMe}
              onClick={e => this.setState({rememberMe: e.target.checked})} />
            <span> Remember me</span>
            <br/>
            {/* Just so you can see that the checkbox really changes the state on each click */}
            {this.state.rememberMe ? "checked" : "not checked"}
          </div>
          <button type="submit" className="btn btn-success" onClick={this.handleLogin}>
            {this.state.buttonText}
          </button>
        </form>
      </div>
    );
  }
}

//Anything returned from this function will end up as props.actions and would be available
//to use in our component. This is how we can send actions.
let mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      setUser: (user) => { dispatch(setUser(user)) }
    }
  }
}
//FIrst argument always is "mapStateToProps", but since we don't need to subscribe to Redux state
//we just pass null instead.
export default connect(null, mapDispatchToProps)(Login);
