import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import axios from 'axios';

class UserData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataToDisplay: [],
            dataTitle: "",
            file_type: "",
            isMarBio: true,
            isVaV: false,
            isCivilEgr: false,
            isEnviron: false,
            dataSummary: ""
        }
    }

    componentDidMount() {
        axios.get(`/api/user_data/${this.props.match.params.user_id}`)
        .then(response => {
            this.setState({
                dataToDisplay: response.data
            })
        })
    }

    subtopicHandler = (event) => {
        console.log(this.state.isMarBio)
        this.setState({
            isMarBio: false,
            isVaV: false,
            isCivilEgr: false,
            isEnviron: false,
            [event.target.id]: true
        })
    }

    textAreaHandler = (property, value) => {
        this.setState({
            [property]: value
        })
    }

    postDataDescription = () => {
        const { username, user_id } = this.props.user;
        const { dataTitle, file_type, isMarBio, isVaV, isCivilEgr, isEnviron, dataSummary } = this.state;
        const subtopicArray = [isMarBio, isVaV, isCivilEgr, isEnviron];

        axios.post(`/api/user_data_form`, 
            {
                username: username, 
                user_id: user_id, 
                title: dataTitle, 
                file_type: file_type, 
                subtopicArray: subtopicArray, 
                dataSummary: dataSummary
            })
        .then(response => {
            this.setState({
                dataToDisplay: [ ...this.state.dataArray, response.data]
            }) 
        })
    }

    render() {
        let { dataToDisplay } = this.state;
        let mappedUserData = dataToDisplay.map((dataObj, index) => {
            return (
                <div key={index}>
                    <ul>
                        <li>{dataObj.title}</li>
                        <li>{dataObj.file_type}</li>

                        <li>{dataObj.marineBio ? "Marine Bioacoustics" : null}</li>
                        <li>{dataObj.vehicle ? "Vessels & Vehicles" : null}</li>
                        <li>{dataObj.civilEgr ? "Civil Engineering" : null}</li>
                        <li>{dataObj.environmental ? "Environmental" : null}</li>

                        <li>{dataObj.upload_date.slice(0,10)}</li>
                        <li>{dataObj.description}</li>
                    </ul>
                </div>
            )
        })

        console.log('Data To Display: ', dataToDisplay)
        // console.log('session user: ', this.props.user)
        // console.log('match params id from URL: ', this.props.match.params.user_id)
        console.log('dataSummary: ', this.state.dataTitle)
        console.log('dataSummary: ', this.state.file_type)
        console.log('dataSummary: ', this.state.dataSummary)
        return (
            <div>
                <div>{mappedUserData}</div>
                <div>{
                    (this.props.user !== null 
                    && this.props.user.user_id === +this.props.match.params.user_id
                    ) 
                    ? 
                    (
                    <form>
                        <p>Title {"*"}:</p>
                        <div>
                        <textarea name="dataTitle" rows="1" cols="45" 
                            onChange={event => this.textAreaHandler(event.target.name, event.target.value)} />    
                        </div>

                        <p>Filename extension (i.e.: .zip, .png, .mat, ...) {"*"}:</p>
                        <div>
                        <textarea name="file_type" rows="1" cols="7" 
                            onChange={event => this.textAreaHandler(event.target.name, event.target.value)} />    
                        </div>
                        
                        <p>Category {"*"}:</p>
                        <div>
                            <input type="radio" name="category" id="isMarBio" checked={this.state.isMarBio}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isMarBio">Marine Bioacoustics</label>
                        
                            <input type="radio" name="category" id="isVaV" checked={this.state.isVaV}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isVaV">Vessels {"&"} Vehicles</label>
                        
                            <input type="radio" name="category" id="isCivilEgr" checked={this.state.isCivilEgr}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isCivilEgr">Civil Engineering</label>
                            
                            <input type="radio" name="category" id="isEnviron" checked={this.state.isEnviron}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isEnviron">Environmental</label>
                        </div>

                        <p>Please add a description of your data</p>
                        <div>
                            <textarea name="dataSummary" rows="5" cols="45" 
                            onChange={event => this.textAreaHandler(event.target.name, event.target.value)} />
                        </div>

                        <div>
                            <button type="submit" onSubmit={this.postDataDescription}>Submit</button>
                        </div>
                    </form> 
                    )
                    :
                    null}
                </div>
            </div> 
        );
    }
}

function mapReduxStateToProps(reduxState){
    return reduxState
}

//since dispatch is a prop of the store, we imported the action creators from a reducer
const mapDispatchToProps = {
    getUserSession
}

export default withRouter(connect(mapReduxStateToProps, mapDispatchToProps)(UserData));