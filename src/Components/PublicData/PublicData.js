import React, { Component } from 'react';
import axios from 'axios';

class PublicData extends Component {
    constructor(props) {
        super(props)

        this.state = {
            publicDataToDisplay: []
        }
    }

    componentDidMount() {
        //take parsed query with the value of the subtopic from parent props
        const { subtopic } = this.props;
        console.log('props in componentDidMount: ', subtopic)
        //set selected subtopic to database column name that we are sending to backend
        switch(subtopic) {
            case 'marinebioacoustics': {
                let selectedSubtopic = 'marine_bio';
                axios.get(`/api/publicData/${selectedSubtopic}`)
                .then(response => {
                    this.setState({
                        publicDataToDisplay: response.data
                    })
                })
                break;
            }
            case 'vesselsandvehicles': {
                let selectedSubtopic = 'vehicle';
                axios.get(`/api/publicData/${selectedSubtopic}`)
                .then(response => {
                    this.setState({
                        publicDataToDisplay: response.data
                    })
                })
                break;
            }
            case 'civilengineering': {
                let selectedSubtopic = 'civil_egr';
                axios.get(`/api/publicData/${selectedSubtopic}`)
                .then(response => {
                    this.setState({
                        publicDataToDisplay: response.data
                    })
                })
                break;
            }
            case 'environmental': {
                let selectedSubtopic = 'environmental';
                axios.get(`/api/publicData/${selectedSubtopic}`)
                .then(response => {
                    this.setState({
                        publicDataToDisplay: response.data
                    })
                })
                break;
            }
            default: 
                console.log('query string failed, no data should be showing.')
        }    
    }
    render() {
        console.log('props from subtopic display to public data component: ', this.props)
        let { publicDataToDisplay } = this.state;
        let mappedPublicData = publicDataToDisplay.map((publicDataObj, index) => {
            return (
                <div key={index}>
                    <ul>
                        <li>{publicDataObj.title}</li>
                        <li>{publicDataObj.file_type}</li>
                        <li>{publicDataObj.upload_date.slice(0,10)}</li>
                        <li>{publicDataObj.data_summary}</li>
                        <li>{publicDataObj.username}</li>
                    </ul>
                </div>
            )
        })
        return (
            <div>
                {mappedPublicData}
            </div>
        );
    }
}

export default PublicData;
