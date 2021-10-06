import { useLocalization } from '@fluent/react';
import { MouseEvent } from 'react';
import styled from 'styled-components';

const StyledButton = styled.div(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px 30px',
    margin: 15,
    borderRadius: 3,
    '&:hover': {
      opacity: 0.8,
      cursor: 'pointer',
    },
  },
  ({ theme }) => ({
    background: theme.colors.accent,
    color: theme.colors.textOnAccent,
  }),
);

interface ButtonProps {
  text: string;
  onClick: (event?: MouseEvent<HTMLElement>) => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
  const { l10n } = useLocalization();

  return <StyledButton onClick={onClick}>{l10n.getString(text)}</StyledButton>;
};

export default Button;
