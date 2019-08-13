import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
// import './_PublicData.scss';

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
                let selectedSubtopic = 'marBio';
                axios.get(`/api/publicData/${selectedSubtopic}`)
                .then(response => {
                    this.setState({
                        publicDataToDisplay: response.data
                    })
                })
                break;
            }
            case 'vesselsandvehicles': {
                let selectedSubtopic = 'VaV';
                axios.get(`/api/publicData/${selectedSubtopic}`)
                .then(response => {
                    this.setState({
                        publicDataToDisplay: response.data
                    })
                })
                break;
            }
            case 'structures': {
                let selectedSubtopic = 'strctr';
                axios.get(`/api/publicData/${selectedSubtopic}`)
                .then(response => {
                    this.setState({
                        publicDataToDisplay: response.data
                    })
                })
                break;
            }
            case 'environmental': {
                let selectedSubtopic = 'enviro';
                axios.get(`/api/publicData/${selectedSubtopic}`)
                .then(response => {
                    this.setState({
                        publicDataToDisplay: response.data
                    })
                })
                break;
            }
            case 'unknown': {
                let selectedSubtopic = 'unknown';
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

    goToOtherUserPage(event, id) {
        event.preventDefault();
        console.log('PublicObj.user_id: ', id)
        this.props.history.push(`/user/${id}`)
    }

    render() {
        console.log('props from subtopic display to public data component: ', this.props)
        let { publicDataToDisplay } = this.state;
        let { subtopic } = this.props;

        let headerIsSubtopic = (subtopic === 'marinebioacoustics') ? 'Marine Bioacoustics': 
        (subtopic === 'vesselsandvehicles') ? 'Vessels & Vehicles' :
        (subtopic === 'structures') ? 'Structures' :
        (subtopic === 'environmental') ? 'Environmental' :
        (subtopic === 'unknown') ? 'Unknown' :
        null;

        let mappedPublicData = publicDataToDisplay.map((publicDataObj, index) => {
            return (
                <div key={index} className="data-container">
                    <ul>
                        <li>
                            <div>Title</div>
                            <div>{publicDataObj.title}</div>
                        </li>
                        <li>
                            <div>File Type</div>
                            <div>{publicDataObj.file_type}</div>
                        </li>
                        <li>
                            <div>Category</div>
                            <div>{publicDataObj.subtopic}</div>
                        </li>
                        <li>
                            <div>Uploaded On</div>
                            <div>{publicDataObj.upload_date.slice(0,10)}</div>
                        </li>
                        <li>
                            <div>Description</div>
                            <div>{publicDataObj.data_summary}</div>
                        </li>
                        <li>
                            <div onClick={(event) => this.goToOtherUserPage(event, publicDataObj.user_id)}>
                                {publicDataObj.username}
                            </div>
                        </li>
                    </ul>
                </div>
            )
        })
        return (
            <div>
                <div>{headerIsSubtopic}</div>
                {mappedPublicData}
            </div>
        );
    }
}

export default withRouter(PublicData);
