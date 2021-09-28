import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home, VideoChat } from './containers';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { createTheme, ThemeProvider } from '@mui/material';

const SafeRoute = (props: any) => {
  const username = useSelector(
    (state: RootState) => state.application.username,
  );
  if (!username) return <Route {...props} component={Home} />;
  return <Route {...props} />;
};

function App() {
  const customTheme = createTheme({
    palette: {
      primary: {
        light: '#afa',
        main: '#99d5cf',
        dark: '#afa',
        contrastText: '#fff',
      },
      secondary: {
        light: '#afa',
        main: '#f11',
        dark: '#faf',
        contrastText: '#faf',
      },
    },
    components: {
      // Name of the component
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            fontSize: '1rem',
            backgroundColor: '#357f78',
            ':hover': {
              backgroundColor: '#1a746b',
            },
            color: 'white',
            outlineColor: 'white',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <SafeRoute path="/video" component={VideoChat} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
