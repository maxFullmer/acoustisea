import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import fileDownload from 'js-file-download';

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
                    'Content-Type': 'multipart/form-data',
                    'Content-Disposition': `attachment; filename=${dataTitle}.${file_type}`
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
                    dataSummary: dataSummary,
                    s3link: response.data.Location,
                    s3key: response.data.Key
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

            this.setState( 
                {
                    dataInfoToDisplay: newDataArray,
                    showFormUpdate: false
                } )
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

    // DOWNLOAD FILE
    downloadS3 = (event, dataLink, dataKey, fileName) => {
        event.preventDefault();
        if(!this.props.user) {
            //get toastify up in here
            alert('Please log in/register to download')
            // show login button to redirect to login/register
        } else {
            console.log(dataKey)
            axios.get(`/api/data_file?s3key=${dataKey}`)
            .then(response => {
                // figure out how to get the file to the requester... => something: response
            console.log(response)
            console.log(fileName)
            fileDownload(response.data, fileName)
            // fileDownload(dataLink, fileName)
            // const url = window.URL.createObjectURL(new Blob([dataLink]));
            const url = dataLink;
            let tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.setAttribute('download', `${fileName}`)
            tempLink.setAttribute('target', '_blank')
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);    
            })
        }
    }

    

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

                        <p>Filename extension (.pdf, .docx, or any image format) {"*"}:</p>
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
                                <label htmlFor="isEnviro">Environmental</label>
                                <input type="radio" name="category" id="isEnviro" checked={this.state.isEnviro}
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
                            <div className="col-name ">Title</div>
                            <div className="the-meat title">{dataObj.title}</div>
                        </li>
                        <li>
                            <div className="col-name">File Type</div>
                            <div className="the-meat">{dataObj.file_type}</div>
                        </li>
                        <li>
                            <div className="col-name">Category</div>
                            <div className="the-meat">{dataObj.subtopic}</div>
                        </li>
                        <li>
                            <div className="col-name">Uploaded On</div>
                            <div className="the-meat">{dataObj.upload_date.slice(0,10)}</div>
                        </li>
                        <li>
                            <div className="col-name">Description</div>
                            <div className="the-meat">{dataObj.data_summary}</div>
                        </li>
                        <li><button onClick={(event) =>this.downloadS3(event, dataObj.s3link, dataObj.s3key, dataObj.title)}>DOWNLOAD</button></li>
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