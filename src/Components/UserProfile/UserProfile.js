import React from 'react';
import { Link } from 'react-router-dom';
import UserInfo from '../UserInfo/UserInfo.js'
import UserData from '../UserData/UserData.js';

function UserProfile() {
    return (
        <div>
            <section>
                <UserInfo />
            </section>

            <section>
                <nav>
                    <ul className="nav-grid">
                        <li><Link className="marbio" to="/marinebioacoustics">Marine Bioacoustics</Link></li>
                        <li><Link className="vv" to="/vesselsandvehicles">Vessels {"&"} Vehicles</Link></li>
                        <li><Link className="constrc" to="/construction">Construction</Link></li>
                        <li><Link className="environ" to="/environmental">Environmental</Link></li>
                    </ul>
                </nav>

                <UserData />
            </section>
        </div>
    )
}

export default UserProfile;