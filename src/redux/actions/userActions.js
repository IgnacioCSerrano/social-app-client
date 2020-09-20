import { 
    SET_USER, 
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    SET_EXPIRED,
    UPDATE_SCREAMS_IMAGE,
    MARK_NOTIFICATIONS_READ,
    SET_ERRORS, 
    CLEAR_ERRORS, 
    LOADING_UI, 
    LOADING_USER
} from '../types';

import jwtDecode from 'jwt-decode';
import axios from 'axios'; // npm install axios (promise based HTTP client)

// import { getScreams } from './dataAction';

const setAuthorisationHeader = token => {
    const fbIdToken = `Bearer ${token}`;
    localStorage.setItem('fbIdToken', fbIdToken);
    /*
        Apart from storing it in local storage, we need to add the authorisation header (token) 
        to each request sent to a protected route, but it wouldn't be efficient to add it with
        each request, so we take advantage of axios header property.
    */
    axios.defaults.headers.common['Authorization'] = fbIdToken; // now each time we send a request through axios (even to unprotected routes) it will have an Authorization header with a token value
}

const setUpTimer = (token, history, expTime) => dispatch => {
    const time = !expTime 
        ? jwtDecode(token).exp * 1000 - Date.now()
        : expTime;
    const timer = setTimeout( () => {
        dispatch( checkToken(history) );
    }, time);
    localStorage.setItem('timer', timer);
}

export const checkToken = history => dispatch => {
    const token = localStorage.fbIdToken; // access token stored in local storage after successfully login or signup (we add it there so user is not logged out after refreshing or closing the window)
    if (token) { // inside the decoded token we have an expiry date
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken);
      const expTime = decodedToken.exp * 1000 - Date.now(); // exp property (Epoch time in seconds) stores time of token expiration (one hour)
      if ( expTime <= 0 ) { // if ( decodedToken.exp * 1000 < Date.now() )
        // authenticated = false;
        dispatch( logoutUser() ); // this action deletes the token and logs user out
        
        // alert("Your session has expired. Please log in again.");

        // localStorage.setItem('expired', true);
        // window.location.href = '/login';

        dispatch({ type: SET_EXPIRED });
        history.push('/login');
      } else {
        // authenticated = true;
        dispatch({ type: SET_AUTHENTICATED });
        axios.defaults.headers.common['Authorization'] = token; // axios default headers are gone even after being set (setAuthorisationHeader method in userAction.js) if page is refreshed or closed (axios is reinitiated) so we need to set it again
        dispatch( getUserData() ); // we only fetch user data after successfully authentication
        /*
            Anytime the app is refreshed or closed and opened again, the setTimeout logic scheduled
            on the setUpTimer method (after login or signup) is lost, so we have to start another
            timer here (this method is called by the renderless component CheckToken on start)
        */
        dispatch( setUpTimer(token, history, expTime) );
      }
    }
}

export const getUserData = () => dispatch => { // curried function (https://en.wikipedia.org/wiki/Currying) (we need to use dispatch because we have asynchronous code)
    dispatch({ type: LOADING_USER });
    axios.get('/user')
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data // payload is data (user data in this case) sent to our reducer for him to do something with it
            });
        })
        .catch(err => {
            console.error(err);
        });
}

export const loginUser = (userData, history) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
        .then(res => {
            // console.log(res.data);

            /*
                When we get the token we need to store it in the browser local storage so it will 
                still be available after closing or refreshing the page. It last for one hour.

                To check that token has been correctly stored --> Chrome DevTools (F12) - Application 
                - Local Storage - http://localhost:3000/ (Key/value objet)
            */
            setAuthorisationHeader(res.data.token);
            dispatch( setUpTimer(res.data.token, history) );

            dispatch( getUserData() );
            dispatch({ type: CLEAR_ERRORS });
            history.push('/'); // programatic navigation to home page
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
}

export const signupUser = (newUserData, history) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserData)
        .then(res => {
            // console.log(res.data);

            setAuthorisationHeader(res.data.token);
            dispatch( setUpTimer(res.data.token, history) );

            dispatch( getUserData() );
            dispatch({ type: CLEAR_ERRORS });
            history.push('/');
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
}

export const logoutUser = () => dispatch => {
    localStorage.removeItem('fbIdToken'); // remove token from local storage
    clearTimeout(localStorage.timer);
    localStorage.removeItem('timer');
    delete axios.defaults.headers.common['Authorization']; // remove authorisation header from defaults of axios
    dispatch({ type: SET_UNAUTHENTICATED }); // clear-out user state to initial (userReducer.js)
}

export const uploadImage = (formData, userHandle) => dispatch => {
    dispatch({ type: LOADING_USER });
    axios.post('/user/image', formData)
        .then(res => {
            dispatch( getUserData() ); // dispatching getUserData action allows to show new profile image on the spot after uploading it whitout refreshing

            /*
                Once the user profile image has been updated we want our page to show the new image on all their screams.
                We have set a Cloud Function database trigger to perform such task, but it is interesting from a UX point 
                of view to let the user experience the change instantly without the need to reload the page.
                We could dispatch a getScreams() function (dataAction.js) but this solution is not ideal for two reasons: 
                first a direct call would not work since the trigger needs a bit of time to take effect so we would need
                to delay the invocation with setTimeout and second we would be making an extra request to fetching all the 
                screams only to show a few changes. So in a similar manner to how we proceed with deleteScream() action, 
                we are going to update the local state replacing the userImage property of the screams belonging to the
                autenticated user with the new image url reference (basically if we get to this line we know that the image
                has been successfully uploaded to the server, so it is perfectly consistent to manipulate the state).
            */

            dispatch({
                type: UPDATE_SCREAMS_IMAGE,
                payload: { 
                    imageUrl: res.data, 
                    userHandle 
                }
            });
        })
        // .then( () => {
        //     setTimeout( () => {
        //         dispatch( getScreams() );
        //     }, 2000);
        // })
        .catch(err => {
            console.error(err);
        })
}

export const editUserDetails = (userDetails) => dispatch => {
    dispatch({ type: LOADING_USER });
    axios.post('/user', userDetails)
        .then( () => { // we do not use response data so we can omit argument
        // .then(res => {
            dispatch( getUserData() ); // dispatching getUserData action allows to show new user details on the spot after editing them whitout refreshing
        })
        .catch(err => {
            console.error(err);
        })
}

export const markNotificationsRead = notificationIds => dispatch => {
    axios.post('/notifications', notificationIds)
        .then(res => {
            dispatch({
                type: MARK_NOTIFICATIONS_READ
            });
        })
        .catch(err => {
            console.error(err);
        });
}
