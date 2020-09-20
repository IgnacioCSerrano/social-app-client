import React, { /* Component, */ Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components

import MyButton from '../../util/MyButton';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

// MUI Icons

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

// Redux

import { connect } from 'react-redux';
import { postScream, clearErrors } from '../../redux/actions/dataActions';

const styles = {
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 20,
        marginBottom: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '3%'
    }
}

function PostScream(props) {
// class PostScream extends Component {

    // constructor() {
    //     super();
    //     this.state = {
    //         open: false,
    //         submitted: false,
    //         body: '',
    //         errors: {}
    //     }
    // }

    const [ open, setOpen ] = useState(false);
    const [ body, setBody ] = useState('');
    const [ errors, setErrors ] = useState( {} ); 

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     if (nextProps.ui.errors) {
    //         this.setState({
    //             errors: nextProps.ui.errors
    //         });
    //     }
    //     if (!nextProps.ui.errors && !nextProps.ui.loading) {
    //         this.setState({ 
    //             open: false,
    //             body: ''
    //         });
    //     }
    // }

    /*
        componentWillReceiveProps is called any time there are changes in any of the props received by the component 
        (except first time page is rendered, when props are brand new) whereas getDerivedStateFromProps is called any 
        time there are changes in either props and or state. Because of this, while we can use componentWillReceiveProps 
        logic to close dialog after Scream has been successfully sent ( if (!nextProps.ui.errors && !nextProps.ui.loading) ), 
        we cannot do the same with getDerivedStateFromProps, because the latter, as opposed to the former, would be called 
        any time we click on the Add Scream Icon Button and the open state would be set to false again so the dialog would 
        never be opened. We can solve this by creating an aditional state boolean property (submitted) which is set to true
        when the submit button has been clicked so we can add this condition to the dialog closing logic.

        Alternatively we could invoked componentDidUpdate(prevProps, prevState).
    */

    // static getDerivedStateFromProps(props, state) {
    //     if (props.ui.errors) {
    //         return { 
    //             errors: props.ui.errors 
    //         };
    //     }
    //     if (!props.ui.errors && !props.ui.loading && state.submitted) {
    //         return {
    //             open: false,
    //             submitted: false,
    //             body: ''
    //         }
    //     }
    //     return null;
    // }

    useEffect( () => {
        setErrors( props.ui.errors ? props.ui.errors : {} );
        if (!props.ui.errors && !props.ui.loading) {
            setOpen(false);
            setBody('');
        }
    }, [props] );

    const handleOpen = () => {
        setOpen(true); // this.setState({ open: true });
    }

    const handleClose = () => {
        // this.setState({
        //     open: false,
        //     errors: {}
        // });
        setOpen(false);

        /*
            If user click on the submit button before writing anything in the text field
            he gets an error message (helperText). We do not want the user to still see
            the same error if he closes the dialog and opens it again, so we set the 
            state errors property to the initial empty object. However this solution is
            not perfect, because we have clear the internal component state but the
            external state (ui.errors prop) persists (we can trail it with Chrome Redux
            DevTools), so when user sent a valid scream he can spot the error message
            again for a second (because posting the Scream triggers a props change
            so page is re-rendered again and helperText is displayed because ui.errors prop
            changes errors internal state, but this only lasts until postScream dispatches
            CLEAR_ERRORS).

            We can prevent this to happen by calling a userSction specially created function
            that only dispatches the CLEAR_ERRORS type on the UI reducer.
        */

        // setErrors({});
        props.clearErrors(); // this.props.clearErrors();
    }

    const handleChange = event => {
        // this.setState({  [event.target.name]: event.target.value });
        setBody(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();
        // this.setState({ submitted: true });
        props.postScream({ body }); // this.props.postScream({ body: this.state.body });
    }

    // render() {
    //     const { errors } = this.state;
    //     const { classes, ui: { loading } } = this.props;

    const { 
        classes, 
        ui: { loading } 
    } = props;

    return (
        <Fragment>
            <MyButton tip="Post a Scream!" onClick={handleOpen}> {/* this.handleOpen */} 
                <AddIcon />
            </MyButton>
            <Dialog
                open={open} // this.state.open
                onClose={handleClose} // this.handleClose
                fullWidth
                maxWidth="sm"
            >
                <MyButton 
                    tip="Close" 
                    onClick={handleClose} // this.handleClose
                    tipClassName={classes.closeButton}
                >
                    <CloseIcon />
                </MyButton>
                <DialogTitle>Post a new Scream</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}> {/* this.handleSubmit */}
                        <TextField
                            name="body"
                            type="text"
                            label="SCREAM!"
                            multiline // textarea
                            rows="3"
                            placeholder="Scream at your fellow apes!"
                            error={!!errors.body} // errors.body ? true : false
                            helperText={errors.body}
                            className={classes.TextField}
                            onChange={handleChange} // this.handleChange
                            fullWidth 
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submitButton}
                            disabled={loading}
                        >
                            Submit
                            {loading && (
                                <CircularProgress size={30} className={classes.progressSpinner} />
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Fragment>
    );

    // }

}

PostScream.propTypes = {
    classes: PropTypes.object.isRequired,
    postScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
}

const mapStateToProps = state => (
    {
        ui: state.ui
    }
);

const mapActionsToProps = {
    postScream,
    clearErrors
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(PostScream));