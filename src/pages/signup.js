import React, { /* Component, */ useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // built-in method in React for type checking that minimises potential errors (good pactice) 
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

// Redux

import { connect } from 'react-redux';
import store from '../redux/store';
import { CLEAR_ERRORS } from '../redux/types';
import { signupUser } from '../redux/actions/userActions';

const styles = theme => ({ // global theme is provided by MuiThemeProvider in App.js
    ...theme.styles
});

function Signup(props) {
// class signup extends Component {

//     constructor() {
//         super();
//         this.state = {
//             email: '',
//             password: '',
//             confirmPassword: '',
//             handle: '',
//             // loading: false,
//             errors: {}
//         }
//     }

    const [ values, setValues ] = useState({ email: '', password: '', confirmPassword: '', handle: '' });
    const [ errors, setErrors ] = useState( {} );

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
        store.dispatch({ type: CLEAR_ERRORS });
    }, []);

    useEffect( () => {
        setErrors( props.ui.errors ? props.ui.errors : {} );
    }, [props.ui.errors] );

    const handleSubmit = event => {
        event.preventDefault();

        // this.setState({
        //     loading: true
        // });
        
        const newUserData = {
            email: values.email,                        // email: this.state.email,
            password: values.password,                   // password: this.state.password,
            confirmPassword: values.confirmPassword,    // confirmPassword: this.state.confirmPassword,
            handle: values.handle                       // handle: this.state.handle
        }

        // axios.post('/signup', newUserData)
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
        //             errors: err.response.data,
        //             loading: false
        //         })
        //     });

        // this.props.signupUser(newUserData, this.props.history);
        props.signupUser(newUserData, props.history);
    }

    const handleChange = event => {
        const { name, value } = event.target;
        // this.setState({
        //     [event.target.name]: event.target.value // Computed property name (ES2015)
        // });
        setValues({ ...values, [name]: value });
    }

    // render() {
    //     const { classes, ui: { loading } } = this.props;
    //     // const { errors, loading } = this.state;
    //     const { errors } = this.state;

    const { classes, ui: { loading } } = props;

    return (
        /*
            Material UI automatically splits the default width of each child item 
            in the grid container based on their number so they fit in one line 
            (33% for three elements, 25% for four, 20% for five...) without the 
            need of specifying it ourselves
        */
        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={AppIcon} alt="App logo" className={classes.image}/>
                <Typography variant="h3" className={classes.pageTitle}>
                    Signup
                </Typography>
                <form noValidate onSubmit={handleSubmit}> {/* this.handleSubmit */}
                    <TextField // https://material-ui.com/components/text-fields/#layout
                        id="email" 
                        name="email" 
                        type="email" 
                        label="Email" 
                        className={classes.textField} 
                        helperText={errors.email}  // does not show anywhing if there is no errors email property (would return undefined because errors is initialised as empty object)
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
                        onChange={handleChange} // this.handleChange
                        fullWidth 
                    />
                    <TextField 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type="password" 
                        label="Confirm Password" 
                        className={classes.textField}
                        helperText={errors.confirmPassword} 
                        error={!!errors.confirmPassword}
                        value={values.confirmPassword} // this.state.confirmPassword
                        onChange={handleChange} // this.handleChange
                        fullWidth 
                    />
                    <TextField 
                        id="handle" 
                        name="handle" 
                        type="text" 
                        label="Handle" 
                        className={classes.textField}
                        helperText={errors.handle} 
                        error={!!errors.handle}
                        value={values.handle} // this.state.handle
                        onChange={handleChange} // this.handleChange
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
                        Signup
                        {loading && (
                            <CircularProgress size={30} className={classes.progress} />
                        )}
                    </Button>
                    <br />
                    <small>Already have an account? log in <Link to="/login">here</Link></small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    );

    // }
    
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
}

const mapStateToProps = state => (
    {
        user: state.user,
        ui: state.ui
    }
);

// const mapActionsToProps = {
//     signupUser
// }

export default connect(
    mapStateToProps, 
    // mapActionsToProps
    { signupUser } // since there is only one action, we can pass it like this instead of declaring an entire object for a single property
)(withStyles(styles)(Signup));