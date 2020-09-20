import React, { /* Component, */ Fragment, useState, useEffect, /* useCallback */ } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// Components

import MyButton from '../../util/MyButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// MUI Icons

import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';

// Redux

import { connect } from 'react-redux';
import { getScream, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.styles,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover' // image is not stretched if ratio does not match 1:1
    },
    dialogContent: {
        padding: 20
        // overflow: 'hidden'
    },
    closeButton: {
        position: 'absolute',
        left: '89%',
        top: '10px'
    },
    expandButton: {
        position: 'absolute',
        left: '92%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
});

function ScreamDialog(props) {
// class ScreamDialog extends Component {
   
    // constructor() {
    //     super();
    //     this.state = {
    //         open: false,
    //         oldPath: '',
    //         newPath: ''
    //     }
    // }

    const [ open, setOpen ] = useState(false);
    const [ oldPath, setOldPath ] = useState('');

    // render() {

    const { 
        classes, 
        userHandle,
        screamId,
        // getScream,
        openDialog,
        scream: { 
            body, 
            createdAt, 
            likeCount, 
            commentCount, 
            userImage,
            comments // array of comments (empty if there is none)
        }, 
        ui: { loading }
    } = props; // this.props;

    // const handleOpen = useCallback( () => { // handleOpen is wrapped its own useCallback to prevent issues for being include in the useEffect dependency array
    //     setOpen(true);
    //     getScream(screamId);
    // }, [getScream, screamId]);

    const handleOpen = () => {
        const newPath = `/users/${userHandle}/scream/${screamId}`; // we can open the extended scream on this URL because we have set that login on the user.js page and Scream Dialog Component (screamIdParam state and openDialog prop)
        
        /*
            We have to handle an edge case which occurs when we open a scream by pasting its URL on the browser address bar and pressing enter
            instead of clicking the corresponding expanded scream button: in this case the old and new paths are the same, so we are stuck
            even if we close the scream dialog. We can solve this by checking whether both paths match and setting oldPath manually.
        */
        let oldPath = (window.location.pathname === newPath)
            ? `/users/${userHandle}`
            : window.location.pathname;

        // We change the URL to the new path when dialog is opened
        window.history.pushState(null, null, newPath); // this.state.newPath

        // this.setState({ open: true, oldPath, newPath });
        setOpen(true); 
        setOldPath(oldPath);

        props.getScream(screamId); // this.props.getScream(screamId)
    }

    const handleClose = () => {
        // We change the URL to the previous path when dialog is closed
        window.history.pushState(null, null, oldPath); // this.state.oldPath
        setOpen(false); // this.setState({ open: false });
        props.clearErrors(); // this.props.clearErrors();
    }

    // componentDidMount() {
    //     if (this.props.openDialog) {
    //         this.handleOpen();
    //     }
    // }

    // useEffect( () => {
    //     if (openDialog) {
    //         handleOpen();
    //     }
    // }, [openDialog, handleOpen]);

    useEffect( () => {
        if (openDialog) { // openDialog can be true or undefined
            handleOpen();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /*
        We want to call useEffect only once after component has been mounted (componentDidMount substitute) so we set an empty 
        dependency array; however since we are using two external references (openDialog boolean and handleOpen function) React 
        gives us a warning of missing dependencies because it thinks that we may want to call useEffect again if those side effects 
        change, so it advices to include both openDialog and handleOpen in the array. We know that we only need to call the method 
        once at the beginning so we can disable the eslint's warning by placing the comment 'eslint-disable-line react-hooks/exhaustive-deps' 
        after the end or before the last line. If we do not want to disable the warning we can include 'openDialog' and 'handleOpen' 
        as dependencies to be watched for changes, but this would cause another issue: the function handleOpen making the dependencies 
        of useEffect change on every render, which triggers a 'maximum update depth exceeded' error. To fix this, we would have to wrap 
        the 'handleOpen' definition into its own useCallback().
    */

    const dialogMarkup = loading ? (
        <div className={classes.spinnerDiv}>
            <CircularProgress size={200} thickness={2} />
        </div>
        
    ) : (
        <Grid container>
            <Grid item sm={5}>
                <img src={userImage} alt='Profile' className={classes.profileImage} />
            </Grid>
            <Grid item sm={7}>
                <Typography
                    component={Link}
                    to={`/users/${userHandle}`}
                    color="primary"
                    variant="h5"
                >
                    @{userHandle}
                </Typography>
                <hr className={classes.invisibleSeparator} />
                <Typography color="secondary" variant="body2">
                    {dayjs(createdAt).format('H:mm a, MMMM DD YYYY')}
                </Typography>
                <hr className={classes.invisibleSeparator} />
                <Typography variant="body1">
                    {body}
                </Typography>
                <LikeButton screamId={screamId} />
                <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                {/* <MyButton tip="Comments"> */}
                    <ChatIcon color="primary" className={classes.icon} />
                {/* </MyButton> */}
                <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
            </Grid>
            <hr className={classes.visibleSeparator} />
            {/* 
                It is better to divide the application into smaller components (compartmentalisation, modularity) 
                because it simplifies debuggind; also we do not want to flood one component with all the data from 
                the redux actions.
            */}
            <CommentForm screamId={screamId} updateCount={props.updateCount} />
            <Comments comments={comments} />
        </Grid>
    );

    return (
        <Fragment>
            {/* <MyButton tip="Comments" onClick={handleOpen}>
                <ChatIcon color="primary" />
            </MyButton>
            <span>{props.commentCount} {props.commentCount === 1 ? 'comment' : 'comments'}</span> */}
            <MyButton 
                tip="Expand Scream" 
                onClick={handleOpen} // this.handleOpen
                tipClassName={classes.expandButton}
            >
                <UnfoldMore color="primary" />
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
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>
            </Dialog>
        </Fragment>
    );

    // }
    
}

ScreamDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    getScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    scream: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired, // screamId is directly passed as prop from Scream.js
    userHandle: PropTypes.string.isRequired, // userHandle is directly passed as prop from Scream.js
    openDialog: PropTypes.bool
}

const mapStateToProps = state => (
    {
        scream: state.data.scream,
        ui: state.ui
    }
);

const mapActionsToProps = {
    getScream,
    clearErrors
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(withStyles(styles)(ScreamDialog));