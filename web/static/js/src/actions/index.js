import { hashHistory } from 'react-router'

//actions that operates on User's state
export const setUser = (user) => {
  return {
    type: 'SET_USER',
    id: user.id,
    username: user.username,
  }
}

export const logOutUser = () => {
  return {
    type: 'LOGOUT_USER'
  }
}

//Async action
export function verifyUserToken(routeType) {
  return function(dispatch) {
    let accessToken = null;
    if(localStorage.getItem('TOKEN_STORAGE_KEY')) {
      accessToken = localStorage.getItem('TOKEN_STORAGE_KEY');
    } else {
      accessToken = sessionStorage.getItem('TOKEN_STORAGE_KEY');
    }
    $.ajax({
      type: 'GET',
      url: 'http://107.170.1.207/api/verifytoken/'+encodeURIComponent(accessToken),
      success: function(data) {
        console.log("data is: ", data);
        sessionStorage.setItem('TOKEN_STORAGE_KEY', accessToken);
        dispatch(setUser(data));
      },
      error: function(error) {
        console.log(error);
        dispatch(logOutUser());
        if(routeType === 'securedRoutes') {
          hashHistory.push('/login');
        }
      },
    });
  }
}
//end

//Actions that operates on Rooms state
export const setRoomsList = (rooms) => {
  return {
    type: 'SET_ROOMS_LIST',
    rooms: rooms
  }
}

export const addRoom = (room) => {
  return {
    type: 'ADD_ROOM',
    room: room
  }
}

export const deleteRoom = (index) => {
  return {
    type: 'DELETE_ROOM',
    index: index
  }
}

//Async action
export function getRooms() {
  return function(dispatch) {
    $.ajax({
      type: 'GET',
      url: "http://107.170.1.207/api/rooms/",
      success: function(data) {
        console.log("data is: ", data);
        let rooms = data.rooms.map(room => {
          return {name: room.name, userId: room.user_id}
        });
        console.log("rooms now: ", rooms)
        //Once we got the rooms we will send an action to set them which
        //cause the rooms view to rerender since it subscribed to the rooms state
        dispatch(setRoomsList(rooms));
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
}
//end

//actions that operates on messages state
export const setMessagesList = (messages) => {
  return {
    type: 'SET_MESSAGES_LIST',
    messages: messages
  }
}

export const addMessage = (message) => {
  return {
    type: 'ADD_MESSAGE',
    message: message
  }
}

export const resetMessagesState = () => {
  return {
    type: 'RESET_STATE',
  }
}
//end
