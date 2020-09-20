import React, { /* Component, */ Fragment, useState } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Material UI framework

import Menu from '@material-ui/core/Menu'; // https://material-ui.com/components/menus/#simple-menu
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge'; // https://material-ui.com/components/badges/

// MUI Icons

import NotificationsIcon from '@material-ui/icons/Notifications';
import FavouriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

// Redux

import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

function Notifications(props) {
// class Notifications extends Component {

    // constructor() {
    //     super();
    //     this.state = {
    //         anchorEl: null
    //     }
    // }

    const [ anchorEl, setAnchorEl ] = useState(null); 

    const handleOpen = event => { // anchorEl takes the value of the icon clicked
        // this.setState({ anchorEl: event.target });
        setAnchorEl(event.target);
    }

    const handleClose = () => {
        // this.setState({ anchorEl: null });
        setAnchorEl(null);
    }

    const onMenuOpened = () => {
        let unreadNotifIds = props.notifications // this.props.notifications
            .filter(n => !n.read)
            .map(n => n.notificationId);
        // We send an array of the unread notifications' ids to the backend so they can be marked as read
        props.markNotificationsRead(unreadNotifIds); // this.props.markNotificationsRead(unreadNotifIds)
    }

    // render() {

    const notifications = props.notifications; // this.props.notifications
    // const anchorEl = state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationIcon;
    let numberUnreadNotif = notifications.filter(n => !n.read).length; // filtered array of all the unread notifications

    if (notifications.length > 0 && numberUnreadNotif > 0) {
        notificationIcon = (
            <Badge badgeContent={numberUnreadNotif} color="secondary">
                <NotificationsIcon />
            </Badge>
        );
    } else {
        notificationIcon = <NotificationsIcon />
    }

    let notificationsMarkup = notifications.length > 0 ? (
        notifications.map(n => {
            const verb = n.type === 'like' ? 'liked' : 'commented on'; // depending on the notification type we put a different string inside the notification
            const time = dayjs(n.createdAt).fromNow();
            const iconColor = n.read ? 'primary' : 'secondary';
            const icon = n.type === 'like' ? (
                <FavouriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
                <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );
            /*
                When user click on a notifiation we want the page to programatically navigate to the scream dialog URL of the scream
                pertaining such notification. We can use the React Router Link Component, which is an efficient way to navigate 
                around the application, but while this works fine if the notification is clicked from the home page, it does not open 
                the dialog from the user page, even when the URL is correctly constructed. This is probably due to both '/users/:handle' 
                and '/users/:handle/scream/:screamId' paths pointing to the same page (user.js), so the route change is not consolidated.
                A possible solution is to directly modify the window.location on a click event, which works in both situations but with 
                a higher performance cost because the window is reloaded.
            */
            return (
                <MenuItem key={n.createdAt} onClick={handleClose}> {/* this.handleClose */}
                    {icon}
                    <Typography
                        color="inherit"
                        variant="body1"
                        // component={Link}
                        // to={`/users/${n.recipient}/scream/${n.screamId}`}
                        onClick={() =>  window.location.pathname=`/users/${n.recipient}/scream/${n.screamId}`}
                    >
                        {n.sender} {verb} your scream {time}
                    </Typography>
                </MenuItem>
            );
        })
    ) : (
        <MenuItem onClick={handleClose}> {/* this.handleClose */}
            You have no notifications yet
        </MenuItem>
    );

    return (
        <Fragment>
            <Tooltip placement="top" title="Notifications">
                <IconButton 
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={handleOpen} // this.handleOpen
                >
                    {notificationIcon}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)} // !!anchorEl
                onClose={handleClose} // this.handleClose
                onEntered={onMenuOpened} // this.onMenuOpened (this property is triggered once the menu is opened)
            >
                {notificationsMarkup}
            </Menu>
        </Fragment>
    );

    // }

}

Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired
}

const mapStateToProps = state => (
    {
        notifications: state.user.notifications
    }
);

export default connect(
    mapStateToProps, 
    { markNotificationsRead }
)(Notifications);