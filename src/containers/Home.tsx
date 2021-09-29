import { useLocalization } from '@fluent/react';
import { AccountCircle } from '@mui/icons-material';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setUsername } from 'src/store/reducer';

const Home = () => {
  const { l10n } = useLocalization();
  const history = useHistory();
  const dispatch = useDispatch();
  const [username, updateUsername] = useState('');

  const login = () => {
    dispatch(setUsername(username));
    history.push('/video');
  };

  return (
    <Box
      sx={{
        background: '#4db6ac',
        color: 'white',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      <Typography variant="h1">{l10n.getString('welcome')}</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '531px',
          width: '100%',
          margin: '30px 0 0 -31px',
        }}
      >
        <AccountCircle sx={{ color: 'white', mr: 1, my: 0.5 }} />
        <form onSubmit={login} style={{ width: '100%' }}>
          <TextField
            sx={{ color: 'white' }}
            value={username}
            onChange={(e) => updateUsername(e.target.value)}
            label={l10n.getString('username')}
            variant="filled"
            fullWidth
          />
        </form>
      </Box>
      <Box
        sx={{
          marginTop: '15px',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <Button variant="contained" onClick={login} fullWidth>
          {l10n.getString('login')}
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
