import { useLocalization } from '@fluent/react';
import { ChangeEvent } from 'react';
import styled from 'styled-components';

const StyledTextInput = styled.div(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    margin: 15,
    borderRadius: 3,
    input: {
      width: '100%',
      padding: 15,
    },
  },
  ({ theme }) => ({
    background: theme.colors.background.light,
    boxShadow: `inset 0 0 2px ${theme.colors.accent}`,
  }),
);

interface TextInputProps {
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const TextInput = ({ placeholder, onChange, value }: TextInputProps) => {
  const { l10n } = useLocalization();

  return (
    <StyledTextInput>
      <input
        type="text"
        value={value}
        placeholder={l10n.getString(placeholder)}
        onChange={onChange}
      ></input>
    </StyledTextInput>
  );
};

export default TextInput;
