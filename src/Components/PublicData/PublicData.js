import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

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

    downloadable = (event) => {
        if(!this.props.user) {
            event.preventDefault();
            toast.error("You must have an account to download")
            this.props.history.push("/")
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
                            <div className="col-name">Title</div>
                            <div className="the-meat title">{publicDataObj.title}</div>
                        </li>
                        <li>
                            <div className="col-name">File Type</div>
                            <div className="the-meat">{publicDataObj.file_type}</div>
                        </li>
                        <li>
                            <div className="col-name">Category</div>
                            <div className="the-meat">{publicDataObj.subtopic}</div>
                        </li>
                        <li>
                            <div className="col-name">Uploaded On</div>
                            <div className="the-meat">{publicDataObj.upload_date.slice(0,10)}</div>
                        </li>
                        <li>
                            <div className="col-name">Description</div>
                            <div className="the-meat">{publicDataObj.data_summary}</div>
                        </li>
                        <li>
                            <div className="col-name">File</div>
                            <div className="the-meat"><a href={`${publicDataObj.s3link}`} download={`${publicDataObj.title}.${publicDataObj.file_type}`} onClick={this.downloadable}>DOWNLOAD</a></div>
                        </li>
                        <li>
                            <div className="col-name">Contibutor</div>
                            <div className="the-meat" 
                                    onClick={(event) => this.goToOtherUserPage(event, publicDataObj.user_id)}>
                                <button>{publicDataObj.username}</button>
                            </div>
                        </li>
                    </ul>
                </div>
            )
        })
        return (
            <div>
                <h1>{headerIsSubtopic}</h1>
                {mappedPublicData}
            </div>
        );
    }
}

export default withRouter(PublicData);
