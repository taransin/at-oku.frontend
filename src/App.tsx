import './App.css'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home, VideoChat } from './containers';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

const SafeRoute = (props: any) => {
  const username = useSelector((state: RootState) => state.application.username);
  if (!username) return <Route {...props} component={Home} />
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
