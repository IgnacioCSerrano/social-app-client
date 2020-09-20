import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Redux

import { connect } from 'react-redux';

const styles = theme => ({
    ...theme.styles,
    commentImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    commentData: {
        marginLeft: 20
    }
});

function Comments(props) {

    const { 
        comments, 
        classes 
    } = props;

    return (
        <Grid container>
            {comments.map( (comment, index) => {
                const { body, createdAt, userImage, userHandle } = comment;
                return (
                    /*
                        A “key” is a special string attribute you need to include when creating lists of elements.
                        Keys help React identify which items have changed, are added, or are removed. 
                        Keys should be given to the elements inside the array to give the elements a stable identity
                    */
                    <Fragment key={createdAt}> {/* createdAt is valid as key because it almost will never be not unique */}
                        {/* <hr className={classes.visibleSeparator} /> */}
                        <Grid item sm={12}>
                            <Grid container>
                                <Grid item sm={2}>
                                    <img src={userImage} alt="Comment" className={classes.commentImage} />
                                </Grid>
                                <Grid item sm={9}>
                                    <div className={classes.commentData}>
                                        <Typography
                                            color="primary"
                                            variant="h6"
                                            component={Link}
                                            to={`/users/${userHandle}`}
                                        >
                                            {userHandle}
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            variant="body2"
                                        >
                                            {dayjs(createdAt).format('H:mm a, MMMM DD YYYY')}
                                        </Typography>
                                        <hr className={classes.invisibleSeparator} />
                                        <Typography variant="body1">
                                            {body}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* {index === (comments.length - 1) || (
                            <hr className={classes.visibleSeparator} />
                        )} */}
                        {index !== (comments.length - 1) && ( // horizontal rule is not rendered after last comment
                            <hr className={classes.visibleSeparator} />
                        )}
                    </Fragment>
                );
            })}
        </Grid>
    );

}

Comments.propTypes = {
    classes: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired // comments is directly passed as prop from ScreamDialog.js
}

const mapStateToProps = state => (
    {
        comments: state.data.scream.comments
    }
);

// export default withStyles(styles)(Comments);
export default connect(mapStateToProps)(withStyles(styles)(Comments));