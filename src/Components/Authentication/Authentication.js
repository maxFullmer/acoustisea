import React, { Component } from 'react';
import { connect } from 'react-redux';
import { attemptLogin, getUserSession } from '../../redux/reducers/userReducer.js';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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

    componentDidMount() {
        axios.get('/api/user_session')
        .then(response => {
            console.log('user session status: ', response)
            this.props.getUserSession(response.data)
            if(this.props.user) {
                this.props.history.push(`/user/${this.props.user.user_id}`)
            }
        })
    }

    login = (event) => {
        event.preventDefault();
        const { passLogin, emailLogin } = this.state;

        axios.post('/api/login', {password: passLogin, email: emailLogin})
        .then(response => {
            console.log('login attempt data: ', response.data)
            this.props.attemptLogin(response.data)
            this.props.history.push(`/user/${response.data.user_id}`)
        })
        .catch(error => {
            toast.error(error.response.data, {
                style: {background: "#aaa9b3", color: "#f1eaee"}
            })
        })
    }

    register = (event) => {
        event.preventDefault();
        const { userRegister, passRegister, emailRegister } = this.state;

        axios.post('/api/register', {username: userRegister, password: passRegister, email: emailRegister})
        .then(response => {
            this.props.getUserSession(response.data)
            this.props.history.push(`/user/${response.data.user_id}`)
        })
        .catch(error => {
            toast.error(error.response.data)
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
                
                <button type="submite" onClick={this.login}>Login</button>
                
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
                
                <button type="submit" onClick={this.register}>Register</button>
                
                <ToastContainer autoClose={2750}/>
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