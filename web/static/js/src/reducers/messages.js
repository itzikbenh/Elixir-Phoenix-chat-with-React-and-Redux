let initialState = {
  messages: [],
  isLoading: true
}
const messages = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MESSAGES_LIST':
      return Object.assign({}, state, {
        messages: action.messages,
        isLoading: false,
      })
    case 'ADD_MESSAGE':
      return Object.assign({}, state, {
        messages: state.messages.concat(action.message)
      })
    case 'RESET_STATE':
      return initialState
    default:
      return state;
  }
}

export default messages
