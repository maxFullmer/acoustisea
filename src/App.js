import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Header from './Components/Header/Header.js';
import Authentication from './Components/Authentication/Authentication.js';
import UserProfile from './Components/UserProfile/UserProfile.js';
import SubtopicDisplayCenter from './Components/SubtopicDisplayCenter/SuptopicDisplayCenter.js';
import './App.scss';

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Authentication}/>
        <Route path="/user/:user_id" 
        // every time the user_id parameter in the URL path changes, the route will rerender UserProfile component
                render={(props) => (
          <UserProfile key={props.match.params.user_id} {...props}/>
          ) 
          } />
        {/* path below will have query attached to it when page is linked to from user page */}
        <Route path="/publicdata" component={SubtopicDisplayCenter}/>
        <Route path="*" render={() => {return <div>404: Page not found. You may have made a syntactical error. Please check spelling of URL.</div>}}/>
      </Switch>

    </div>
  );
}

export default App;
