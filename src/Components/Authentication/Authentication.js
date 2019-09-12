import React, { Component } from 'react';
import { connect } from 'react-redux';
import { attemptLogin, getUserSession } from '../../redux/reducers/userReducer.js';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import dolphinSwimRight from '../../iconsAndImages/dolphin-swim-right.png'

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
        this.init = this.init.bind(this);
    }

    componentDidMount() {
        axios.get('/api/user_session')
        .then(response => {
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

    init() {
        const img = document.getElementById('dolphin-sprite-sheet');
        let canvas = document.querySelector('canvas');
        let context = canvas.getContext('2d');

        const ySrcHeight = 55;
        const xSrcWidth = 81;
        const yScale = 2;
        const xScale = 0.5;

        const yCanvasImgHeight = ySrcHeight * yScale;
        const xCanvasImgWidth = xSrcWidth * xScale;

        let animationFrames = 5;
        let animationCycles = 5;
        let frameInterval = 150;
        setInterval(() => {
            for (let j = 0; j < animationCycles; j++) {
                setTimeout(() => {
                    for (let i = 0; i < animationFrames; i++) {
                        setTimeout(() => {
                            context.clearRect(0, 0, canvas.width, canvas.height);
                            context.drawImage(img, i * xSrcWidth, 0, xSrcWidth + 4, ySrcHeight, 20*((i) + j*(animationFrames)), 0, xCanvasImgWidth, yCanvasImgHeight);
                        }, i * frameInterval)
                    }
                }, animationFrames * frameInterval * j)
            }
        }, animationCycles * animationFrames * frameInterval)        
    }

    routeHandler = (event) => {
        this.props.history.push(`/publicdata?subtopic=${event.target.name}`)
    }
    
    render() {
    const { emailLogin, passLogin, userRegister, passRegister, emailRegister } = this.state;
    return (
        <div>
            <p id="about">A public, underwater acoustic data file repository.</p>

            <canvas id="dolphinimation">
                <img id="dolphin-sprite-sheet" src={dolphinSwimRight} alt="sonar-animation" onLoad={this.init}/>
            </canvas>

            <div className="auth-wrapper">
                <form id="login-container" onSubmit={this.login}>
                    <label htmlFor="emailLogin">Email: </label>
                    <input type="text" placeholder="email" name="emailLogin" value={emailLogin}
                        onChange={event => this.textInputHandler(event.target.name, event.target.value)}/>
                    
                    <label htmlFor="passLogin">Password: </label>
                    <input type="password" placeholder="password" name="passLogin" value={passLogin}
                        onChange={event => this.textInputHandler(event.target.name, event.target.value)}/>
                    
                    <button type="submit">Login</button>
                </form>

                <form id="register-container">
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
                </form>
            </div>

            <div id="explore-as-guest">
                <section className="subtopic-nav">
                    <div className="wrap-collapsible">
                        <input id="collapsible" className="toggle" type="checkbox"/>
                        <label htmlFor="collapsible" className="lbl-toggle">Explore as guest</label>

                        <nav className="collapsible-content">
                            <ul className="content-inner">
                                <li id="marbio">
                                    <button type="button" name="marinebioacoustics"
                                    onClick={(event) => this.routeHandler(event)}>Marine Bioacoustics</button>
                                </li>
                                <li id="vv">
                                    <button type="button" name="vesselsandvehicles"
                                    onClick={(event) => this.routeHandler(event)}>Vessels {"&"} Vehicles</button>
                                </li>
                                <li id="strctr">
                                    <button type="button" name="structures"
                                    onClick={(event) => this.routeHandler(event)}>Structures</button>
                                </li>
                                <li id="environ"> 
                                    <button type="button" name="environmental"
                                    onClick={(event) => this.routeHandler(event)}>Environmental</button>
                                </li>
                                <li id="unknown">
                                    <button type="button" name="unknown"
                                    onClick={(event) => this.routeHandler(event)}>Unknown</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </section>
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