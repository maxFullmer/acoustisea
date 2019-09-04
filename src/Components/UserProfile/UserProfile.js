import React, { Component } from 'react';
import UserInfo from '../UserInfo/UserInfo.js';
import UserData from '../UserData/UserData.js';


class UserProfile extends Component {
    routeHandler = (event) => {
        this.props.history.push(`/publicdata?subtopic=${event.target.name}`)
    }
    render() {
    return (
        <div>
            <section className="user-info"> 
                <UserInfo />
            </section>

            <section className="subtopic-nav">
                <div className="wrap-collapsible">
                    <input id="collapsible" class="toggle" type="checkbox"/>
                    <label for="collapsible" class="lbl-toggle">Explore</label>

                    <nav className="collapsible-content">
                        <ul className="content-inner">
                            <li id="marbio">
                                <button type="button" name="marinebioacoustics"
                                onClick={(event) => this.routeHandler(event)}>Marine Bioacoustics</button>
                            </li>
                            <li id="vv">
                                <button type="button" name="vesselsandvehicles"
                                onClick={(event) => this.routeHandler(event)}>Vessels {"&"} Vehicles</button>
                            </li>
                            <li id="strctr">
                                <button type="button" name="structures"
                                onClick={(event) => this.routeHandler(event)}>Structures</button>
                            </li>
                            <li id="environ"> 
                                <button type="button" name="environmental"
                                onClick={(event) => this.routeHandler(event)}>Environmental</button>
                            </li>
                            <li id="unknown">
                                <button type="button" name="unknown"
                                onClick={(event) => this.routeHandler(event)}>Unknown</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>   

            <section className="user-data">
                <span>Contributions</span>
                <UserData />
            </section>
        </div>
    )
    }
}

export default UserProfile;