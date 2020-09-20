/*
    This file is the container of the state.
*/

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// each reduce file handles the actions related to data, user and ui respectively
import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';

const initialState = {};

const middleware = [thunk]; // array

const reducers = combineReducers({ // actual state
    user: userReducer, // everything that comes from userReducer will be stored inside user object
    data: dataReducer,
    ui: uiReducer
});

const store = createStore(
    reducers, 
    initialState, 
    compose(
        applyMiddleware(...middleware), 
        /*
            IMPORTANT: Next line is only valid for development environment in Google Chrome because it 
            causes error (TypeError: Cannot read property ‘apply’ of undefined) in all browsers except 
            Chrome with Redux DevTools extention installed. It should be deleted in production.
            
            https://medium.com/@koopdev/for-everyone-experiencing-the-typeerror-cannot-read-property-apply-of-undefined-in-29afe42a4095
        */
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // https://github.com/zalmoxisus/redux-devtools-extension#11-basic-store (for Chrome Redux DevTools extention)
    )
);

export default store;