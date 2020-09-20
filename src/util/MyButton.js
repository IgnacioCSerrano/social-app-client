import React from 'react';

import Tooltip from '@material-ui/core/Tooltip'; // https://material-ui.com/components/tooltips/
import IconButton from'@material-ui/core/IconButton'; // icon built on top of Button

// export default (props) => (
//     <Tooltip title={props.tip} className={props.tipClassName} placement="top"> 
//         <IconButton onClick={props.onClick} className={props.btnClassName}>
//             {props.children}
//         </IconButton>
//     </Tooltip>
// );


export default ( { children, tip, tipClassName, btnClassName, onClick } ) => ( // destructured props (https://moox.io/blog/how-i-write-stateless-react-components/)
    // Navbar buttons tooltips are displayed on bottom despise having top placement because of lack of space

    <Tooltip title={tip} className={tipClassName} placement="top"> 
        <IconButton className={btnClassName} onClick={onClick}>
            {children}
        </IconButton>
    </Tooltip>
);
