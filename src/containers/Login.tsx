import { useLocalization } from '@fluent/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUsername } from 'src/store/reducer';
import { useTheme } from '@emotion/react/macro';
import { css } from '@emotion/react/macro';

const Background = (theme) =>
  css({
    width: '100vw',
    height: '100vh',
    backgroundColor: theme.colors.background,
  });

const Login = () => {
  const { l10n } = useLocalization();
  const dispatch = useDispatch();
  const [username, updateUsername] = useState('');
  const theme = useTheme();

  const login = () => {
    dispatch(setUsername(username));
  };

  return (
    <div css={Background(theme)}>
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
