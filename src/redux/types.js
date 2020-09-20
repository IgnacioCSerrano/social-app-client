/*
    It is not necessary to create types, they can be just string literals,
    but putting them into variables is a good practice because it makes
    less likely to have a mispellig error when calling the string.
*/

// User reducer types
export const LOADING_USER = 'LOADING_USER';
export const SET_AUTHENTICATED = 'SET_AUTHENTICATED'; // type variables are named in all caps by convention
export const SET_UNAUTHENTICATED = 'SET_UNAUTHENTICATED';
export const SET_EXPIRED = 'SET_EXPIRED';
export const SET_USER = 'SET_USER';
export const MARK_NOTIFICATIONS_READ = 'MARK_NOTIFICATIONS_READ';

// Data reducer types
export const LOADING_DATA = 'LOADING_DATA';
export const SET_SCREAMS = 'SET_SCREAMS';
export const SET_SCREAM = 'SET_SCREAM';
export const POST_SCREAM = 'POST_SCREAM';
export const LIKE_SCREAM = 'LIKE_SCREAM';
export const UNLIKE_SCREAM = 'UNLIKE_SCREAM';
export const DELETE_SCREAM = 'DELETE_SCREAM';
export const UPDATE_SCREAMS_IMAGE = 'UPDATE_SCREAMS_IMAGE';
export const SUBMIT_COMMENT = 'SUBMIT_COMMENT';

// UI reducer types
export const LOADING_UI = 'LOADING_UI';
export const STOP_LOADING_UI = 'STOP_LOADING_UI';
export const SET_ERRORS = 'SET_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';
