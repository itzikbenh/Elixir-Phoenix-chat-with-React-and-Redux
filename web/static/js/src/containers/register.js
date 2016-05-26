import React from 'react';
import Errors from '../components/errors';
import { connect } from 'react-redux';
import { setUser } from '../actions/index';
import { hashHistory } from 'react-router';

class Register extends React.Component {
  constructor(){
    super();
    this.state = {
      buttonText: "Register",
      email: "",
      errors: [], //errors that might come from the backend
      password: "",
      password_confirmation: "",
      username:"",
      //Temporary fields to store errors that we handle on the client side.
      emailError: "",
      passwordError: "",
      password_confirmationError: "",
      usernameError: "",
    }
    this.handleEmailChange                = this.handleEmailChange.bind(this)
    this.handleUserNameChange             = this.handleUserNameChange.bind(this)
    this.handlePasswordChange             = this.handlePasswordChange.bind(this)
    this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this)
    this.handleRegistration               = this.handleRegistration.bind(this)
  }

  //The next 4 methods will handle user's input and update the state accordingly including form validation
  handleEmailChange(event) {
    this.setState({email: event.target.value})

    if(event.target.value.length < 3){
        this.setState({emailError: "Email must be at least 3 characters"})
    } else {
        this.setState({emailError: ""})
    }
  }
  handleUserNameChange(event) {
    this.setState({username: event.target.value})

    if(event.target.value.length < 3){
        this.setState({usernameError: "Username must be at least 3 characters"})
    } else {
        this.setState({usernameError: ""})
    }
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value})

    if(event.target.value.length < 6) {
        this.setState({passwordError: "Password must be at least 6 characters"})
    } else {
        this.setState({passwordError: ""})
    }

    if(event.target.value.length >= 6 && event.target.value === this.state.password_confirmation) {
        this.setState({password_confirmationError: ""})
    } else {
        this.setState({password_confirmationError: "Password confirmation must match"})
    }
  }
  handlePasswordConfirmationChange(event) {
    this.setState({password_confirmation: event.target.value})

    if(this.state.password !== event.target.value) {
        this.setState({password_confirmationError: "Password confirmation must match"})
    } else {
        this.setState({password_confirmationError: ""})
    }
  }
  //Will make sure all inputs are valid and send the data to the backend
  handleRegistration(e) {
    e.preventDefault();

    let email                 = this.state.email;
    let username              = this.state.username;
    let password              = this.state.password;
    let password_confirmation = this.state.password_confirmation;

    if(email.length < 3 || username.length < 1 || password.length < 6 || password !== password_confirmation) {
      return this.setState({errors: ["please make sure all fields are filled correctly."]});
    }

    this.setState({buttonText: "Registering..."})
    $.ajax({
      type: 'POST',
      url: "http://localhost:4000/api/users",
      data: {
        user:{
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
          password_confirmation: this.state.password_confirmation,
      }},
      success: function(data) {
        console.log(data);
        let accessToken = data.token;
        sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        this.props.actions.setUser(data);
        hashHistory.push('/')
      }.bind(this),
      error: function(error) {
        this.setState({buttonText: "Register"})
        //Parse the error to an object so we can loop over it.
        let errors = JSON.parse(error.responseText)
        //errors are inside the errors object
        errors     = errors.errors;
        console.log("errors are: ", errors)
        let errorsArray = [];
        for(var key in errors) {
          errorsArray.push(`${key} ${errors[key]}`);
        }
        //Now we can set the array of errors we created.
        this.setState({errors: errorsArray})
      }.bind(this),
    });
  }
  render(){
    return (
      <div className="register col-md-4">
        <Errors errors={this.state.errors}/>
        <form>
          <div className="form-group">
            <p className="registerFormErrors">{this.state.emailError}</p>
            <input
              className ="form-control"
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleEmailChange} />
          </div>

          <div className="form-group">
            <p className="registerFormErrors">{this.state.usernameError}</p>
            <input
              className ="form-control"
              type="text"
              placeholder="Username"
              value={this.state.name}
              onChange={this.handleUserNameChange} />
          </div>

          <div className="form-group">
            <p className="registerFormErrors">{this.state.passwordError}</p>
            <input
              className ="form-control"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange} />
          </div>

          <div className="form-group">
            <p className="registerFormErrors">{this.state.password_confirmationError}</p>
            <input
              className ="form-control"
              type="password"
              placeholder="Confirm Password"
              value={this.state.password_confirmation}
              onChange={this.handlePasswordConfirmationChange} />
          </div>

          <button type="submit" className="btn btn-success" onClick={this.handleRegistration}>
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
export default connect(null, mapDispatchToProps)(Register);
