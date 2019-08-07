import queryString from 'query-string';
import React, { Component } from 'react';
import PublicData from '../PublicData/PublicData.js';

class SuptopicDisplayCenter extends Component {
    constructor(props) {
        super(props);
        const parsedQuery = queryString.parse(this.props.location.search);
        this.state = { 
            subtopic: parsedQuery.subtopic,
         };
    }
    render() {
        return (
            //send parsed query to child now that state was updated with it
            <PublicData subtopic={this.state.subtopic} />
        );
    }
}

export default SuptopicDisplayCenter;