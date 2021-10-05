import { useLocalization } from '@fluent/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setUsername } from 'src/store/reducer';

const Login = () => {
  const { l10n } = useLocalization();
  const history = useHistory();
  const dispatch = useDispatch();
  const [username, updateUsername] = useState('');

  const login = () => {
    dispatch(setUsername(username));
    history.push('/video');
  };

  return (
    <div>
      <h1>{l10n.getString('welcome')}</h1>
      <div>
        <form onSubmit={login} style={{ width: '100%' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => updateUsername(e.target.value)}
            placeholder={l10n.getString('username')}
          />
        </form>
      </div>
      <div>
        <button onClick={login}>{l10n.getString('login')}</button>
      </div>
    </div>
  );
};

export default Login;
