import { AccountCircle } from '@mui/icons-material';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React from 'react';


const Home = () => {

    return (      
      <Box sx={{ background: '#00c8c8', color: 'white', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Typography variant="h1">
          Welcome to at-oku
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', maxWidth: '500px' }}>
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField id="username" label="username" variant="standard" fullWidth />
        </Box>
        <Box sx={{marginTop: '15px'}}>
          <Button variant="contained">
            Login
          </Button>
        </Box>
      </Box>
    )
}

export default Home;