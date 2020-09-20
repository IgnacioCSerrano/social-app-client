import {  
    SET_SCREAMS, 
    SET_SCREAM,
    POST_SCREAM,
    LIKE_SCREAM, 
    UNLIKE_SCREAM,
    SUBMIT_COMMENT,
    DELETE_SCREAM, 
    LOADING_DATA, 
    LOADING_UI, 
    STOP_LOADING_UI,
    SET_ERRORS, 
    CLEAR_ERRORS,
} from '../types';

import axios from 'axios';

export const clearErrors = () => dispatch => { // a function that just dispatches (creates) an action is called 'action creator'
    dispatch({ type: CLEAR_ERRORS });
}

export const getScreams = () => dispatch => {
    dispatch({ type: LOADING_DATA} );
    axios.get('/screams')
        .then(res => {
            dispatch({
                type: SET_SCREAMS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: SET_SCREAMS,
                payload: [] // clean screams array in case of error
            });
        });
}

export const getScream = screamId => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.get(`/scream/${screamId}`)
        .then(res => {
            dispatch({
                type: SET_SCREAM,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch(err => {
            console.error(err);
        });
}

export const postScream = newScream => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post('/scream', newScream)
        .then(res => {
            dispatch({
                type: POST_SCREAM,
                payload: res.data
            });
            dispatch( clearErrors() );
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
}

export const likeScream = screamId => dispatch => {
    axios.post(`/scream/${screamId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_SCREAM,
                payload: res.data
            });
        })
        .catch(err => {
            console.error(err);
        });
}

export const unlikeScream = screamId => dispatch => {
    axios.post(`/scream/${screamId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_SCREAM,
                payload: res.data
            });
        })
        .catch(err => {
            console.error(err);
        });
}

export const submitComment = (screamId, commentData, updateCount) => dispatch => {
    axios.post(`/scream/${screamId}/comment`, commentData)
        .then(res => {
            dispatch({ 
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch( clearErrors() );
            updateCount();
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
} 

export const deleteScream = screamId => dispatch => {
    axios.delete(`/scream/${screamId}`)
        .then(() => {
            dispatch({ 
                type: DELETE_SCREAM,
                payload: screamId 
            });
        })
        .catch(err => {
            console.error(err);
        });
}

export const getUserData = userHandle => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type: SET_SCREAMS,
                payload: res.data.screams 
                /* 
                    We do not need to set user details received (res.data.credentials) as payload here 
                    because user credentials are always the authenticated user ones so we can get them 
                    statically on the user page (profile state property).
                */
            });
        })
        .catch(err => {
            dispatch({
                type: SET_SCREAMS,
                payload: []
            })
        });
}