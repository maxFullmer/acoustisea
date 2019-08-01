import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'

function UserProfile() {
    return (
        <div>UserProfile
            <nav>
                <ul className="nav-grid">
                    <li><Link className="marbio" to="/marinebioacoustics">Marine Bioacoustics</Link></li>
                    <li><Link className="vv" to="/vesselsandvehicles">Vessels {"&"} Vehicles</Link></li>
                    <li><Link className="constrc" to="/construction">Construction</Link></li>
                    <li><Link className="environ" to="/environmental">Environmental</Link></li>
                </ul>
            </nav>
        </div>
    )
}

function mapReduxStateToProps(reduxState){
    return reduxState
}

//since dispatch is a prop of the store, we imported the action creators from a reducer
const mapDispatchToProps = {
    
}

// we then put this list as the second parameter so we can tell store to update when a dispatch is called
export default connect(mapReduxStateToProps, mapDispatchToProps)(UserProfile);