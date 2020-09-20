import React, { /*Component, useState,*/ useEffect } from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';

// Components

import Scream from '../components/scream/Scream';
import Profile from '../components/profile/Profile';
import ScreamSkeleton from '../util/ScreamSkeleton';

// Material UI framework

import Grid from '@material-ui/core/Grid';

// Redux

import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';

function Home(props) { // a functional component that starts with lowercase is not considered as such by React (React Hook "useState" is called in function "home" which is neither a React function component or a custom React Hook function)
// class home extends Component {

//     constructor() {
//         super();
//         this.state = {
//             screams: null
//         }
//     }

    // const [screams, setScreams] = useState(null);

    /*
        The way we set up the base URL of our API (Cloud Function endpoint) in React is, 
        instead of using it everywhere, we add it as a "proxy" property in the package.json,
        where it can be fetched by the axios library.
        
        Since Firebase will discard Node 8 in a future and function deployment will require a paying bill, 
        we set up "proxy" to point to the API function initialised in the emulator (firebase emulators:start). 
        Serving firebase (firebase serve) is not a valid option because we have trigger functions as well and
        they cannot be operative without emulating Firestore database.

        NOTE: React server needs to be restarted when a new proxy is set or update.
    */

    // componentDidMount() {
    //     axios.get('/screams') 
    //         .then(res => {
    //             // console.log(res.data);
    //             this.setState({
    //                 screams: res.data
    //             })
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         });
    // }

    // useEffect( () => {
    //     axios.get('/screams') 
    //         .then(res => {
    //             // console.log(res.data);
    //             setScreams(res.data);
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         });
    // }, []);

    const { 
        data: { 
            screams, 
            loading 
        }, 
        getScreams 
    } = props;

    useEffect( getScreams, []);

    // render() {
    //     let recentScreamMarkup = this.state.screams 
    //         ? this.state.screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    //         : <p>Loading...</p>

    let recentScreamMarkup = loading
        // ? <p>Loading...</p>
        ? <ScreamSkeleton />
        : screams.map(scream => <Scream key={scream.screamId} scream={scream} />)

    return (
        <Grid container spacing={2}> {/* https://material-ui.com/components/grid/#spacing */}
            <Grid item xl={8} md={8} sm={8} xs={12}> {/* https://material-ui.com/customization/breakpoints/#default-breakpoints */}
                {recentScreamMarkup}
            </Grid>
            <Grid item xl={4} md={4} sm={4} xs={12}>
                <Profile />
            </Grid>
        </Grid>
    );
    
    // }
}

Home.propTypes = {
    getScreams: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => (
    {
        data: state.data // data reducer puts all the data in a data property (store.js)
    }
);

export default connect(mapStateToProps, { getScreams} )(Home);