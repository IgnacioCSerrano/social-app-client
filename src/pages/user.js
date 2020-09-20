import React, { /* Component, */ useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Components

import Scream from '../components/scream/Scream';
import StaticProfile from '../components/profile/StaticProfile';
import ScreamSkeleton from '../util/ScreamSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

// Redux

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

const styles = theme => ({
    ...theme.styles
});

function User(props) {
// class user extends Component {

    // constructor() {
    //     super();
    //     this.state = {
    //         profile: null,
    //         screamIdParam: null
    //     }
    // }

    const [profile, setProfile] = useState(null);
    const [screamIdParam, setScreamIdParam] = useState(null);

    // componentDidMount() {
    //     const handle = this.props.match.params.handle;
    //     const screamId = this.props.match.params.screamId;
    //     if (screamId) {
    //         this.setState({ screamIdParam: screamId });
    //     }
    //     this.props.getUserData(handle);
    //     axios.get(`/user/${handle}`)
    //         .then(res => {
    //             this.setState({ profile: res.data.credentials });
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }

    const fetchUser = () => {
        const handle = props.match.params.handle; // match holds details about base URL, pathname, etc (we have defined 'handle' as a route parameter in the Route path attribute in App.js)
        const screamId = props.match.params.screamId 
        if (screamId) { // if screamId is not undefined then we are accesing a scream and not the profile page of a user
            // this.setState({ screamIdParam: screamId });
            setScreamIdParam(screamId);
        }
        props.getUserData(handle); 
        axios.get(`/user/${handle}`) // same request we send from getUserData action in dataAction.js but for fetching user details instead of screams array
            .then(res => {
                /*
                    This profile (res.data.credentials) is going to remain static (unchanged) so it is not necessary to set a 
                    redux action like we did for the screams array because we do not need to store it in our global state,
                    therefore we can fetch it and have it locally inside the component.
                */
                setProfile(res.data.credentials);
            })
            .catch(err => {
                console.log(err);
            });
    }
    
    useEffect( fetchUser, []);

    // render() {

    const { screams, loading } = props.data; // this.props.data
    // const { profile, screamIdParam } = this.state

    const screamsMarkup = loading ? (
        // <p>Loading screams...</p>
        <ScreamSkeleton />
    ) : (screams.length === 0) ? (
        <p>No screams from this user</p>
    ) : !screamIdParam ? (
        screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    ) : (
        screams.map(scream => { // we need to find the scream whose id is equal to screamIdParam (if any) and pass it a prop (openDialog) so we will know which scream to open once the page loads 
            if (scream.screamId !== screamIdParam) {
                return <Scream key={scream.screamId} scream={scream} />
            } else {
                return <Scream key={scream.screamId} scream={scream} openDialog /> // this passes a prop openDialog with a value of true (although we are prop drilling it is acceptable because it is just one property and not massive objects or updates)
            }
        }) 
    );

    return (
        <Grid container spacing={2}>
            <Grid item xl={8} md={8} sm={8} xs={12}>
                {screamsMarkup}
            </Grid>
            <Grid item xl={4} md={4} sm={4} xs={12}>
                {/*
                    We need to check whether profile is or not null (falsy) so as not to pass a null profile object 
                    as prop to the StaticProfile component (which would cause an error in the prop destructuring).
                */}
                {!profile // profile === null
                ? (
                    // <p>Loading profile...</p>
                    <ProfileSkeleton />
                ) : (
                    <StaticProfile profile={profile} />
                )}
            </Grid>
        </Grid>
    );

    // }

}

User.propTypes = {
    data: PropTypes.object.isRequired,
    getUserData: PropTypes.func.isRequired
}

const mapStateToProps = state => (
    {
        data: state.data
    }
);

export default connect(
    mapStateToProps,
    { getUserData }
)(withStyles(styles)(User));