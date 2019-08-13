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
            file: null,
            showFormAdd: false,
            showFormUpdate: false,
            selectedDataInfoMapIndex: null,
            selectedDataInfoId: null
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

    // FRONT END MANAGEMENT FUNCTIONS

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
            this.setState( {showFormAdd: !this.state.showFormAdd} )
        }
    }

    toggleFormRenderUpdate = (event, dataId, keyORindex = null) => {
        event.preventDefault();
        if(!this.state.showFormAdd) {
        this.setState(
            {
                showFormUpdate: !this.state.showFormUpdate,
                selectedDataInfoMapIndex: keyORindex,
                selectedDataInfoId: dataId
            })
        }    
    }

    // DATABASE REQUESTS

    handleFileUpload = (event) => {
        this.setState({file: event.target.files});
    }

    postDataInfoAndFile = (event) => {
        event.preventDefault();

        if (!this.state.file) {
            alert('Cannot proceed without a file selected')
        } 
        else {
            let { username, user_id } = this.props.user;
            let { dataTitle, file_type, isMarBio, isVaV, isStrctr, isEnviro, isUnknown, dataSummary } = this.state;
            let subtopic = 
                isMarBio ? 'marBio' : 
                isVaV ? 'VaV' :
                isStrctr ? 'strctr' :
                isEnviro ? 'enviro' :
                isUnknown ? 'unknown' :
                null;
            
            console.log('subtopic selected inside upload file', subtopic)

            let formData = new FormData();
            formData.append('file', this.state.file[0]);
            
            axios.post(`/api/data_file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log('upload file S3 response: ', response)

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
                    console.log('upload file info db response: ')

                    this.setState({
                        dataInfoToDisplay: [ ...this.state.dataInfoToDisplay, response.data],
                        showFormAdd: false
                    })
                })
                .catch(error => {console.log(error)} )
            })
            .catch(error => {console.log(error)} );
        }
    }
        
    updateDataInfo = (event) => {
        event.preventDefault();
        
        let { user_id } = this.props.user;
        let { dataInfoToDisplay, dataTitle, file_type, isMarBio, isVaV, isStrctr, isEnviro, isUnknown, dataSummary, selectedDataInfoId, selectedDataInfoMapIndex } = this.state;
        let subtopic = 
            isMarBio ? 'marBio' : 
            isVaV ? 'VaV' :
            isStrctr ? 'strctr' :
            isEnviro ? 'enviro' :
            isUnknown ? 'unknown' :
            null;

        console.log('data_id: ', selectedDataInfoId)
        console.log('session user for delete: ', this.props.user.user_id)
        console.log('key/index: ', selectedDataInfoMapIndex)

        axios.put('/api/user_data_form', 
        {
            title: dataTitle, 
            file_type: file_type, 
            subtopic: subtopic, 
            dataSummary: dataSummary,
            data_id: selectedDataInfoId,
            user_id: user_id
        })
        .then(response => {
            console.log('update response', response)
            let newDataArray = dataInfoToDisplay.slice();
            newDataArray[selectedDataInfoMapIndex] = response.data;

            this.setState( {dataInfoToDisplay: newDataArray} )
        })
    }

    deleteDataInfo = (event, dataId) => {
        event.preventDefault();

        // axios call to s3 and then db

        axios.delete(`/api/user_data/${this.props.user.user_id}?data_id=${dataId}`)
        .then(response => {
            this.setState({
                dataInfoToDisplay: response.data
            })
        })
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
        let { dataInfoToDisplay, showFormAdd, showFormUpdate, selectedDataInfoMapIndex } = this.state;

        // FORM

        let addOrUpdateForm = 
             (
                <div >
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
                        <div id="category-choice">
                            <div>
                                <label htmlFor="isMarBio">Marine Bioacoustics</label>
                                <input type="radio" name="category" id="isMarBio" checked={this.state.isMarBio}
                                onChange={event => this.subtopicHandler(event)}/>
                            </div>

                            <div>
                                <label htmlFor="isVaV">Vessels {"&"} Vehicles</label>
                                <input type="radio" name="category" id="isVaV" checked={this.state.isVaV}
                                onChange={event => this.subtopicHandler(event)}/>
                            </div>

                            <div>
                                <label htmlFor="isStrctr">Structures</label>
                                <input type="radio" name="category" id="isStrctr" checked={this.state.isStrctr}
                                onChange={event => this.subtopicHandler(event)}/>
                            </div>

                            <div>
                                <label htmlFor="isEnviron">Environmental</label>
                                <input type="radio" name="category" id="isEnviron" checked={this.state.isEnviron}
                                onChange={event => this.subtopicHandler(event)}/>
                            </div>

                            <div>
                                <label htmlFor="isUnknown">Unknown</label>
                                <input type="radio" name="category" id="isUnknown" checked={this.state.isUnknown}
                                onChange={event => this.subtopicHandler(event)}/>
                            </div>
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
                                <p>Select your file to upload</p>
                                <input type="file" onChange={this.handleFileUpload} />
                                <button id="submitadd" type="submit" onClick={(event) => this.postDataInfoAndFile(event)}>Submit</button>
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

        // DATA INFO

        let mappedUserData = dataInfoToDisplay.map((dataObj, index) => {
            return (
                <div key={index} className="data-container">
                    <ul>
                        <li>
                            <div>Title</div>
                            <div>{dataObj.title}</div>
                        </li>
                        <li>
                            <div>File Type</div>
                            <div className="the-meat">{dataObj.file_type}</div>
                        </li>
                        <li>
                            <div>Category</div>
                            <div className="the-meat">{dataObj.subtopic}</div>
                        </li>
                        <li>
                            <div>Uploaded On</div>
                            <div className="the-meat">{dataObj.upload_date.slice(0,10)}</div>
                        </li>
                        <li>
                            <div>Description</div>
                            <div className="the-meat">{dataObj.data_summary}</div>
                        </li>
                        {/* <li><button onClick={this.downloadS3}>DOWNLOAD</button></li> */}
                    </ul>
                    <div>{
                            (this.props.user !== null 
                            && this.props.user.user_id === +this.props.match.params.user_id
                            ) 
                            ?
                                (selectedDataInfoMapIndex === index && showFormUpdate && !showFormAdd) 
                                ?
                                addOrUpdateForm
                                :
                                <div>
                                    <button type="submit" onClick={(event) => this.toggleFormRenderUpdate(event, dataObj.data_id, index)}>EDIT</button>
                                    <button type="submit" onClick={(event) => this.deleteDataInfo(event, dataObj.data_id)}>DELETE</button>
                                </div>
                            :
                            null}
                    </div>
                </div>
            )
        })        

        // PUTTING IT ALL TOGETHER

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

const mapDispatchToProps = {
    getUserSession
}

export default withRouter(connect(mapReduxStateToProps, mapDispatchToProps)(UserData));