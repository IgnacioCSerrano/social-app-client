import React, { /* Component, */ Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// Components

import EditDetails from './EditDetails';
import MyButton from '../../util/MyButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from'@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';

// MUI Icons - npm install @material-ui/icons - https://material.io/resources/icons/?style=baseline (in order to use an icon from the list you just have to PascalCase the name)

import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
// import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import ExitToApp from '@material-ui/icons/ExitToApp';

// Redux

import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../../redux/actions/userActions';

const styles = theme => ({
    ...theme.styles
});

function Profile(props) {

// class Profile extends Component {

    const handleImageChange = event => {
        const image = event.target.files[0];
        const formData = new FormData(); // FormData interface provides a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the XMLHttpRequest.send() method.
        formData.append('image', image, image.name);
        props.uploadImage(formData, handle); // this.props.uploadImage(formData)
    }

    const handleEditPicture = () => { // this method just finds the file input and then clicks on it
        const fileInput = document.getElementById('image-input');
        fileInput.click();
    }

    const handleLogout = () => {
        props.logoutUser(); // this.props.logoutUser()
    }

    // render() {

    const {
        classes,
        user: {
            credentials: { handle, createdAt, imageUrl, bio, website, location }, // nested object destructuring
            loading,
            authenticated
        }
    } = props;
    
    let profileMarkup = !loading ? ( 
        authenticated ? (
            <Paper className={classes.paper}> {/* https://material-ui.com/components/paper/ (Paper looks like a Card because basically a Card is built on top of the Paper) */}
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="Profile" className="profile-image" />
                        <input 
                            type="file" 
                            id="image-input" 
                            hidden="hidden" // we hide default input file so we can create our own styled button and trigger the event through it (handleEditPicture)
                            onChange={handleImageChange} // onChange event is triggered each time a file is selected
                        /> 
                        {/* <Tooltip title="Edit profile picture" placement="top">
                            <IconButton onClick={handleEditPicture} className="button">
                                <EditIcon color="primary" />
                            </IconButton> 
                        </Tooltip> */}
                        <MyButton 
                            tip="Edit profile picture" 
                            btnClassName="button" 
                            onClick={handleEditPicture} // this.handleEditPicture
                        >
                            <EditIcon color="primary" />
                        </MyButton>
                    </div>
                    <hr />
                    <div className="profile-details">
                        <MuiLink 
                            component={Link} 
                            to={`/users/${handle}`} 
                            color="primary" 
                            variant="h5" // we can give a variant to change the font size because this component is built on top of Typography
                        >
                            @{handle}
                        </MuiLink>
                        <hr />
                        {bio && (
                            <Fragment> {/* Fragment is a React component that does not render anything but wraps elements (parent) */}
                                <Typography variant="body2">
                                    {bio}
                                </Typography>
                                <hr />
                            </Fragment>
                        )}
                        {location && (
                            <Fragment>
                                <LocationOn color="primary" /> <span>{location}</span>
                                <hr />
                            </Fragment>
                        )}
                        {website && (
                            <Fragment>
                                <LinkIcon color="primary" />
                                <a href={website} target="_blank" rel="noopener noreferrer"> {/* when setting target to a blank page we have to add rel property with those values so React won't complain */}
                                    {' '}{website}
                                </a>
                                <hr />
                            </Fragment>
                        )}
                        <CalendarToday color="primary" /> {' '} <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                    {/* <Tooltip title="Logout" placement="top">
                        <IconButton onClick={handleLogout}> 
                            <ExitToApp color="primary" />
                        </IconButton>
                    </Tooltip> */}
                    <MyButton tip="Logout" btnClassName="button" onClick={handleLogout}> {/* this.handleLogout */ }
                        <ExitToApp color="primary" /> {/* <KeyboardReturn color="primary" /> */}
                    </MyButton>
                    <EditDetails />
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body2" align="center">
                    Join SocialApe today!
            </Typography>
                <div className={classes.buttons}>
                    <Button variant="contained" color="primary" component={Link} to="/login">
                        Login
                </Button>
                    <Button variant="contained" color="secondary" component={Link} to="/signup">
                        Signup
                </Button>
                </div>
            </Paper>
        )
    ) : (
        // <p>Loading...</p>
        <ProfileSkeleton />
    );

    return profileMarkup; // markup is going to be different depending we are on loading or after being authenticated

    // }
}

const mapStateToProps = state => (
    {
        user: state.user
    }
);

const mapActionsToProps = { logoutUser, uploadImage }

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
}

export default connect(
    mapStateToProps, 
    mapActionsToProps
)(withStyles(styles)(Profile));