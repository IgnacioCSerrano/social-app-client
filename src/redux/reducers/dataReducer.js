import { 
    SET_SCREAMS, 
    SET_SCREAM,
    LIKE_SCREAM, 
    UNLIKE_SCREAM, 
    POST_SCREAM,
    DELETE_SCREAM,
    UPDATE_SCREAMS_IMAGE,
    SUBMIT_COMMENT,
    LOADING_DATA
} from '../types';

const initialState = {
    screams: [], // all screams array
    scream: {}, // one scream details
    loading: false
}

export default function(state = initialState, action) {
    let index;
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_SCREAMS:
            return {
                ...state,
                screams: action.payload,
                loading: false
            }
        case SET_SCREAM:
            return {
                ...state,
                scream: action.payload
            }
        case LIKE_SCREAM:
        case UNLIKE_SCREAM: // fall through
            /*
                First we get the index of the state screams array corresponding to the liked or unliked scream 
                (when we like or unlike a scream we get that scream back as payload in dataAction.js so we have
                access to its screamId). Then we replace in the state screams array the current scream (occupying 
                such index) with the returned scream (payload), which has the likeCount property updated.
            */
            index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
            state.screams[index] = action.payload;
            /*
                Now when a scream is liked/unliked from the home page, its likeCount is properly updated because 
                we are adjusting the screams state array. However when a scream is liked/inliked from the ScreamDialog 
                component (after clicking on its expanded button) we are not making use of the whole screams array 
                (getScreams() action) but the single scream object (getScream() action), so the like count is unaffected. 
                In order to update it we have to check whether the scream is being liked/unliked from the expanded dialog,
                which would imply that the screamId sent as payload is the same as the one stored in the state.
            */
            if (state.scream.screamId === action.payload.screamId) {
                state.scream = action.payload;
            }
            /*
                Originally we had set up our scream handler (backend) to return a liked/unliked scream without including its
                comments (which are stored in another collection) because they were not needed we like/unlike a scream from 
                the screams array on the home page (the scream state property is an empty object there). However everything
                changes when we give the possibility to like/unlike a scream from the expanded scream dialog, because here we
                are fetching one scream data, storing it in the global state and displaying all its comments (or none). When
                we replace the state scream for the returned scream in the last line we need it to have a comments array (full 
                or empty but not null) lest we have no comments to map on the Comments component and crash the app with an error.
                In conclusion, we have to modify the like/unlike handlers in our Cloud Function to include the comments pertaining 
                the liked/unliked scream.
            */
            return {
                ...state, // IMPORTANT TO RETURN SPREAD STATE AND NOT STATE DIRECTLY SO CHANGES ARE RENDERED ACCORDINGLY
            }
        case POST_SCREAM:
            let path = window.location.pathname;
            let userHandle = path.substring(path.lastIndexOf('/') + 1);
            if (path === '/' || userHandle === action.payload.userHandle) { // we do not want to display a recently created scream on screen if authenticated user has submitted it when browsing a user's profile page (/users/:handle) different than his
                return {
                    ...state,
                    screams: [
                        action.payload, // new scream is placed at the top of the screams array
                        ...state.screams
                    ]
                } 
            } else {
                return {
                    ...state
                }
            }
        /*
            Once we have deleted the scream we could call SET_SCREAMS (getScreams() action) in order to re-render 
            the Scream page (without the recently deleted one) but that is not efficient because we would be fetching 
            all screams (showing a loading page in the process) with an extra request that is not really necessary: 
            when we get a response from the deleteScream() action and dispatch DELETE_SCREAM type we know that the 
            scream has been successfully deleted on the server so we can just remove it from the local state (and
            that is why we are sending the deleted scream id as payload).
        */
        case DELETE_SCREAM:
            index = state.screams.findIndex(scream => scream.screamId === action.payload);
            state.screams.splice(index, 1); // splice changes the contents of an array by removing elements (just the one in the index position)
            return {
                ...state
            }
        case UPDATE_SCREAMS_IMAGE:
            state.screams.forEach(scream => {
                if (scream.userHandle === action.payload.userHandle) {
                    scream.userImage = action.payload.imageUrl;
                }
            });
            return {
                ...state,
            } 
        case SUBMIT_COMMENT: 
            /*
                We do not have to update commentCount in the screams array global state because we are handling comment 
                count as internal (local) Scream state and autoincrementing it accordingly in the updateCount callback 
                function whenever a new comment is submitted.
            */

            // index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
            // state.screams[index].commentCount++;

            state.scream.commentCount++;
            return {
                ...state,
                scream: {
                    ...state.scream,
                    comments: [
                        action.payload, // comment submitted has to be on the top of the comment array because it is the newest one
                        ...state.scream.comments
                    ]
                }
            }
        default:
            return state;
    }
}