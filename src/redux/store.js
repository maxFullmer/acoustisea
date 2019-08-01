import { createStore, applyMiddleware } from 'redux';
import reduxMiddleWare from 'redux-promise-middleware';

import userReducer from './reducers/userReducer.js';


export default createStore(userReducer, applyMiddleware(reduxMiddleWare));