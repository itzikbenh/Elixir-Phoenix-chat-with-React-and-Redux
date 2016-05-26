let initialState = {
  isLoggedIn: false,
};

const user = (state = initialState , action) => {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, {
        id: action.id,
        username: action.username,
        isLoggedIn: true,
      })
    case 'LOGOUT_USER':
      return initialState;
    default:
      return state;
  }
}

export default user
