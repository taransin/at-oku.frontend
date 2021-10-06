import { Login, Atoku } from './containers';
import { useSelector } from 'react-redux';
import { themeSelector, usernameSelector } from './store/selectors';
import styled, { ThemeProvider } from 'styled-components';
import { useEffect, useState } from 'react';

const StyledBackground = styled.div(
  {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ({ theme }) => ({
    background: theme.colors.background.dark,
    color: theme.colors.text,
  }),
);

function App() {
  const theme = useSelector(themeSelector);
  const username = useSelector(usernameSelector);

  const [currentTheme, setCurrentTheme] = useState(theme);
  useEffect(() => {
    console.log(theme);
    setCurrentTheme(theme);
  }, [theme, setCurrentTheme]);
  return (
    <ThemeProvider theme={currentTheme}>
      <StyledBackground>{!username ? <Login /> : <Atoku />}</StyledBackground>
    </ThemeProvider>
  );
}

export default App;
