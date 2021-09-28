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
        background: '#00c8c8',
        color: 'white',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <form onSubmit={login}>
        <Typography variant="h1">{l10n.getString('welcome')}</Typography>
        <Box
          sx={{ display: 'flex', alignItems: 'flex-end', maxWidth: '500px' }}
        >
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            value={username}
            onChange={(e) => updateUsername(e.target.value)}
            label={l10n.getString('username')}
            variant="standard"
            fullWidth
          />
        </Box>
        <Box sx={{ marginTop: '15px' }}>
          <Button variant="contained" onClick={login}>
            {l10n.getString('login')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Home;
