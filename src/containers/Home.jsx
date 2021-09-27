import { AccountCircle } from '@mui/icons-material';
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { setField } from '../store/reducer';
import { useStore } from '../store/Store';



const Home = () => {
    const history = useHistory();
    const [, dispatch] = useStore();
    const [username, setUsername] = useState('');

    const onClick = () => {
      dispatch(setField({ username }));
      history.push('/video')
    } 

    return (      
      <Box sx={{ background: '#00c8c8', color: 'white', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Typography variant="h1">
          Welcome to at-oku
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', maxWidth: '500px' }}>
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField value={username} onChange={(e) => setUsername(e.target.value)}label="username" variant="standard" fullWidth />
        </Box>
        <Box sx={{marginTop: '15px'}}>
          <Button variant="contained" onClick={onClick} >
            Login
          </Button>
        </Box>
      </Box>
    )
}

export default Home;