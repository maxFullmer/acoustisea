import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import './Header.scss'
import axios from 'axios'

class Header extends Component {
    componentDidMount() {
        axios.get('/api/user_session')
        .then(response => {
            console.log(response)
            this.props.getUserSession(response.data)
        })
    }

    render() {
        // 
        // header will contain logout and user home button if user IS logged in.
        // onClick, logout button will take site-user back to login page "/"
        // if on login page (AKA USER IS NOT LOGGED IN), header will hide buttons.
        console.log(this.props.user)
        return (
            (!this.props.user) 
            ?
                <header>
                    <img src="/public/trident.png" alt="trident.png" />
                </header>
            : 
                <header>
                    <Link to="/user/:user_id"><button>User Home</button> </Link> 
                    <img src="/public/trident.png" alt="trident.png" />
                    <Link to="/" ><button>Logout</button></Link>    
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

export default connect(mapReduxStateToProps, mapDispatchToProps)(Header);