import { Login, Atoku } from './containers';
import { useSelector } from 'react-redux';
import { usernameSelector } from './store/selectors';
import styled from 'styled-components';

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
  const username = useSelector(usernameSelector);

  return (
    <StyledBackground>{!username ? <Login /> : <Atoku />}</StyledBackground>
  );
}

export default App;
