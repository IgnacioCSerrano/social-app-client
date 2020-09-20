import React, { /* Component, */ useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

// Components

import MyButton from '../../util/MyButton';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
// https://material-ui.com/components/dialogs/#form-dialogs
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// import Tooltip from '@material-ui/core/Tooltip';
// import IconButton from '@material-ui/core/IconButton';

// MUI Icons

import ListIcon from '@material-ui/icons/List';

// Redux

import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

const styles = theme => ({
    ...theme.styles,
    button: {
        float: 'right'
    }
});

function EditDetails(props) {
// class EditDetails extends Component {

    // constructor() {
    //     super();
    //     this.state = {
    //         open: false
    //         bio: '',
    //         website: '',
    //         location: '',
    //     }
    // }

    const [ open, setOpen ] = useState(false);
    const [ values, setValues ] = useState({ bio: '', website: '', location: '' });

    const mapUserDetailsToState = credentials => { // this is a function (arrow) expression, so it needs to be placed before any of its callings (function hoisting only works with function declarations—not with function expressions)
        // this.setState({
        //     bio: credentials.bio ? credentials.bio : '',
        //     website: credentials.website ? credentials.website : '',
        //     location: credentials.location ? credentials.location : ''
        // });
        setValues({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        });
    }

    // componentDidMount() {
    //     // const { credentials } = this.props;
    //     this.mapUserDetailsToState(credentials);
    // }

    /*
        Placing the comment statement 
            // eslint-disable-next-line react-hooks/exhaustive-deps 
        before a violating line disables the warning log, in this case
        - React Hook useEffect has a missing dependency: 'props.credentials' - 
    */

    // useEffect(() => {
    //     mapUserDetailsToState(props.credentials);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        mapUserDetailsToState(props.credentials);
    }, [props.credentials]);

    const handleOpen = () => {
        // this.mapUserDetailsToState(this.props.credentials);
        // this.setState({ open: true });
        mapUserDetailsToState(props.credentials);
        setOpen(true);
    }

    const handleClose = () => {
        // this.setState({ open: false });
        setOpen(false);
    }

    const handleChange = event => {
        const { name, value } = event.target;
        // this.setState({
        //     [event.target.name]: event.target.value // Computed property name (ES2015)
        // });
        setValues({ ...values, [name]: value });
    }

    const handleSubmit = () => {
        const userDetails = {
            bio: values.bio,            // this.state.bio
            website: values.website,    // this.state.website
            location: values.location   // this.state.location
        }
        props.editUserDetails(userDetails); // this.props.editUserDetails(userDetails)
        handleClose(); // this.handleClose()
    }

    const { classes } = props;

    // render() {
    //     const { classes } = this.props;

    return (
        <Fragment>
            {/* <Tooltip title="Edit details" placement="top">
                <IconButton onClick={handleOpen} className={classes.button}>
                    <ListIcon color="primary" />
                </IconButton>
            </Tooltip> */}
            <MyButton tip="Edit details" btnClassName={classes.button} onClick={handleOpen}> {/* this.handleOpen */}
                <ListIcon color="primary" />
            </MyButton>
            <Dialog
                open={open}
                onClose={handleClose} // this.handleOpen
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit your details</DialogTitle>
                <DialogContent>
                    <form> {/* we do not need a submit button for our form becase the dialog actions will handle submission for us */}
                        <TextField
                            name="bio"
                            type="text"
                            label="Bio"
                            multiline // turns text field into text area
                            rows="3"
                            placeholder="A short bio about yourself"
                            className={classes.textField} // global theme property (spreadForm)
                            value={values.bio} // this.state.bio
                            onChange={handleChange} // this.handleChange
                            fullWidth
                        />
                        <TextField
                            name="website"
                            type="text"
                            label="Website"
                            placeholder="Your personal/professional website"
                            className={classes.textField}
                            value={values.website} // this.state.website
                            onChange={handleChange} // this.handleChange
                            fullWidth
                        />
                        <TextField
                            name="location"
                            type="text"
                            label="Location"
                            placeholder="Where you live"
                            className={classes.textField}
                            value={values.location} // this.state.location
                            onChange={handleChange} // this.handleChange
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary"> {/* this.handleOpen */}
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary"> {/* this.handleOpen */}
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );

    // }

}

EditDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    editUserDetails: PropTypes.func.isRequired
}

const mapStateToProps = state => (
    {
        credentials: state.user.credentials
    }
);

export default connect(
    mapStateToProps,
    { editUserDetails }
)(withStyles(styles)(EditDetails));