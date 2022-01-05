/*
  O MUI já possui a propriedade inputProps, que passa os atributos para o input padrões do HTML (minLength,maxLength),
  mas foi feito um componente para isso, para fazer a validação pelo JS, tornando mais dificil de acessar (OBS.:Não é impossivel)
*/

import { TextField, TextFieldProps } from '@mui/material';
import React, { useState } from 'react';

interface CheckValidator {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  beEqual?: string;
  regex?: RegExp;
  anotherError?: boolean;
}

interface ErrorMessages {
  required?: string;
  beEqual?: string;
  regex?: string;
  anotherError?: string;
}

interface StateValidator {
  valueDefault: string;
  updateValue: React.Dispatch<React.SetStateAction<string>>;
}

interface ErrorForm {
  valueDefault: number;
  updateValue: React.Dispatch<React.SetStateAction<number>>;
}

interface PropsTextfieldValidator {
  value: StateValidator;

  /* Repassa ao formulário quantos componentes possui erros (pode ser otimizado)*/
  errorForm?: ErrorForm;

  checkValidator?: CheckValidator;
  errorMessages?: ErrorMessages;

  label: string;
  name: string;
  //existem mais propriedades, mas só foram adicionados os mais uteis
  autoComplete?:
    | 'off'
    | 'on'
    | 'name'
    | 'given-name'
    | 'family-name'
    | 'email'
    | 'new-password'
    | 'current-password'
    | 'one-time-code'
    | 'street-address'
    | 'address-line1'
    | 'address-line2'
    | 'address-line3'
    | 'address-level1'
    | 'bday'
    | 'sex'
    | 'tel';
  type?: 'text' | 'password' | 'number' | 'tel' | 'email' | 'search';

  fullWidth?: boolean;
  margin?: TextFieldProps['margin'];
  icons?: TextFieldProps['InputProps'];
  children?: React.ReactNode;
}
export const TextfieldValidator = ({
  value,
  errorForm,
  checkValidator,
  errorMessages,
  label,
  name,
  autoComplete,
  type,
  fullWidth,
  margin,
  icons,
  children,
  ...rest
}: PropsTextfieldValidator) => {
  const [error, setError] = useState<string | undefined>('');
  const [haveError, setHaveError] = useState<boolean>(false);

  const checkError = (newError: string): void => {
    setError(newError);

    if (!haveError) errorForm?.updateValue!(errorForm.valueDefault + 1);

    setHaveError(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let texto = event.target.value;

    if (checkValidator?.maxLength! < texto.length) {
      texto = texto.slice(0, checkValidator?.maxLength!);
    }
    if (checkValidator?.minLength! > texto.length)
      checkError(
        `O campo exige no mínimo ${checkValidator?.minLength} caracteres`
      );
    else if (checkValidator?.beEqual && texto !== checkValidator?.beEqual)
      checkError(errorMessages?.beEqual || 'Os campos não são iguais');
    else if (checkValidator?.regex && !checkValidator?.regex.test(texto))
      checkError(errorMessages?.regex || 'O campo não está no formato correto');
    else if (checkValidator?.anotherError)
      checkError(errorMessages?.anotherError || 'Algum dado inválido');
    else {
      setError('');

      if (haveError && errorForm?.valueDefault! > 0)
        errorForm?.updateValue!(errorForm.valueDefault - 1);

      setHaveError(false);
    }

    value.updateValue(texto);
  };
  return (
    <TextField
      value={value.valueDefault}
      onChange={handleChange}
      label={label}
      name={name}
      autoComplete={autoComplete}
      type={type}
      // color='info'
      margin={margin || 'normal'}
      InputProps={icons}
      required={checkValidator?.required}
      error={haveError}
      helperText={haveError ? error : null}
      fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </TextField>
  );
};
