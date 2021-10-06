import { useLocalization } from '@fluent/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/components/Button';
import { setUsername } from 'src/store/reducer';

const Login = () => {
  const { l10n } = useLocalization();
  const dispatch = useDispatch();
  const [username, updateUsername] = useState('');

  const login = () => {
    dispatch(setUsername(username));
  };

  return (
    <>
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
        <Button onClick={login} text={l10n.getString('login')} />
      </div>
    </>
  );
};

export default Login;
