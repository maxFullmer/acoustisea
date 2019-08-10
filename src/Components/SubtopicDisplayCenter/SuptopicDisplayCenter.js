import queryString from 'query-string';
import React, { Component } from 'react';
import PublicData from '../PublicData/PublicData.js';
// import './_SubtopicDisplayCenter.scss';

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
            <PublicData subtopic={this.state.subtopic} />
        );
    }
}

export default SuptopicDisplayCenter;