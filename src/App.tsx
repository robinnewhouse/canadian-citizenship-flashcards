import { useState, useEffect } from 'react';
import './App.css';
import { Flashcard } from './Flashcard';
import questionsData from './questions.json';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const currentQuestion = questionsData[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === questionsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? questionsData.length - 1 : prevIndex - 1
    );
  };

  const randomCard = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * questionsData.length);
    setCurrentIndex(randomIndex);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextCard();
      } else if (event.key === 'ArrowLeft') {
        prevCard();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this runs once on mount, but wait...
  // The functions nextCard, prevCard depend on state.
  // If I use them inside useEffect with empty dependency, they will use stale closures.
  // I need to use the functional update form of setState inside those functions (which I did for setCurrentIndex),
  // BUT nextCard and prevCard themselves are recreated on every render if I don't use useCallback.
  // And if I use them in useEffect, I need to include them in dependency array.
  // OR, I can just define the logic inside the effect or use refs.
  
  // Better approach: Use functional state updates for everything inside the effect, 
  // or add dependencies. Adding dependencies might cause re-attaching listeners often.
  // Let's rely on the fact that `setCurrentIndex` handles the previous state correctly.
  // However, `isFlipped` state update in `nextCard` (setIsFlipped(false)) doesn't depend on prev state, so that's fine.
  // But wait, `nextCard` is defined in the component scope. The closure `nextCard` captures the scope of the render it was created in.
  // If I call `nextCard()` inside `useEffect` (which is created only on mount), it will call the `nextCard` from the first render.
  // Inside `nextCard` from first render:
  // `setCurrentIndex` is stable.
  // `questionsData` is static import.
  // So `nextCard` logic: `setCurrentIndex(prev => ...)` is safe.
  // `setIsFlipped(false)` is safe.
  
  // So actually, it IS safe to call `nextCard` from the initial useEffect even if `nextCard` function identity changes, 
  // IF `nextCard` implementation doesn't rely on any other props/state values directly (it uses `questionsData` which is static, and `setCurrentIndex` functional update).
  
  // HOWEVER, linter might complain about missing dependencies.
  // To be perfectly safe and clean, I should move the keydown handler logic to call the state setters directly or wrap handlers in useCallback.
  
  // Let's try wrapping handlers in useCallback to satisfy strict mode and linters, 
  // and include them in useEffect dependency.

  /*
  const nextCard = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === questionsData.length - 1 ? 0 : prevIndex + 1
    );
  }, []);
  */
  
  // Wait, `questionsData` is external.
  
  // I'll rewrite App.tsx to use useCallback for handlers and include them in useEffect.

  return (
    <div className="app-container">
      <h1>Canadian Citizenship Test</h1>
      <div className="card-container">
        <Flashcard 
          question={currentQuestion.question} 
          answer={currentQuestion.answer}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />
      </div>
      <div className="controls">
        <button onClick={prevCard}>Previous</button>
        <button onClick={randomCard}>Random</button>
        <button onClick={nextCard}>Next</button>
      </div>
      <p className="counter">
        Question {currentIndex + 1} of {questionsData.length}
      </p>
      <p className="hint">
        Use ⬅️ ➡️ to navigate, ⬆️ ⬇️ to flip
      </p>
    </div>
  );
}

export default App;
