import { useLocalization } from '@fluent/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'src/components/Button';
import { setUsername } from 'src/store/reducer';
import TextInput from '../components/TextInput';
import Title from '../components/Title';

const Login = () => {
  const { l10n } = useLocalization();
  const dispatch = useDispatch();
  const [username, updateUsername] = useState('');

  const login = () => {
    dispatch(setUsername(username));
  };

  return (
    <div>
      <Title text="welcome" />
      <form onSubmit={login} style={{ width: '100%' }}>
        <TextInput
          placeholder="username"
          value={username}
          onChange={(e) => updateUsername(e.target.value)}
        />
        <Button onClick={login} text={l10n.getString('login')} />
      </form>
    </div>
  );
};

export default Login;
