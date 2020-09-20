/*
  It is recommended to install two Chrome extentions:

  - React Developer Tools
  - Redux DevTools
*/

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, /* useHistory */ } from 'react-router-dom'; // npm install react-router-dom (allows us to set navigation routes for diferent pages)
import themeFile from './util/theme';
// import jwtDecode from 'jwt-decode'; // npm install jwt-decode (library to decode JSON Web tokens, like FireBase tokens)
import axios from 'axios';

// Material UI framework

// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'; // MuiThemeProvider is not a separate file or directory within @material-ui/core/styles but a named export (https://stackoverflow.com/a/58435846) (https://github.com/mui-org/material-ui/blob/v4.5.1/packages/material-ui/src/styles/index.js#L16)
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// https://material-ui.com/components/dialogs/#alerts
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';

// Redux

import { Provider } from 'react-redux';
import store from './redux/store';
// import { SET_AUTHENTICATED } from './redux/types';
// import { logoutUser, getUserData } from './redux/actions/userActions';

// Components

import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';
import CheckToken from './util/CheckToken';

// Pages

import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';

/*
  As our App grows bigger and we have more components and most of them need to have access to user data
  it would be better to implement a solution that manages a global state: Redux.

  (https://daveceddia.com/what-does-redux-do/)

  We need to install three packages:

    npm install redux react-redux redux-thunk

  react-redux library is the middleman between Redux and React and redux-thunk is a middleware which
  gives us access to the dispatch that allows us to run asynchronous code in our redux actions.
*/

const theme = createMuiTheme(themeFile);

/*
  In order to set up the base URL of axios to be able to deploy the App in Firebase, we need to have 
  the cors module installed in the backend (Cloud Function) to bypass access control check: 
  No 'Access-Control-Allow-Origin' header is present on the requested resource.
*/

// axios.defaults.baseURL = "https://europe-west1-socialapp-90ae6.cloudfunctions.net/api";
axios.defaults.baseURL = "http://localhost:5001/socialapp-90ae6/europe-west1/api"; // run command 'firebase emulators:start' from social-app-functions directory

/*
  It is really bad practice to have global variables declared like this;
  instead we will call the actions from userActions.js, set ourselves to
  be authenticated and edit state accordingly.
*/

// let authenticated;

function App() {

  /*
    Originally, we had placed here (at the very beginning of the App) the procedure to check whether the token stored in localStorage 
    was valid (in which case we fetch user details) or not (in which case we log user out): the checkToken() method. Since token has
    an expirity date of one hour, we wanted to use a setTimeout logic to log out user after one hour, programmatically navigate to the
    login page and open the dialog which says to them that session has expired. This method needed to be called from the login and user
    pages for the first time (and update after refresh or re-open), so we passed it as prop (throught AuthRoute component). 
    However we had an issue: we could not programmatically navigate from here using history.push() (react-router-dom useHistory callback function) 
    because the Router component is nested inside the App component rather than the App being nested inside of the router. The router acts as 
    sort of a context provider and without the app being nested in the router the useHistory() hook has no provider to get the History from and 
    would return undefined.

    So instead of navigate programmatically, we had to use window.location.href, which refresh the app and reset the redux storage, so we could
    not keep track (expired redux user data property) to know when the dialog should be opened (is user in the login page for the first time or 
    because session has expired?).

    . To solve this we had two opcions:
    
    - Set a localStorage property call expired to true when session has expired and look for it when login page is rendered (and remove it
      when dialog is closed).
    - Move the checkToken method to the global state and call it from a renderless component placed at the top of Router so it can pass History
      (useHistory()) and set up the programmatic navigation.
  */

  // const checkToken = () => { ... }
  // useEffect(checkToken, []);

  // console.log(store.getState().user.authenticated);

  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}> {/* everything inside the Provider component has access to store (state container) */}
        <Router>
          <CheckToken /> {/* this is a renderless component that only handles token validity checking logic on start */}
          <Navbar />
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                component={home}
              />
              {/*
                AuthRoute is a personal component (util/AuthRoute.js) which wraps the Route component and redirects to
                the home page if user is authenticated so he cannot access the login and signup pages while logged in
              */}
              <AuthRoute
                exact // exact keyword is used to render a component only when there is an exact match of route (so '/login' would work but not '/login/something')
                path="/login"
                // checkToken={checkToken} // function passing is handled throught AuthRoute component (util/AuthRoute.js)
                component={login}
                // authenticated={authenticated} // we can still get authenticated as prop in AuthRoute.js through connect(mapStateToProps)
              />
              <AuthRoute
                exact
                path="/signup"
                // checkToken={checkToken}
                component={signup}
                // authenticated={authenticated}
              />
              <Route
                exact
                path="/users/:handle"
                component={user}
              />
              {/*
                We want the App to open the scream dialog of a particular scream when we access a URL consisting of /users followed by
                the scream's owner user handle then /scream followed by the scream id: First we set up a route with such path directing
                to the user page; then in the user page we check if we are accessing the normal profile page or a specific scream with
                the screamIdParam local state property; in the latter case, when we are mapping the user screams, we pass a boolean prop
                (openDialog) to the scream whose id is equal to the id param (if there is one); this boolean is received by the Scream
                component and passed to the ScreamDialog component and there we open the dialog at the beginning (component has been
                mounted) if prop is not undefined.
                We also want to construct this URL anytime a scream is being accessed by clicking on its expanded scream button (on either
                home or user page) and come back to the previous URL when dialog is closed, so we use a window property called
                history.pushState on the ScreamDialog handle open and close methods.
              */}
              <Route
                exact
                path="/users/:handle/scream/:screamId"
                component={user}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
