let initialState = {
  rooms: [],
}

const rooms = (state = initialState , action) => {
  switch (action.type) {
    case 'ADD_ROOM':
      return Object.assign({}, state, {
        rooms: state.rooms.concat(action.room)
      })
    case 'DELETE_ROOM':
      return Object.assign({}, state, {
        rooms: state.rooms.slice(0, action.index).concat(state.rooms.slice(action.index + 1))
      })
    case 'SET_ROOMS_LIST':
      return Object.assign({}, state, {
        rooms: action.rooms
      })
    default:
      return state;
  }
}

export default rooms
