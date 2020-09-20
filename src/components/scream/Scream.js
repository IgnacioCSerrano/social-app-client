import React, { /* Component, */ useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs'; // npm install dayjs - https://github.com/iamkun/dayjs - minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers with a largely Moment.js-compatible API) (Moment.js has a load of extra functionalities that we are not goint to use)
import relativeTime from 'dayjs/plugin/relativeTime'; // https://day.js.org/docs/en/plugin/relative-time#docsNav

// Components

// import MyButton from '../../util/MyButton';
import LikeButton from './LikeButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// MUI Icons

import ChatIcon from '@material-ui/icons/Chat';

// Redux

import { connect } from 'react-redux';

/*
    Material UI adopts a JSS type of styling where you write a JavaScript object
    (styles) and then employ a higher-order component to apply those styles, 
    make them into classes and then use them 
    
        https://material-ui.com/styles/basics/
*/

const styles = theme => ({
    ...theme.styles,
    card: {
        position: 'relative', // we need to give the card a relative position so that the absolute of the delete button can work
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        // padding: 25,
        objectFit: 'cover'
    }
});

function Scream(props) {
// class Scream extends Component {

    dayjs.extend(relativeTime);

    const [ commentCount, setCount ] = useState(props.scream.commentCount);

    const updateCount = () => {
        setCount(commentCount + 1);
    }

    const { 
        classes, 
        scream: { 
            body, 
            createdAt, 
            userImage, 
            userHandle, 
            screamId, 
            likeCount, 
            // commentCount // we handle commentCount as local state so we can increment it when a new comment has been submitted and re-render the component to display the new value
        },
        user: {
            authenticated,
            credentials: {
                handle
            }
        }
    } = props; // scream is passed as prop

    // render() {
    //     dayjs.extend(relativeTime);
    //     const { classes, scream : { body, createdAt, userImage, userHandle, screamId, likeCount, commentCount } } = this.props;
    //     // const classes = this.props.classes;

    const deleteButton = authenticated && (userHandle === handle)
        ? (
            <DeleteScream screamId={screamId} />
        ) : null;

    return (
        <div>
            <Card className={classes.card}>
                <CardMedia
                    image={userImage}
                    title="Profile image"
                    className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography 
                        component={Link} 
                        to={`/users/${userHandle}`}
                        color="primary"
                        variant="h5"
                    >
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton screamId={screamId} />
                    <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                    {/* <MyButton tip="Comments"> */}
                        <ChatIcon color="primary" className={classes.icon} />
                    {/* </MyButton> */}
                    <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
                    <ScreamDialog 
                        screamId={screamId} 
                        userHandle={userHandle} 
                        updateCount={updateCount} 
                        openDialog={props.openDialog} // this.props.openDialog (passes an undefined value if prop does not exist)
                    /> 
                </CardContent>
            </Card>
        </div>
    );

    // }
    
}

Scream.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired, // scream is directly passed as prop from home.js (not fetched from store.js with mapStateToProps() as user data)
    openDialog: PropTypes.bool // this property is not required because most screams will not receive it (sometimes none) (only when scream is being displayed individually on its own URL)
}

const mapStateToProps = state => (
    {
        user: state.user
    }
);

export default connect(mapStateToProps)(withStyles(styles)(Scream));