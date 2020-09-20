import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Components

import MyButton from '../../util/MyButton';

// MUI Icons

import FavouriteIcon from '@material-ui/icons/Favorite';
import FavouriteBorder from '@material-ui/icons/FavoriteBorder'; 

// Redux

import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../../redux/actions/dataActions';

function LikeButton(props) {

    const isLiked = props.user.likes && props.user.likes.find(like => like.screamId === props.screamId); // if there are not likes stored in the user likes array then we know this scream has not been liked by them so we return false directly without even checking id match

    const likeScream = () => {
        props.likeScream(props.screamId);
    } 

    const unlikeScream = () => {
        props.unlikeScream(props.screamId);
    }

    const { authenticated } = props.user; 

    const likeButton = !authenticated ? (
        <Link to="/login">
            <MyButton tip="Like">
                <FavouriteBorder color="primary" />
            </MyButton>
        </Link>
    ) : ( isLiked ? (
        <MyButton tip="Undo like" onClick={unlikeScream}>
            <FavouriteIcon color="primary" />
        </MyButton>
    ) : (
        <MyButton tip="Like" onClick={likeScream}>
            <FavouriteBorder color="primary" />
        </MyButton>
    ));

    return likeButton;
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired // screamId is directly passed as prop from Scream.js and ScreamDialog.js
}

const mapActionsToProps = {
    likeScream,
    unlikeScream
}

const mapStateToProps = state => (
    {
        user: state.user
    }
);

export default connect(
    mapStateToProps, 
    mapActionsToProps
)(LikeButton);