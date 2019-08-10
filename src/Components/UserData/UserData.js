import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
// import './_UserData.scss';

class UserData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataInfoToDisplay: [],
            dataTitle: "",
            file_type: "",
            isMarBio: true,
            isVaV: false,
            isStrctr: false,
            isEnviro: false,
            isUnknown: false,
            dataSummary: "",
            showFormAdd: false,
            showFormUpdate: false,
            selectedDataInfo: null
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
            isStrctr: false,
            isEnviro: false,
            isUnknown: false,
            [event.target.id]: true
        })
    }

    textAreaHandler = (event) => {
        const property = event.target.name;
        const value = event.target.value
        this.setState({
            [property]: value
        })
    }

    toggleFormRenderAdd = (event) => {
        event.preventDefault();
        if (!this.state.showFormUpdate) {
        this.setState(
            {
                showFormAdd: !this.state.showFormAdd,
            })
        }
    }

    toggleFormRenderUpdate = (event, keyORindex = null) => {
        event.preventDefault();
        if(!this.state.showFormAdd) {
        this.setState(
            {
                showFormUpdate: !this.state.showFormUpdate,
                selectedDataInfo: keyORindex
            })
        }    
    }

    // hideFormOnCancelClick = (event) => {
    //     event.preventDefault();
    //     this.setState(
    //         {
    //             showFormUpdate: !this.state.showFormUpdate,
    //             selectedDataInfo: keyORindex
    //         })
    // }

    // HEROKU/POSTGRES DATABASE REQUESTS

    postDataInfo = (event) => {
        event.preventDefault();

        let { username, user_id } = this.props.user;
        let { dataTitle, file_type, isMarBio, isVaV, isStrctr, isEnviro, isUnknown, dataSummary } = this.state;
        let subtopic = 
            isMarBio ? 'marBio' : 
            isVaV ? 'VaV' :
            isStrctr ? 'strctr' :
            isEnviro ? 'enviro' :
            isUnknown ? 'unknown' :
            null;
        
        console.log('subtopic selected inside post function onSubmit', subtopic)

        axios.post('/api/user_data_form', 
            {
                username: username, 
                user_id: user_id, 
                title: dataTitle, 
                file_type: file_type, 
                subtopic: subtopic, 
                dataSummary: dataSummary
            })
        .then(response => {
            this.setState({
                dataInfoToDisplay: [ ...this.state.dataInfoToDisplay, response.data]
            })
        })
    }

    updateDataInfo = (event, dataId, keyOrIndex) => {
        event.preventDefault();
        
        let { user_id } = this.props.user;
        let { dataInfoToDisplay, dataTitle, file_type, isMarBio, isVaV, isStrctr, isEnviro, isUnknown, dataSummary } = this.state;
        let subtopic = 
            isMarBio ? 'marBio' : 
            isVaV ? 'VaV' :
            isStrctr ? 'strctr' :
            isEnviro ? 'enviro' :
            isUnknown ? 'unknown' :
            null;

        console.log('data_id: ', dataId)
        console.log('session user for delete: ', this.props.user.user_id)
        console.log('key/index: ', keyOrIndex)

        axios.put('/api/user_data_form', 
        {
            title: dataTitle, 
            file_type: file_type, 
            subtopic: subtopic, 
            dataSummary: dataSummary,
            data_id: dataId,
            user_id: user_id
        })
        .then(response => {
            this.setState({
                dataInfoToDisplay: dataInfoToDisplay.splice(keyOrIndex,1,response.data)
            })
        })
    }

    deleteDataInfo = (event, dataId) => {
        event.preventDefault();

        axios.delete(`/api/user_data/${this.props.user.user_id}?data_id=${dataId}`)
        .then(response => {
            this.setState({
                dataInfoToDisplay: response.data
            })
        })
    }

    // AMAZON S3 REQUESTS

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
        let { dataInfoToDisplay, showFormAdd, showFormUpdate, selectedDataInfo } = this.state;
        let addOrUpdateForm = 
             (
                <div>
                    <form>
                        <p>Title {"*"}:</p>
                        <div>
                        <textarea name="dataTitle" rows="1" cols="45" value={this.state.dataTitle}
                            onChange={event => this.textAreaHandler(event)} />    
                        </div>

                        <p>Filename extension (i.e.: .zip, .png, .mat, ...) {"*"}:</p>
                        <div>
                        <textarea name="file_type" rows="1" cols="7" value={this.state.file_type}
                            onChange={event => this.textAreaHandler(event)} />    
                        </div>
                        
                        <p>Category {"*"}:</p>
                        <div>
                            <input type="radio" name="category" id="isMarBio" checked={this.state.isMarBio}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isMarBio">Marine Bioacoustics</label>
                        
                            <input type="radio" name="category" id="isVaV" checked={this.state.isVaV}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isVaV">Vessels {"&"} Vehicles</label>
                        
                            <input type="radio" name="category" id="isStrctr" checked={this.state.isStrctr}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isStrctr">Structures</label>
                            
                            <input type="radio" name="category" id="isEnviron" checked={this.state.isEnviron}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isEnviron">Environmental</label>

                            <input type="radio" name="category" id="isUnknown" checked={this.state.isUnknown}
                            onChange={event => this.subtopicHandler(event)}/>
                            <label htmlFor="isUnknown">Unknown</label>
                        </div>

                        <p>Please add a description of your data</p>
                        <div>
                            <textarea name="dataSummary" rows="5" cols="45" value={this.state.dataSummary}
                            onChange={event => this.textAreaHandler(event)} />
                        </div>

                        <div>{
                            (showFormAdd && !showFormUpdate)
                            ?
                            <div>
                                <button id="submitadd" type="submit" onClick={(event) => this.postDataInfo(event)}>Submit</button>
                                <button id="canceladd" type="button" onClick={(event) => this.toggleFormRenderAdd(event)}>Cancel</button>
                            </div>
                            :
                            <div>
                                <button id="submitupdate" type="submit" onClick={(event) => this.updateDataInfo(event)}>Submit</button>
                                <button id="cancelupdate" type="button" onClick={(event) => this.toggleFormRenderUpdate(event)}>Cancel</button>
                            </div>
                            }
                        </div>
                        
                    </form> 
                </div>
        )

        
        let mappedUserData = dataInfoToDisplay.map((dataObj, index) => {
            return (
                <div key={index}>
                    <ul>
                        <li>{dataObj.title}</li>
                        <li>{dataObj.file_type}</li>
                        <li>{dataObj.subtopic}</li>
                        <li>{dataObj.upload_date.slice(0,10)}</li>
                        <li>{dataObj.data_summary}</li>
                        {/* <li><button onClick={this.downloadS3}>DOWNLOAD</button></li> */}
                    </ul>
                    <div>{
                            (this.props.user !== null 
                            && this.props.user.user_id === +this.props.match.params.user_id
                            ) 
                            ?
                                (selectedDataInfo === index && showFormUpdate && !showFormAdd) 
                                ?
                                addOrUpdateForm
                                :
                                <div>
                                    <button type="submit" onClick={(event) => this.toggleFormRenderUpdate(event, index)}>EDIT</button>
                                    <button type="submit" onClick={(event) => this.deleteDataInfo(event, dataObj.data_id)}>DELETE</button>
                                </div>
                            :
                            null}
                    </div>
                </div>
            )
        })

        // console.log('title', this.state.dataTitle)
        // console.log('file_type', this.state.file_type)
        // console.log('isMarBio', this.state.isMarBio)
        // console.log('isVaV', this.state.isVaV)
        // console.log('data description', this.state.dataSummary)

        
        return (
            <div>
                <div>{mappedUserData}</div>
                <div>{
                    (this.props.user !== null 
                    && this.props.user.user_id === +this.props.match.params.user_id
                    ) 
                    ? 
                    <div>{
                        (showFormAdd && !showFormUpdate)
                        ?
                        addOrUpdateForm
                        :
                        <button type="button" onClick={(event) => this.toggleFormRenderAdd(event)} >ADD +</button>}
                    </div>
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