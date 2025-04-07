import React from 'react';
import { ChoiceMenuContainer, ChoiceButton } from './ChoiceMenu.css';

const ChoiceMenu = ({ choices, onChoiceSelected }) => {
  return (
    <div className={ChoiceMenuContainer}>
      {choices.map((choice, index) => (
        <button
          className={ChoiceButton}
          key={index}
          onClick={() => onChoiceSelected(choice, index)} // インデックスも渡す
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
};

export default ChoiceMenu;
