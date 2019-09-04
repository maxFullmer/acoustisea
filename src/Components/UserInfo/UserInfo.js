import React, { Component } from 'react';
import axios from 'axios';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class UserInfo extends Component {
    constructor(props) {
        super(props) 

        this.state = {
            userInfoToDisplay: [],
            newProfilePicture: null,
            profileImgClickedOn: false,
            newBio: "",
            editBio: false
        };
    }

    componentDidMount() {
        axios.get(`/api/user/${this.props.match.params.user_id}`)
        .then(response => {
            this.setState({
                userInfoToDisplay: response.data
            });
        });
    }

    //Amazon S3 changing profile Pic

    handleImgClick = (event) => {
        event.preventDefault();
        this.setState({
            profileImgClickedOn: true
        })
    }

    handleProfilePicture = (event) => {
            this.setState({
                newProfilePicture: event.target.files
            });
        }

    submitProfilePicture = (event) => {
        event.preventDefault();

        if(!this.state.newProfilePicture) {
            alert('Cannot proceed without an image selected')
        } else {

        let formData = new FormData();
        formData.append('file', this.state.newProfilePicture[0]);
        
        this.setState({
              profileImgClickedOn: false
          })

        axios.post(`/api/profile_pic`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(responseS3 => {
            axios.put(`/api/user/profile_picture/${this.props.user.user_id}`, {profile_picture: responseS3.data.Location})
            .then(responseDB => {
                this.setState({
                    userInfoToDisplay: responseDB.data,
                    newProfilePicture: null
                })
            }).catch(error => { alert('db error: ', error) })
            
        }).catch(error => { alert('submit to s3 error: ', error) });
      }
    }

    cancelProfilePicture = (event) => {
        event.preventDefault();
        this.setState({
            newProfilePicture: null,
            profileImgClickedOn: false
        })
    }


    // Update Bio on db
    editBiography = (event) => {
        event.preventDefault();
        this.setState( {editBio: true} )
    }

    handleBioChange = (value) => {
        // event.persist();
        this.setState( {newBio: value} )
    }

    updateBio = (event) => {
        event.preventDefault();
        let { newBio } = this.state;

        axios.put(`/api/user/bio/${this.props.match.params.user_id}`, {biography: newBio})
        .then(response => {
            let [newUserInfoArrray] = response.data;
            this.setState({
                userInfoToDisplay: newUserInfoArrray,
                newBio: "",
                editBio: false
            })
        })
    }

    cancelBioChange = (event) => {
        event.preventDefault();
        this.setState({
            newBio: "",
            editBio: false
        })
    }

    render() {
        let { userInfoToDisplay, profileImgClickedOn, editBio } = this.state;

        return (
            <div id="userinfo-container">
                <div>
                    {
                    (this.props.user !== null 
                    && this.props.user.user_id === +this.props.match.params.user_id
                    ) 
                    ? 
                    <ul className="profile">
                        <li>
                            <img id="camera"
                            src={userInfoToDisplay.profile_picture} alt="Profile"
                            onClick={this.handleImgClick}/>
                            {
                                (profileImgClickedOn)
                                ?
                                <div id="swap-picture">
                                    <input type="file" accept="image/*" onChange={this.handleProfilePicture} />
                                    <button type="submit" onClick={this.submitProfilePicture}>Confirm Update</button>
                                    <button type="button" onClick={this.cancelProfilePicture}>Cancel</button>
                                </div>
                                :
                                null
                            }
                        </li>
                        <li><span>{userInfoToDisplay.username}</span></li>
                    </ul>
                    :
                    <ul className="profile">
                        <li><img src={userInfoToDisplay.profile_picture} alt="Profile"/></li>
                        <li><span>{userInfoToDisplay.username}</span></li>
                    </ul>}
                </div>

                <div id="bio">
                    {/* <h2>User Bio: </h2> */}
                    <div>{
                        (this.props.user !== null 
                        && this.props.user.user_id === +this.props.match.params.user_id
                        ) 
                        ?
                            (editBio)
                            ?
                            <div className="bio-div">
                                <h2>User Bio</h2>

                                <textarea name="newBio" rows="2" cols="35" value={this.state.newBio}
                                    onChange={event => this.handleBioChange(event.target.value)} 
                                />

                                <div id="edit-bio-form">
                                    <button type="submit" onClick={this.updateBio}>Confirm Update</button>
                                    <button type="button" onClick={this.cancelBioChange}>Cancel</button>
                                </div>
                            </div>
                            :
                            <div className="bio-div">
                                <h2>User Bio<button id="edit-bio-button" type="button" onClick={this.editBiography}>Edit</button></h2>
                                <span>{userInfoToDisplay.biography}</span>
                            </div>
                        :
                        <div className="bio-div">
                            <h2>User Bio</h2>
                            <span>{userInfoToDisplay.biography}</span>
                        </div>
                        }
                    </div>
                    
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

export default withRouter(connect(mapReduxStateToProps, mapDispatchToProps)(UserInfo));