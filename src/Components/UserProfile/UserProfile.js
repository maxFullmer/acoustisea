import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import UserData from '../UserData/UserData.js';

class UserProfile extends Component {
    render() {

        // console.log(this.props.user)
        // return (
        //     (!this.props.user) 
        //     ?
    return (
        <div>UserProfile
            <section>
                <div>
                    UserInfo Component:
                    profile image
                    username of logged in user
                    user bio
                </div>

            </section>

            <section>
                <div>
                   <UserData />
                </div>

                <nav>
                    <ul className="nav-grid">
                        <li><Link className="marbio" to="/marinebioacoustics">Marine Bioacoustics</Link></li>
                        <li><Link className="vv" to="/vesselsandvehicles">Vessels {"&"} Vehicles</Link></li>
                        <li><Link className="constrc" to="/construction">Construction</Link></li>
                        <li><Link className="environ" to="/environmental">Environmental</Link></li>
                    </ul>
                </nav>
            </section>
        </div>
    )
    }
}

function mapReduxStateToProps(reduxState){
    return reduxState
}

//since dispatch is a prop of the store, we imported the action creators from a reducer
const mapDispatchToProps = {
    
}

// we then put this list as the second parameter so we can tell store to update when a dispatch is called
export default connect(mapReduxStateToProps, mapDispatchToProps)(UserProfile);