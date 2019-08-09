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
            new_profile_picture: null,
            biography: ""
        };

        this.selectProfilePicture = this.selectProfilePicture.bind(this);
        this.confirmProfilePicture = this.confirmProfilePicture.bind(this);
        }

    componentDidMount() {
        axios.get(`/api/user/${this.props.match.params.user_id}`)
        .then(response => {
            this.setState({
                userInfoToDisplay: response.data
            });
        });
    }

    selectProfilePicture(event) {
        let file = event.target.files[0];

        this.setState({
            new_profile_picture: file
        });
    }

    confirmProfilePicture() {
        let { new_profile_picture } = this.state;

        if (!new_profile_picture) {
            let { user_id } = this.props.user;
        
        
            axios.put(`/api/user/profile_picture/${user_id}`, {profile_picture: new_profile_picture})
            .then(response => {
                this.setState({
                    userInfoToDisplay: response.data
                })
            });
        }
        
        // upload new profile pic in Amazon S3 in same spot as old profile pic
        // axios.put('user_id.AMAZONS3/profile_picture', 
        //     {
        //         user_id: user_id, 
        //         profile_picture: new_profile_picture
        //     })
        // // return the Amazon S3 reference URL string as the response
        // .then(response => {
        //     // update profile pic reference in postgres database with response
        //     axios.put(`/api/user/${user_id}`, {profile_picture: response.data})
        // })
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
        let { userInfoToDisplay } = this.state;
        return (
            <div>
                <ul>
                    <li>{userInfoToDisplay.username}</li>
                    <li><img src={userInfoToDisplay.profile_picture} alt="Profile"/></li>
                    <li>{
                            (this.props.user !== null 
                            && this.props.user.user_id === +this.props.match.params.user_id
                            ) 
                            ? 
                            <div>
                                <label htmlFor="Swap Profile Picture">Swap Profile Picture</label>
                                <input type="file" name="Swap Profile Picture" accept="image/*"
                                    onChange={this.selectProfilePicture} 
                                    />
                                <button onClick={this.confirmProfilePicture}>Confirm</button>
                            </div>
                            :
                            null}</li>
                    <li>Bio: {userInfoToDisplay.biography}</li>
                </ul>
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