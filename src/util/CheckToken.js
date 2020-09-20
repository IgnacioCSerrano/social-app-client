import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { checkToken } from '../redux/actions/userActions';
import { useHistory } from 'react-router-dom';

function CheckToken(props) { // renderless component to handle token validity
    props.checkToken( useHistory() );
    return null;
}

CheckToken.propTypes = {
    checkToken: PropTypes.func.isRequired
}

export default connect(
    null, 
    { checkToken }
)(CheckToken);