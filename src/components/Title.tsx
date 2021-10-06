import { useLocalization } from '@fluent/react';
import styled from 'styled-components';

const StyledTitle = styled.h1(
  {
    margin: 15,
  },
  ({ theme }) => ({
    color: theme.colors.accent,
    textShadow: `0 4px 0 ${theme.colors.background.light}, 0 4px 2px ${theme.colors.accent}`,
  }),
);

interface TitleProps {
  text: string;
}

const Title = ({ text }: TitleProps) => {
  const { l10n } = useLocalization();
  return <StyledTitle>{l10n.getString(text)}</StyledTitle>;
};

export default Title;
