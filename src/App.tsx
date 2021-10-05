import { Login, VideoChat } from './containers';
import { useSelector } from 'react-redux';
import { usernameSelector } from './store/selectors';

function App() {
  const username = useSelector(usernameSelector);
  if (!username) {
    return <Login />;
  }

  return <VideoChat />;
}

export default App;
