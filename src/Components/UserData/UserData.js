import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserSession } from '../../redux/reducers/userReducer.js';
import axios from 'axios';

class UserData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTitle: "",
            file_type: "",
            isMarBio: false,
            isVaV: false,
            isConstrc: false,
            isEnviron: false
        }
    }

    universalSubtopicHandler = (property) => {
        this.setState({
            isMarBio: false,
            isVaV: false,
            isConstrc: false,
            isEnviron: false,
            [property]: true
        })
    }

    postDataDescription = () => {
        const { username, user_id } = this.props.user;
        const { dataTitle, file_type, isMarBio, isVaV, isConstrc, isEnviron } = this.state;
        const subtopicArray = [isMarBio, isVaV, isConstrc, isEnviron];

        axios.post(`/api/user_data/:user_id`, { username: username, user_id: user_id, title: dataTitle, file_type: file_type, subtopicArray: subtopicArray})
    }

    render() {
        return (
            <div>
                <form>
                    <p>Please select the category for your data method:</p>
                    <div>
                        <input type="radio" id="categoryChoice1"
                        name="category" value="isMarBio" 
                        onClick={event => this.universalSubtopicHandler(event.target.value)}/>
                        <label htmlFor="categoryChoice1">Marine Bioacoustics</label>
                    
                        <input type="radio" id="categoryChoice2"
                        name="category" value="isVaV" 
                        onClick={event => this.universalSubtopicHandler(event.target.value)}/>
                        <label htmlFor="categoryChoice2">Vessels {"&"} Vehicles</label>
                    
                        <input type="radio" id="categoryChoice3"
                        name="category" value="isConstrc" 
                        onClick={event => this.universalSubtopicHandler(event.target.value)}/>
                        <label htmlFor="categoryChoice3">Construction</label>
                        
                        <input type="radio" id="categoryChoice3"
                        name="category" value="isEnviron" 
                        onClick={event => this.universalSubtopicHandler(event.target.value)}/>
                        <label htmlFor="categoryChoice3">Environmental</label>
                    </div>

                    <div>
                    <button type="submit">Submit</button>
                    </div>
                </form>
            </div> 
        );
    }
}

function mapReduxStateToProps(reduxState){
    return reduxState
}

//since dispatch is a prop of the store, we imported the action creators from a reducer
const mapDispatchToProps = {
    getUserSession
}

export default withRouter(connect(mapReduxStateToProps, mapDispatchToProps)(UserData));