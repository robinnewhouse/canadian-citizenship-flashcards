import './Flashcard.css';

interface FlashcardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
  skipTransition?: boolean;
}

export function Flashcard({ question, answer, isFlipped, onFlip, skipTransition }: FlashcardProps) {
  return (
    <div
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
      title="Click or press Up/Down to flip"
    >
      <div className={`flashcard-inner ${skipTransition ? 'no-transition' : ''}`}>
        <div className="flashcard-front">
          <p>{question}</p>
        </div>
        <div className="flashcard-back">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
