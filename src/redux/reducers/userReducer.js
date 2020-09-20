import { 
    SET_USER, 
    SET_AUTHENTICATED, 
    SET_UNAUTHENTICATED,
    SET_EXPIRED,
    LOADING_USER,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    MARK_NOTIFICATIONS_READ
} from '../types';

const initialState = {
    authenticated: false,
    expired: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state, // each time we return state we spread it and then change authenticated (which is itself a state property so we have to spread first in order to modify previous value)
                authenticated: true,
                expired: false
            }
        case SET_UNAUTHENTICATED: // log out
            return initialState;
        case SET_EXPIRED: // token expired
            return {
                ...state,
                expired: true
            }
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload // this is res.data from getUserData action (userAction.js); by spreading payload we are binding each user data property with its corresponding (credentials, likes and notifications) 
            }
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case LIKE_SCREAM:
            return {
                ...state,
                likes: [
                    ...state.likes, // we spread the state likes array and then add a new liked scream (returned in the payload)
                    {
                        userHandle: state.credentials.userHandle,
                        screamId: action.payload.screamId
                    }
                ]
            }
        case UNLIKE_SCREAM:
            return {
                ...state,
                likes: state.likes.filter(like => like.screamId !== action.payload.screamId) // we use filter higher order function to remove unliked scream
            }
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach(n => n.read = true);
            return {
                ...state // IMPORTANT TO RETURN SPREAD STATE AND NOT STATE DIRECTLY SO CHANGES ARE RENDERED ACCORDINGLY
            }
        default:
            return state;
    }
}