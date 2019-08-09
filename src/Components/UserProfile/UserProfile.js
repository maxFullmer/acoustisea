import React, {Component } from 'react';
import UserInfo from '../UserInfo/UserInfo.js'
import UserData from '../UserData/UserData.js';
import '../UserProfile.scss'

class UserProfile extends Component {
    routeHandler = (event) => {
        this.props.history.push(`/publicdata?subtopic=${event.target.name}`)
    }
    render() {
    return (
        <div>
            <section>
                <UserInfo />
            </section>

            <section>
                <nav>
                    <ul className="nav-grid">
                        <li>
                            <button className="marbio" name="marinebioacoustics" 
                            onClick={(event) => this.routeHandler(event)}>Marine Bioacoustics</button>
                        </li>
                        <li>
                            <button className="vv" name="vesselsandvehicles"
                            onClick={(event) => this.routeHandler(event)}>Vessels {"&"} Vehicles</button>
                        </li>
                        <li>
                            <button className="constrc" name="structures"
                            onClick={(event) => this.routeHandler(event)}>Construction</button>
                        </li>
                        <li>
                            <button className="environ" name="environmental"
                            onClick={(event) => this.routeHandler(event)}>Environmental</button>
                        </li>
                    </ul>
                </nav>

                <UserData />
            </section>
        </div>
    )
    }
}

export default UserProfile;