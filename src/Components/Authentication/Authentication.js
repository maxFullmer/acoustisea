import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
import { attemptLogin, getUserSession } from '../../redux/reducers/userReducer.js';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Authentication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emailLogin: "",
            passLogin: "",
            userRegister: "",
            passRegister: "",
            emailRegister: ""            
        }
    }

    login = () => {
        const { passLogin, emailLogin } = this.state;

        axios.post('/api/login', {password: passLogin, email: emailLogin})
        .then(response => {
            this.props.attemptLogin(response.data)
            this.props.history.push(`/user/${response.data.user_id}`)
        })
    }

    register = () => {
        const { userRegister, passRegister, emailRegister } = this.state;

        axios.post('/api/register', {username: userRegister, password: passRegister, email: emailRegister})
        .then(response => {
            this.props.getUserSession(response.data)
            this.props.history.push(`/user/${response.data.user_id}`)
        })
    }

    textInputHandler = (property, value) => {
        this.setState({
            [property]: value
        })
    }
    
    render() {
    const { emailLogin, passLogin, userRegister, passRegister, emailRegister } = this.state;
    return (
        <div className="auth-wrapper">
            <div id="login-container">
                <label htmlFor="emailLogin">Email: </label>
                <input type="text" placeholder="email" name="emailLogin" value={emailLogin}
                    onChange={event => this.textInputHandler(event.target.name, event.target.value)}/>
                
                <label htmlFor="passLogin">Password: </label>
                <input type="password" placeholder="password" name="passLogin" value={passLogin}
                    onChange={event => this.textInputHandler(event.target.name, event.target.value)}/>
                
                <button onClick={this.login}>Login</button>
                {/* <ToastContainer /> */}
            </div>

            <div id="register-container">
                <label htmlFor="userRegister">Username: </label>
                <input type="text" placeholder="username" name="userRegister" value={userRegister}
                    onChange={event => this.textInputHandler(event.target.name, event.target.value)}/>
                
                <label htmlFor="passRegister">Password: </label>
                <input type="password" placeholder="password" name="passRegister" value={passRegister}
                    onChange={event => this.textInputHandler(event.target.name, event.target.value)}/>
                
                <label htmlFor="emailRegister">Email: </label>
                <input type="text" placeholder="email" name="emailRegister" value={emailRegister}
                    onChange={event => this.textInputHandler(event.target.name, event.target.value)}/>
                
                <button onClick={this.register}>Register</button>
            </div>
        </div>
    )
    }
}

function mapReduxStateToProps(reduxState) {
    return {
        user: reduxState.user
    }
}

const mapDispatchToProps = {
    attemptLogin,
    getUserSession
}

export default withRouter(connect(mapReduxStateToProps, mapDispatchToProps)(Authentication));