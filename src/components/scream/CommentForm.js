import React, { /* Component, */ useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Material UI framework

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

// Redux

import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.styles
});

function CommentForm(props) {
// class CommentForm extends Component {

    // constructor() {
    //     super();
    //     this.state = {
    //         body: '',
    //         submitted: false,
    //         errors: {}
    //     }
    // }

    const [ body, setBody ] = useState('');
    const [ errors, setErrors ] = useState( {} ); 

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     if (nextProps.ui.errors) {
    //         this.setState({ errors: nextProps.ui.errors });
    //     }
    //     if (!nextProps.ui.errors && !nextProps.ui.loading) {
    //         this.setState({ body: '' });
    //     }
    // }

    // static getDerivedStateFromProps(props, state) {
    //     if (props.ui.errors) {
    //         return { 
    //             errors: props.ui.errors 
    //         };
    //     }
    //     if (!props.ui.errors && !props.ui.loading && state.submitted) {
    //         return {
    //             open: false,
    //             submitted: false,
    //             body: ''
    //         }
    //     }
    //     return null;
    // }

    useEffect( () => {
        setErrors( props.ui.errors ? props.ui.errors : {} );
        if (!props.ui.errors && !props.ui.loading) {
            setBody('');
        }
    }, [props] );

    const handleChange = event => {
        // this.setState({ [event.target.name]: event.target.value });
        setBody(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();
        // this.setState({ submitted: true });
        props.submitComment(props.screamId, { body }, props.updateCount); // this.props.submitComment(this.props.screamId, { body: this.state.body }, this.props.props.updateCount);
    }

    // render() {
    //     const { classes, authenticated } = this.props;
    //     const errors = this.state.errors;

    const { 
        classes, 
        authenticated 
    } = props;

    const commentFormMarkup = authenticated ? (
        <Grid 
            item // this must be a Grid item because this component is rendered inside a Grid container on ScreamDialog.js
            sm={12}
            style={{ textAlign: 'center' }}
        >
            <form onSubmit={handleSubmit}> {/* this.handleSubmit */}
                <TextField
                    name="body"
                    type="text"
                    label="Comment on Scream"
                    error={!!errors.comment} // errors.comment ? true : false
                    helperText={errors.comment}
                    value={body} // this.state.body
                    onChange={handleChange} // this.handleChange
                    fullWidth
                    className={classes.textField} 
                />
                <Button 
                    type="submit"
                    color="primary"
                    variant="contained"
                    className={classes.button}
                >
                    Submit
                </Button>
            </form>
            <hr className={classes.visibleSeparator} />
        </Grid>
    ) : null;

    return commentFormMarkup;

    // }

}

CommentForm.propTypes = {
    classes: PropTypes.object.isRequired,
    submitComment: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired,
    screamId : PropTypes.string.isRequired // screamId is directly passed as prop from ScreamDialog.js
}

const mapStateToProps = state => (
    {
        ui: state.ui,
        authenticated: state.user.authenticated
    }
);

export default connect(
    mapStateToProps, 
    { submitComment }
)(withStyles(styles)(CommentForm));