import { css } from 'lit-element';

export const styleVariables = {
  '--time-picker-card-background-color': 'rgb(37, 47, 68)',
};

export const styles = css`
  .time-picker-ha-card {
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .time-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;
  }

  .time-picker-icon {
    width: 30px;
    padding: 8px;
    text-align: center;
    cursor: pointer;
  }

  .time-input {
    width: 30px;
    padding: 8px;
    background: var(--time-picker-card-background-color);
    border: 0;
    color: var(--text-color, #fff);
    text-align: center;
    font-size: 1em;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='number']:focus {
    outline: none;
  }

  input[type='number']:invalid {
    box-shadow: none;
    outline: none;
    border: 0;
    border-bottom: 2px solid red;
  }
`;
