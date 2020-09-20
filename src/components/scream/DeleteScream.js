import React, { /* Component, */ useState, Fragment } from 'react';
import PropTypes from 'prop-types';

// Components

import MyButton from '../../util/MyButton';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

// MUI Icons

import DeleteOutline from '@material-ui/icons/DeleteOutline'; // delete outline icon is better than plain delete because it does not distract too much from the scream itself (we do not want to emphasise a delete button in out design)

// Redux

import { connect } from 'react-redux';
import { deleteScream } from '../../redux/actions/dataActions';

const styles = {
    deleteButton: {
        position: 'absolute',
        top: '10%',
        left: '92%'
    }
}

function DeleteScream(props) {
// class DeleteScream extends Component {

    // state = {
    //     open: false
    // }

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        // this.setState({ open: true });
        setOpen(true);
    }

    const handleClose = () => {
        // this.setState({ open: false });
        setOpen(false);
    }

    const deleteScream = () => {
        // this.props.deleteScream(this.props.screamId);
        // this.setState({ open: false });
        props.deleteScream(props.screamId);
        setOpen(false);
    }

    const { classes } = props;

    // render() {
    //     const { classes } = this.props;

    return (
        <Fragment>
            <MyButton 
                tip="Delete Scream" 
                onClick={handleOpen} // this.handleOpen
                btnClassName={classes.deleteButton}
            >
                <DeleteOutline color="secondary" />
            </MyButton>
            <Dialog
                open={open} // this.state.open
                onClose={handleClose} // this.handleClose
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Are you sure you want to delete this scream?
                </DialogTitle>
                <DialogActions>
                    <Button 
                        onClick={handleClose} // this.handleClose
                        color="primary" 
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={deleteScream} // this.deleteScream
                        color="secondary" 
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );

    // }

}

DeleteScream.propTypes = {
    classes: PropTypes.object.isRequired,
    deleteScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired // screamId is directly passed as prop from Scream.js
}

export default connect(
    null, 
    { deleteScream }
)(withStyles(styles)(DeleteScream)); // we do not need to map state to props so we pass a null pointer as first paremeter