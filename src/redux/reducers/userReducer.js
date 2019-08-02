const GET_USER_SESSION = 'GET_USER_SESSION';
const ATTEMPT_LOGIN = 'ATTEMPT_LOGIN';

const initialState = {
    user: null
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER_SESSION:
            console.log(action.payload)
            console.log(state.user)
            return {user: action.payload};
        case ATTEMPT_LOGIN:
            return {user: action.payload}
        default:
            return state;
    }
}

// action creators:

export function getUserSession(LoggedInUser){
    return {
        payload: LoggedInUser,
        type: GET_USER_SESSION
    }
}

export function attemptLogin(status) {
    return {
        payload: status,
        type: ATTEMPT_LOGIN
    }
}