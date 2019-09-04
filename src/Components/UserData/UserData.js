import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import { toast } from 'react-toastify';

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

    // DATABASE REQUESTS + HELPER FUNCTIONS
    handleFileUpload = (event) => {
        this.setState({file: event.target.files});
    }

    postDataInfoAndFile = (event) => {
        event.preventDefault();
        let { username, user_id } = this.props.user;
        let { dataTitle, file_type, isMarBio, isVaV, isStrctr, isEnviro, isUnknown, dataSummary } = this.state;

        if (!this.state.file || !(dataTitle && file_type && dataSummary)) {
            alert('Cannot proceed without a file selected or incomplete form')
        } 
        else {
            let subtopic = 
                isMarBio ? 'marBio' : 
                isVaV ? 'VaV' :
                isStrctr ? 'strctr' :
                isEnviro ? 'enviro' :
                isUnknown ? 'unknown' :
                null;

            let formData = new FormData();
            formData.append('file', this.state.file[0]);
            
            // axios call to s3
            axios.post(`/api/data_file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Content-Disposition': `attachment; filename=${dataTitle}.${file_type}`
                }
            })
            .then(response => {
                // nested axios call to insert the link from s3 and user input into db
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
                    this.setState({
                        dataInfoToDisplay: [ ...this.state.dataInfoToDisplay, response.data],
                        showFormAdd: false,
                        dataTitle: "",
                        file_type: "",
                        isMarBio: true,
                        isVaV: false,
                        isStrctr: false,
                        isEnviro: false,
                        isUnknown: false,
                        dataSummary: ""
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

        // axios call to db
        if (dataTitle && file_type && dataSummary) {
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
                let newDataArray = dataInfoToDisplay.slice();
                newDataArray[selectedDataInfoMapIndex] = response.data;

                this.setState({
                    dataInfoToDisplay: newDataArray,
                    showFormUpdate: false,
                    dataTitle: "",
                    file_type: "",
                    isMarBio: true,
                    isVaV: false,
                    isStrctr: false,
                    isEnviro: false,
                    isUnknown: false,
                    dataSummary: ""
                })
            }).catch(error => {console.log(error)} );
        } else {
            alert("Please fill in all fields of the form")
        }
    }

    deleteDataInfo = (event, dataId, s3key) => {
        event.preventDefault();

        // axios call to s3
        axios.delete(`/api/removefile?s3key=${s3key}`)
        .then(response => {
            return
        })
        // axios call to db
        axios.delete(`/api/user_data/${this.props.user.user_id}?data_id=${dataId}`)
        .then(response => {
            this.setState({
                dataInfoToDisplay: response.data
            })
        })
    }

    downloadable = (event) => {
        if(!this.props.user) {
            event.preventDefault();
            toast.error("You must have an account to download")
            this.props.history.push("/")
        }
    }

    render() {
        let { dataInfoToDisplay, showFormAdd, showFormUpdate, selectedDataInfoMapIndex } = this.state;

        // FORM
        let addOrUpdateForm = 
             (
                <div >
                    <form>
                        <p>Title {"*"}</p>
                        <div>
                        <textarea name="dataTitle" rows="1" cols="45" value={this.state.dataTitle}
                            onChange={event => this.textAreaHandler(event)} />    
                        </div>

                        <p>Filename extension (.pdf, .docx, .zip, etc...) {"*"}</p>
                        <div>
                        <textarea name="file_type" rows="1" cols="7" value={this.state.file_type}
                            onChange={event => this.textAreaHandler(event)} />    
                        </div>
                        
                        <p>Category {"*"}</p>
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
                            <div className="button-fit-form-add">
                                <p>Select your file to upload</p>
                                <input type="file" onChange={this.handleFileUpload} />
                                <div>
                                    <button id="submitadd" type="submit" onClick={(event) => this.postDataInfoAndFile(event)}>Submit</button>
                                    <button id="canceladd" type="button" onClick={(event) => this.toggleFormRenderAdd(event)}>Cancel</button>
                                </div>
                            </div>
                            :
                            <div className="button-fit">
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
                        <li>
                            <div className="col-name">File</div>
                            <div className="the-meat"><a href={`${dataObj.s3link}`} download={`${dataObj.title}.${dataObj.file_type}`} onClick={this.downloadable}>Download</a></div>
                        </li>
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
                                <div className="button-fit">
                                    <button type="submit" onClick={(event) => this.toggleFormRenderUpdate(event, dataObj.data_id, index)}>Edit</button>
                                    <button type="submit" onClick={(event) => this.deleteDataInfo(event, dataObj.data_id, dataObj.s3key)}>Delete</button>
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
                        <button type="button" onClick={(event) => this.toggleFormRenderAdd(event)} >+ Add +</button>}
                    </div>
                    :
                    null}
                </div>
                <div>{mappedUserData}</div>
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