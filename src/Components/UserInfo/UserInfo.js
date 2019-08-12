import React, { Component } from 'react';
import axios from 'axios';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import './_UserInfo.scss'

class UserInfo extends Component {
    constructor(props) {
        super(props) 

        this.state = {
            userInfoToDisplay: [],
            newProfilePicture: null,
            profileImgClickedOn: false,
            biography: ""
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
        console.log('hit handle prof pic')
            this.setState({
                newProfilePicture: event.target.files
            });
        }

    submitFile = (event) => {
        console.log('hit submit')
        event.preventDefault();

        if(!this.state.newProfilePicture) {
            alert('Cannot proceed without an image selected')
        } else {

        const formData = new FormData();
        formData.append('file', this.state.newProfilePicture[0]);
        
        this.setState({
              profileImgClickedOn: false
          })

        axios.post(`/api/profile_pic`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(responseS3 => {
            console.log('amazon S3 response prof pic: ', responseS3.data.Location)
            axios.put(`/api/user/profile_picture/${this.props.user.user_id}`, {profile_picture: responseS3.data.Location})
            .then(responseDB => {
                console.log('db response prof pic: ', responseDB)
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

    updateBio = () => {
        let { biography } = this.state;
        axios.put(`/api/user/bio/${this.props.match.params.user_id}`, biography)
        .then(response => {
            this.setState({
                userInfoToDisplay: response.data
            })
        })
    }

    render() {
        let { userInfoToDisplay, newProfilePicture, profileImgClickedOn } = this.state;
        console.log('new prof pic state: ', newProfilePicture)
        console.log('is clicked on prof pic: ', profileImgClickedOn)

        return (
            <div>
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
                                    <button type="submit" onClick={this.submitFile}>Confirm Update</button>
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

                <div>
                    <h2>User Bio</h2>
                    <span>{userInfoToDisplay.biography}</span>
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