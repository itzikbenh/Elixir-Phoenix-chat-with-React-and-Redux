import React from 'react';
import Errors from '../components/errors';
import { connect } from 'react-redux'
import { setUser } from '../actions/index';

class Update extends React.Component {
  constructor(){
    super();
    this.state = {
      buttonText: "Update",
      flash: null,
      errors: [],
      email: "",
      username: ""
    }
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  componentWillMount() {
    this.fetchUsersData();
  }
  //We fetch User's data to auto fill the update form.
  fetchUsersData() {
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    $.ajax({
      type: 'GET',
      url: "http://107.170.1.207/api/users/"+encodeURIComponent(accessToken)+"/edit",
      success: function(data) {
        console.log("data is: ", data);
        this.setState({email: data.email});
        this.setState({username: data.username});
      }.bind(this),
      error: function(error) {
        console.log(error);
      },
    });
  }
  handleUpdate(e) {
    e.preventDefault();
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    this.setState({buttonText: "Updating..."})
    $.ajax({
      type: 'PATCH',
      url: 'http://107.170.1.207/api/users/'+encodeURIComponent(accessToken),
      data: {
        user:{
          username: this.state.username,
          email: this.state.email,
      }},
      success: function(data) {
        this.setState({buttonText: "Update"})
        console.log(data);
        this.props.actions.setUser(data);
        this.setState({flash: data.flash})
        this.setState({errors: []}) //Just in case we are updating after a previous error
        window.setTimeout(() => this.setState({flash: null}), 1000);
      }.bind(this),
      error: function(error) {
        console.log("errors: ", error);
        this.setState({buttonText: "Update"})
        //Parse the error to an object so we can loop over it.
        let errors = JSON.parse(error.responseText)
        //errors are inside the errors object
        errors     = errors.errors;
        console.log("errors are: ", errors)
        let errorsArray = [];
        for(var key in errors) {
          //If array is bigger than one we need to split it. In this case email might receive
          //an array that consists of two errors.
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
      <div className="col-md-3 update">
        {this.state.flash ? <p className="alert alert-success"> {this.state.flash} </p> : null}
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
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={e => this.setState({username: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-success" onClick={this.handleUpdate}>
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
export default connect(null, mapDispatchToProps)(Update);
