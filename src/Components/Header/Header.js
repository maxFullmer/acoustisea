import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import './Header.scss'
import axios from 'axios'

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
                    <img onClick={this.siteHome} src="/public/trident.png" alt="trident.png" />
                </header>
            : 
                <header>
                    <button onClick={this.userHome}>User Home</button>
                    <img src="/public/trident.png" alt="trident.png" />
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