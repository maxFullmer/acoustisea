import { createStore, applyMiddleWare } from 'redux';
import reduxMiddleWare from 'redux-promise-middleware';
import rootReducer from './reducer.js';

export default createStore(rootReducer, applyMiddleWare(reduxMiddleWare));