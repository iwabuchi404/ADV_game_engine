import { ChoiceMenuContainer, ChoiceButton } from './ChoiceMenu.css';
import { Choice } from '../../types/scenario';
import processText from '../../utils/TextProcessor';

interface ChoiceMenuProps {
  choices: Choice[];
  onChoiceSelected: (choice: Choice, index: number) => void;
}

const ChoiceMenu = ({ choices, onChoiceSelected }: ChoiceMenuProps) => {
  return (
    <div className={ChoiceMenuContainer}>
      {choices.map((choice, index) => (
        <button
          className={ChoiceButton}
          key={index}
          onClick={() => onChoiceSelected(choice, index)} // インデックスも渡す
        >
          <span style={{ whiteSpace: 'pre-line' }}>{processText(choice.text)}</span>
        </button>
      ))}
    </div>
  );
};

export default ChoiceMenu;
