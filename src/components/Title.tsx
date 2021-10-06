import { useLocalization } from '@fluent/react';
import { FC, HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledTitle = styled.h1(
  {
    margin: 15,
  },
  ({ theme }) => ({
    color: theme.colors.accent,
    textShadow: `0 4px 0 ${theme.colors.background.light}, 0 4px 2px ${theme.colors.accent}`,
  }),
  ({ onClick }) => onClick && { cursor: 'pointer' },
);

interface TitleProps {
  text: string;
}

const Title: FC<TitleProps & HTMLAttributes<HTMLHeadingElement>> = ({
  text,
  ...props
}) => {
  const { l10n } = useLocalization();
  const oc = () => {
    console.log('asd');
    const asd = props.onClick as () => void;
    if (asd) {
      asd();
    }
  };
  return (
    <StyledTitle {...props} onClick={oc}>
      {l10n.getString(text)}
    </StyledTitle>
  );
};

export default Title;
