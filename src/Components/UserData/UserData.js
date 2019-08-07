import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import axios from 'axios';

class UserData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataInfoToDisplay: [],
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
                dataInfoToDisplay: response.data
            })
        })
    }

    subtopicHandler = (event) => {
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

    postDataInfo = (event) => {
        event.preventDefault();

        const { username, user_id } = this.props.user;
        const { dataTitle, file_type, isMarBio, isVaV, isCivilEgr, isEnviron, dataSummary } = this.state;
        const subtopicArray = [isMarBio, isVaV, isCivilEgr, isEnviron];

        axios.post('/api/user_data_form', 
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
                dataInfoToDisplay: [ ...this.state.dataInfoToDisplay, response.data]
            }) 
        })
    }

    updateDataInfo = () => {

    }

    // downloadS3 = () => {
    //     if(this.props.user) {
    //         axios.get('AMAZONS3',
    //         // dataObj belongs to mapping data Info objects from the dataArray
    //         {
    //             data_id: dataObj.data_id,
    //             username: dataObj.username,
    //             user_id: dataObj.user_id
    //         })
    //         .then(response => {
    //             // figure out how to get the file to the requester... => something: response
    //         })
    //     } else {
    //         //get toastify up in here
    //         alert('Please log in/register to download')
    //         // show login button to redirect to login/register
    //     }
    // }

    render() {
        let { dataInfoToDisplay } = this.state;
        let mappedUserData = dataInfoToDisplay.map((dataObj, index) => {
            return (
                <div key={index}>
                    <ul>
                        <li>{dataObj.title}</li>
                        <li>{dataObj.file_type}</li>
                        <li>{dataObj.marine_bio ? "Marine Bioacoustics" : null}                        </li>
                        <li>{dataObj.vehicle ? "Vessels & Vehicles" : null}</li>
                        <li>{dataObj.civil_egr ? "Civil Engineering" : null}</li>
                        <li>{dataObj.environmental ? "Environmental" : null}</li>
                        <li>{dataObj.upload_date.slice(0,10)}</li>
                        <li>{dataObj.data_summary}</li>
                        <li>{
                            (this.props.user !== null 
                            && this.props.user.user_id === +this.props.match.params.user_id
                            ) 
                            ? 
                            <button onChange={(event) => this.updateDataInfo(event)}>EDIT</button>
                            :
                            null}
                        </li>
                        {/* <li><button onClick={this.downloadS3}>DOWNLOAD</button></li> */}
                    </ul>
                </div>
            )
        })

        console.log('dataInfoToDisplay: ', this.state.dataInfoToDisplay)

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
                            <button type="submit" onSubmit={(event) => this.postDataInfo(event)}>Submit</button>
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