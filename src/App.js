import './App.css'
import React from 'react';
import { useStore } from './store/Store'

import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { Home, VideoChat } from './containers';

const SafeRoute = (props) => {
  const [store] = useStore();
  if (!store.username) return <Route {...props} component={Home} />
  return <Route {...props} />
}


function App() {
  const [store] = useStore();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} />
        <SafeRoute path="/video" component={VideoChat} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
