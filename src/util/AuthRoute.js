import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'; // built-in method in React for type checking that minimises potential errors (good pactice) (https://reactjs.org/docs/typechecking-with-proptypes.html)
import { connect } from 'react-redux';

// const AuthRoute = props => {
const AuthRoute = ({ component: Component, authenticated, checkToken, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => authenticated ? <Redirect to='/' /> : <Component checkToken={checkToken} {...props} />} // Component here is either login or signup route, only rendered when user is not authenticated (otherwise route points to home page)
        />
    );
}

const mapStateToProps = state => (
    {
        authenticated: state.user.authenticated
    }
)

AuthRoute.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(AuthRoute);