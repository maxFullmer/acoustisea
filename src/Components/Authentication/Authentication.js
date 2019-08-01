import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { attemptLogin } from '../../redux/reducers/userReducer.js';
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

    //Login
    login = () => {
        const { passLogin, emailLogin } = this.state;

        axios.post('/api/login', {password: passLogin, email: emailLogin})
        .then(response => {
            console.log(response)
            this.props.attemptLogin(response.data)
        })
    }

    //Register

    universalChangeHandler = (property,value) => {
        this.setState({
            [property]: value
        })
    }
    render() {
    const { emailLogin, passLogin, userRegister, passRegister, emailRegister } = this.state;
    return (
        <div>Authentication
            <div>
                <input type="text" placeholder="email" name="emailLogin" value={emailLogin}
                    onChange={event => this.universalChangeHandler(event.target.name, event.target.value)}/>
                
                <input type="password" placeholder="password" name="passLogin" value={passLogin}
                    onChange={event => this.universalChangeHandler(event.target.name, event.target.value)}/>
                
                <button onClick={this.login}>Login</button>
                <ToastContainer />
            </div>
            <div>
                <input type="text" placeholder="username" name="userRegister" value={userRegister}
                    onChange={event => this.universalChangeHandler(event.target.name, event.target.value)}/>
                
                <input type="password" placeholder="password" name="passRegister" value={passRegister}
                    onChange={event => this.universalChangeHandler(event.target.name, event.target.value)}/>
                
                <input type="text" placeholder="email" name="emailRegister" value={emailRegister}
                    onChange={event => this.universalChangeHandler(event.target.name, event.target.value)}/>
                
                <button>Register</button>
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
    attemptLogin
}

export default connect(mapReduxStateToProps, mapDispatchToProps)(Authentication);