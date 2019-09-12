import queryString from 'query-string';
import React, { Component } from 'react';
import PublicData from '../PublicData/PublicData.js';

class SuptopicDisplayCenter extends Component {
    constructor(props) {
        super(props);
        let parsedQuery = queryString.parse(this.props.location.search);
        this.state = { 
            subtopic: parsedQuery.subtopic
         };
    }

    render() {
        return (
            <div>
                <section className="subtopic-nav">
                    <div className="wrap-collapsible">
                        <input id="collapsible" className="toggle" type="checkbox"/>
                        <label htmlFor="collapsible" className="lbl-toggle">Repositories</label>

                        <nav className="collapsible-content">
                            <ul className="content-inner">

                                <li id="marbio">
                                    <a className="nav-anchor" href="/publicdata?subtopic=marinebioacoustics">
                                        <button type="button" name="marinebioacoustics"
                                        >Marine Bioacoustics</button>
                                    </a>
                                </li>

                                <li id="vv">
                                    <a className="nav-anchor" href="/publicdata?subtopic=vesselsandvehicles">
                                        <button type="button" name="vesselsandvehicles"
                                        >Vessels {"&"} Vehicles</button>
                                    </a>
                                </li>

                                <li id="strctr">
                                    <a className="nav-anchor" href="/publicdata?subtopic=structures">
                                        <button type="button" name="structures"
                                        >Structures</button>
                                    </a>
                                </li>

                                <li id="environ"> 
                                    <a className="nav-anchor" href="/publicdata?subtopic=environmental">
                                        <button type="button" name="environmental"
                                        >Environmental</button>
                                    </a>
                                </li>

                                <li id="unknown">
                                    <a className="nav-anchor" href="/publicdata?subtopic=unknown">
                                        <button type="button" name="unknown"
                                        >Unknown</button>
                                   </a> 
                                </li>
                            </ul>
                        </nav>
                    </div>
                </section>

                <div id={`${this.state.subtopic}`}>
                    <PublicData subtopic={this.state.subtopic} />
                </div>
            </div>
            
        );
    }
}

export default SuptopicDisplayCenter;