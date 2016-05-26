import { combineReducers } from 'redux';
import user from './user';
import rooms from './rooms';
import messages from './messages';

const chatApp = combineReducers({
  user,
  rooms,
  messages
})

export default chatApp
