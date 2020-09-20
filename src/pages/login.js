import React, { /*Component,*/ useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types'; // built-in method in React for type checking that minimises potential errors (good pactice) (https://reactjs.org/docs/typechecking-with-proptypes.html)
import { Link } from 'react-router-dom';
import AppIcon from '../images/icon.png';
// import axios from 'axios';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// https://material-ui.com/components/dialogs/#alerts
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

// Redux

import { connect } from 'react-redux';
import store from '../redux/store';
import { CLEAR_ERRORS } from '../redux/types';
import { SET_UNAUTHENTICATED } from '../redux/types';
import { loginUser } from '../redux/actions/userActions';

/*
    The styles are shared between the login and signup components,
    so we can make them global by placing them in the theme object 
    in App.js and them converting the styles constant into an arrow
    function that takes the theme as argument, spreads what it needs
    and then returns it so we can have access to it.
*/

// const styles = {
//     form: {
//         textAlign: 'center'
//     },
//     image: {
//         margin: '20px auto 20px auto'
//     },
//     pageTitle: {
//         margin: '5px auto 5px auto'
//     },
//     textField: {
//         margin: '10px auto 10px auto'
//     },
//     button: {
//         marginTop: 20,
//         position: 'relative'
//     },
//     customError: {
//         color: 'red',
//         fontSize: '0.8rem',
//         marginTop: 10
//     },
//     progress: {
//         position: 'absolute'
//     }
// }

const styles = theme => ({ // global theme is provided by MuiThemeProvider in App.js

    /*
        We get a TypeError (color.charAt is not a function) if we spread theme directly (because theme object has more 
        properties than just our defined styles, we can check this by doing a console.log of theme) so we have to wrap 
        all style classes inside a property and spread it for it to work.

            https://stackoverflow.com/a/57168546
    */

   // ...theme
    ...theme.styles   
});

// const styles = theme => {
//     console.log(theme);
// }

function Login(props) {
// class login extends Component {

//     constructor() {
//         super();
//         this.state = {
//             email: '',
//             password: '',
//             // loading: false,
//             errors: {}
//         }
//     }

    const [ values, setValues ] = useState({ email: '', password: '' });
    const [ errors, setErrors ] = useState( {} );
    // const [open, setOpen] = useState(!!localStorage.expired);
    const [open, setOpen] = useState(props.expired);

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     if (nextProps.ui.errors) {
    //         this.setState({ errors: nextProps.ui.errors });
    //     }
    // }

    // static getDerivedStateFromProps(props, state) {
    //     if (props.ui.errors) {
    //         return { 
    //             errors: props.ui.errors 
    //         }
    //     }
    //     return null;
    // }

    useEffect( () => {
        /*
            We clear errors before setting them so we can guarantee a clean page in case of navigation between login and 
            signup pages after dispatching errors in one of them (props.ui.errors would not be null so the errors of one 
            would already be displayed on the other before clicking anything).
        */
        store.dispatch({ type: CLEAR_ERRORS });
    }, []);

    useEffect( () => {
        /*
            useEffect method is always called when time page is rendered for the first time (component did mount)
            so we have to check whether props.ui.errors is not null (initial state we defined in uiReducer.js for errors,
            because empty objects are truthy since they are not undefined) before setting state because otherwise we would 
            be setting errors as null everytime page refresh instead of an empty object in the declaration (line 77). 
            
            State property errors being an empty object or null has a major effect on our code because we are accessing its 
            values (possible values from the backend function definition) on TextField attribues and, while there is no 
            problem accessing inexistent properties of a object, empty or not (returns simply undefined), we would get an 
            crashing error trying yo do the same to a null pointer. We could solve this situation using optional chaining like this: 
            
                helperText={errors?.email}

                (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 
        */
        setErrors( props.ui.errors ? props.ui.errors : {} );
    }, [props.ui.errors] );

    const handleSubmit = event => {

    // handleSubmit = event => { // no need to bind class method using arrow syntax (for class-based components)

        event.preventDefault();

        // this.setState({
        //     loading: true
        // });

        const userData = {
            email: values.email,        // email: this.state.email,
            password: values.password   // password: this.state.password
        }

        // axios.post('/login', userData)
        //     .then(res => {
        //         console.log(res.data);
        //         localStorage.setItem('fbIdToken', `Bearer ${res.data.token}`); 
        //         this.setState({
        //             loading: false
        //         });
        //         this.props.history.push('/'); // programatic navigation to home page
        //     })
        //     .catch(err => {
        //         // console.log(err.response);
        //         this.setState({
        //             errors: err.response.data, // backend (cloud function) errors
        //             loading: false
        //         })
        //     });

        // this.props.loginUser(userData, this.props.history);
        props.loginUser(userData, props.history);  // history (react router prop) can be used to redirect us on success (https://medium.com/jspoint/basics-of-react-router-v4-336d274fd9e0#:~:text=history%20prop%20is%20the%20history,which%20a%20component%20was%20rendered)
    }

    const handleChange = event => {
        const { name, value } = event.target;
        // this.setState({
        //     [name]: value // Computed property name (ES2015)
        // });
        setValues({ ...values, [name]: value });
    }

    const handleClose = () => {
        setOpen(false);

        // localStorage.removeItem('expired');
        
        store.dispatch({ type: SET_UNAUTHENTICATED }); // set expired to false again
    };

    // render() {
    //     const { classes, ui: { loading } } = this.props;
    //     // const { errors, loading } = this.state;
    //     const { errors } = this.state;

    const { 
        classes, 
        ui: { loading } 
    } = props; // loading is no longer in local state, but in the props
        
    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Your session has expired. Please log in again.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    OK
                </Button>
                </DialogActions>
            </Dialog>
            {/*
                Material UI automatically splits the default width of each child item 
                in the grid container based on their number so they fit in one line 
                (33% for three elements, 25% for four, 20% for five...) without the 
                need of specifying it ourselves
            */}
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={AppIcon} alt="App logo" className={classes.image}/>
                    <Typography variant="h3" className={classes.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={handleSubmit}> {/* this.handleSubmit */}
                        <TextField // https://material-ui.com/components/text-fields/#layout
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Email" 
                            className={classes.textField} 
                            helperText={errors.email} // does not show anywhing if there is no errors email property (would return undefined because errors is initialised as empty object)
                            error={!!errors.email} // the !! (double bang) logical operators return a value’s truthy value ( error={errors.email ? true : false} )
                            value={values.email} // this.state.email
                            onChange={handleChange} // this.handleChange
                            fullWidth 
                        />
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password" 
                            className={classes.textField}
                            helperText={errors.password} 
                            error={!!errors.password}
                            value={values.password} // this.state.password
                            onChange={handleChange}  // this.handleChange
                            fullWidth 
                        />
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            className={classes.button}
                            disabled={loading}
                        >
                            Login
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                        <br />
                        <small>Don't have an account? sign up <Link to="/signup">here</Link></small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        </Fragment>
    );

    // }
    
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    expired: PropTypes.bool.isRequired
}

/*
    mapStateToProps function receives the global state (reducers object in store.js) as parameter and takes 
    what we need: in this case we do not need data or user because we do not have to show any scream or 
    credentials in the login page, so we only get ui (loading property).
*/
const mapStateToProps = state => ( // function to map the state provided by the done action (fetched from Redux store state) to props in your component (returns an object) (https://react-redux.js.org/using-react-redux/connect-mapstate)
    { 
        ui: state.ui,
        expired: state.user.expired
    }
);

const mapActionsToProps = { // object that stores the imported actions which are to be passed as props in your component
    loginUser
}

/*
    Now ui reducer state (mapStateToProps) and loginUser action (mapActionsToProps) are brought 
    in from the global state and map into our component props , which is why we can call 
    props.loginUser( ... ) in line 169
*/

// export default withStyles(styles)(login);
export default connect(
    mapStateToProps, 
    mapActionsToProps
)(withStyles(styles)(Login));