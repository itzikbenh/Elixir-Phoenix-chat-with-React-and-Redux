import React from 'react';
import Errors from '../components/errors';
import { connect } from 'react-redux'
import { addRoom, deleteRoom, getRooms } from '../actions/index';
import { hashHistory, Link } from 'react-router';

//Rooms component. Here we present to the User all the rooms available. We don't care if he's the creator of the
//at this point. User can add as many rooms as he want assuming they are unique.
class Rooms extends React.Component {
  constructor(){
    super();
    this.state = {
      buttonText: "Create",
      errors: [],
      room: "",
    }
    this.handleCreateRoom = this.handleCreateRoom.bind(this)
    this.handleDelete     = this.handleDelete.bind(this)
  }
  componentWillMount() {
    //Redux action to getRooms for the user.
    this.props.actions.getRooms();
  }

  handleCreateRoom(e) {
    e.preventDefault(e)
    //At this point we ensured user is logged in so we have his token available
    //in the sessionStorage
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    this.setState({buttonText: "Creating..."})
    $.ajax({
      type: 'POST',
      url: 'http://107.170.1.207/api/rooms/',
      data: {
        token: accessToken,
        room:{
          name: this.state.room,
      }},
      success: function(data) {
        console.log(data);
        this.setState({room: ""}) //So it will clear the text input
        this.setState({buttonText: "Create"})
        let room = {name: data.room.name, userId: data.room.user_id}
        console.log("room created is: ", room)
        this.props.actions.addRoom(room);
      }.bind(this),
      error: function(error) {
        console.log("error: ", error);
        this.setState({buttonText: "Create"})
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
  handleDelete(room, index) {
    console.log("room to delete is: " + room + "," + " at index:" + index);
    let accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    $.ajax({
      type: 'DELETE',
      url: 'http://107.170.1.207/api/rooms/'+encodeURIComponent(accessToken),
      data: {
        room:{
          name: room,
      }},
      success: function(data) {
        this.props.actions.deleteRoom(index)
      }.bind(this),
      error: function(error) {
        console.log(`error: ${error}`);
      }.bind(this),
    });
  }
  render(){
    return (
      <div className="col-md-12">
        <div className="col-md-3 col-md-offset-3 col-sm-6 col-xs-6">
          <Errors errors={this.state.errors}/>
          <form>
            <div className="form-group">
              <input
                className ="form-control"
                type="text"
                placeholder="Create room"
                value={this.state.room}
                onChange={e => this.setState({ room: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-success" onClick={this.handleCreateRoom}>
              {this.state.buttonText}
            </button>
          </form>
         </div>
         <RoomsList rooms={this.props.rooms} handleDelete={this.handleDelete} username={this.props.user.username} userId={this.props.user.id}/>
       </div>
    );
  }
}
//Stateless component for rendering the rooms list. We could have created it as a separate file, but since
//it's not shared in other views/components there is no need. It's up to you to decide.
const RoomsList = (props) => {
  console.log(props.username);
  return (
      <div className="col-md-3 col-sm-6 col-xs-6">
        {props.rooms.map((room, i) =>
          <li className="list-group-item" key={i}>
            <Link to={"/rooms/"+room.name.toLowerCase()}>
              {room.name}
            </Link>
            {/* If user is the creator of the room we will allow him to delete the room */}
            {room.userId === props.userId && props.username === "elixir" ?
              <button onClick={() => props.handleDelete(room.name, i) } className="fa fa-trash-o pull-right" aria-hidden="true">
              </button>
            : null}
          </li>
        )}
      </div>
  );
}

//We subscribe to Redux state. We need the User's and Rooms state. That way we can allow only to
//User's who created the room to delete it.
let mapStateToProps = (state) => {
  return {
    rooms: state.rooms.rooms,
    user: state.user
  };
}
//Anything returned from this function will end up as props.actions and would be available
//to use in our component. This is how we can send actions.
let mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      addRoom:  (room) => { dispatch(addRoom(room)) },
      deleteRoom: (index) => { dispatch(deleteRoom(index)) },
      getRooms: () => { dispatch(getRooms()) }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
