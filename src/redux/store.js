import { combineReducers, createStore, applyMiddleware } from 'redux';
import reduxMiddleWare from 'redux-promise-middleware';

import userReducer from './reducers/userReducer.js';
import acousticDataReducer from './reducers/acousticDataReducer.js';

const rootReducer = combineReducers({
    user: userReducer,
    acousticData: acousticDataReducer
})

export default createStore(rootReducer, applyMiddleware(reduxMiddleWare));