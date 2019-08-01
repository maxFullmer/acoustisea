import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Header from './Components/Header/Header.js';
import Authentication from './Components/Authentication/Authentication.js';
import UserProfile from './Components/UserProfile/UserProfile.js';
import PublicData from './Components/PublicData/PublicData.js';

import './App.scss';

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Authentication}/>
        <Route path="/user/:user_id" component={UserProfile} />
          <Route path="/marinebioacoustics" component={PublicData}/>
          <Route path="/vesselsandvehicles" component={PublicData}/>
          <Route path="/construction" component={PublicData}/>
          <Route path="/environmental" component={PublicData}/>
        <Route path="*" render={() => {return <div>404: Page not found. You may have made a syntactical error. Please check spelling of URL.</div>}}/>
      </Switch>

    </div>
  );
}

export default App;
