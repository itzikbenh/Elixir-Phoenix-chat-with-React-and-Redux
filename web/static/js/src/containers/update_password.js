import React from 'react';
import Errors from '../components/errors';

//We have no need in this component to subscribe to Redux state or send actions.
//We don't want to store the User's passwords in our state. Very bad idea.
//NOTE - this is technically a component and not a container, but because it makes calls to the
//API I decided to put it in the containers folder. It really doesn't matter.
export default class UpdatePassword extends React.Component {
  constructor(){
    super();
    this.state = {
      buttonText: "Update",
      currentPassword: "",
      errors: [],
      flash: null,
      password: "",
      password_confirmation: ""
    }
    this.handleRegistration = this.handleRegistration.bind(this)
  }

  handleRegistration(e) {
    e.preventDefault();
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    this.setState({buttonText: "Updating..."})
    $.ajax({
      type: 'PATCH',
      url: 'http://107.170.1.207/api/users/updatepassword/'+encodeURIComponent(accessToken),
      data: {
        user:{
          currentPassword: this.state.currentPassword,
          password: this.state.password,
          password_confirmation: this.state.password_confirmation,
      }},
      success: function(data) {
        console.log(data);
        this.setState({buttonText: "Update"})
        this.setState({flash: data.flash})
        this.setState({errors: []}) //Just in case we are updating after a previous error
        window.setTimeout(() => this.setState({flash: null}), 1000);
      }.bind(this),
      error: function(error) {
        console.log("original error: ", error);
        this.setState({buttonText: "Update"})
        //In case of invalid current password we will have only one possible error from the backend
        if(error.responseText === "invalid password") {
            return this.setState({errors: ["invalid current password"]});
        } else {
            this.setState({error: ""})
        }
        //Parse the error to an object so we can loop over it.
        let errors = JSON.parse(error.responseText)
        //errors are inside the errors object
        errors     = errors.errors;
        let errorsArray = [];
        for(var key in errors) {
          //If array is bigger than one we need to split it.
          if(errors[key].length > 1) {
            errors[key].map(error => errorsArray.push(`${key} ${error}`));
          } else {
            errorsArray.push(`${key} ${errors[key]}`);
          }
        }
        //Now we can set the array of errors we created.
        this.setState({errors: errorsArray})
      }.bind(this),
    });
  }
  render(){
    return (
      <div className="col-md-3 updatePassword">
        {this.state.flash ? <p className="alert alert-success"> {this.state.flash} </p> : null}
        <Errors errors={this.state.errors}/>
        <form>
          <div className="form-group">
            <input
              className ="form-control"
              type="password"
              placeholder="Current Password"
              value={this.state.currentPassword}
              onChange={e => this.setState({currentPassword: e.target.value})} />
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
              className ="form-control"
              type="password"
              placeholder="Confirm Password"
              value={this.state.password_confirmation}
              onChange={e => this.setState({password_confirmation: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-success" onClick={this.handleRegistration}>
            {this.state.buttonText}
          </button>
        </form>
       </div>
    );
  }
}
