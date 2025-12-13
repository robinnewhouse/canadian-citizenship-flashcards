import { useState } from 'react';
import './App.css';
import { Flashcard } from './Flashcard';
import questionsData from './questions.json';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questionsData[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === questionsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? questionsData.length - 1 : prevIndex - 1
    );
  };

  const randomCard = () => {
    const randomIndex = Math.floor(Math.random() * questionsData.length);
    setCurrentIndex(randomIndex);
  };

  return (
    <div className="app-container">
      <h1>Canadian Citizenship Test</h1>
      <div className="card-container">
        <Flashcard 
          key={currentQuestion.id} // Add key to reset state on change
          question={currentQuestion.question} 
          answer={currentQuestion.answer} 
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
    </div>
  );
}

export default App;
