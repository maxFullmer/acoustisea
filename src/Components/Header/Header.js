import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import axios from 'axios';
import logo from '../../iconsAndImages/trident.png';

class Header extends Component {
    componentDidMount() {
        axios.get('/api/user_session')
        .then(response => {
            console.log('user session status: ', response)
            this.props.getUserSession(response.data)
            }
        )
    }

    userHome = () => {
        console.log('this.props.user.user_id',this.props.user.user_id)
        this.props.history.push(`/user/${this.props.user.user_id}`)
    }
    
    siteHome = () => {
        this.props.history.push("/");
    }

    logout = () => {
        axios.get('/api/logout')
        .then(response => {
            this.props.getUserSession(null);
            this.props.history.push("/")
        })
    }

    render() {
        return (
            (!this.props.user) 
            ?
                <header>
                    <img onClick={this.siteHome} src={logo} alt="trident.png" height="32px" width="32px"/>
                </header>
            : 
                <header>
                    <button onClick={this.userHome}>User Home</button>
                    <img src={logo} alt="trident.png" height="32px" width="32px"/>
                    <button onClick={this.logout}>Logout</button>
                </header>
        ) 
    }
}

function mapReduxStateToProps(reduxState){
    return {
        user: reduxState.user
    }
}

const mapDispatchToProps = {
    getUserSession
}

export default withRouter(connect(mapReduxStateToProps, mapDispatchToProps)(Header));