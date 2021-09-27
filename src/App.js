import './App.css'
import React from 'react';
import { useStore } from './store/Store'

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home, VideoChat } from './containers';

const SafeRoute = (props) => {
  const [store] = useStore();
  if (!store.username) return <Route {...props} component={Home} />
  return <Route {...props} />
}


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <SafeRoute path="/video" component={VideoChat} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
