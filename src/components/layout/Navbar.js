import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import Link from 'react-router-dom/Link'; // Please use `require("react-router-dom").Link` instead of `require("react-router-dom/Link")`. Support for the latter will be removed in the next major release.
import { Link } from 'react-router-dom';

// Components

import MyButton from '../../util/MyButton';
import PostScream from '../scream/PostScream';
import Notifications from './Notifications';

// Material UI framework

// import { AppBar, Toolbar, Button } from '@material-ui/core'; // We can import components like this but it's not a good practice because each time we run our app we would be importing the whole framework (@material-ui/core) which would slow compile time so it's better to import each module individually (tree shaking)
import AppBar from '@material-ui/core/AppBar'; // npm install @material-ui/core (https://material-ui.com/)
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

// MUI Icons

import HomeIcon from '@material-ui/icons/Home';

// Redux

import { connect } from 'react-redux';
// import { Tooltip } from '@material-ui/core';

// function Navbar() {

class Navbar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
            <AppBar position="fixed"> {/* position is a Material UI component prop (https://material-ui.com/api/app-bar/) (fixed is default value) */}
                <Toolbar className="nav-class-container">
                    {authenticated ? (
                        <Fragment>
                            <PostScream />
                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon /> {/* icons are SVG so we can target them for color change in App.css (.nav-class-container svg) */}
                                </MyButton>
                            </Link>
                            <Notifications />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/">Home</Button>
                            <Button color="inherit" component={Link} to="/signup">Signup</Button>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => (
    {
        authenticated: state.user.authenticated
    }
);

export default connect(mapStateToProps)(Navbar); // since we do not need any actions (only data props) we omit mapActionsToProps parameter