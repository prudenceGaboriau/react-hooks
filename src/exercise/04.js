// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils';

function Board(props) {
  const {onClick, squares} = props;

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const squaresDefaultValue = Array(9).fill(null)
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0)
  const [squaresHistory, setSquaresHistory] = useLocalStorageState('squaresHistory', [squaresDefaultValue])
  const currentSquare = squaresHistory[currentStep];
  const nextValue = calculateNextValue(squaresHistory[currentStep]);
  const winner = calculateWinner(squaresHistory[currentStep]);
  const status = calculateStatus(winner, squaresHistory[currentStep], nextValue);

  function selectSquare(square) {
    if (winner || currentSquare[square]) {
      return;
    }

    const newSquaresHistory = squaresHistory.slice(0, currentStep + 1)
    const newCurrentSquare = [...currentSquare];
    newCurrentSquare[square] = nextValue;
    
    setSquaresHistory([...newSquaresHistory, newCurrentSquare])
    setCurrentStep((previousStep) => previousStep + 1)
  }

  function restart() {
    setSquaresHistory([squaresDefaultValue])
    setCurrentStep(0)
  }

  function handleClickStep(index) {
    setCurrentStep(index);
  }

  const moves = squaresHistory.map((square, step) => {
    const description = step === 0 ? 'Go to game start' : `Go to move #${step}`;
    const isCurrentStep = step === currentStep;

    return (
      <li key={step}><button disabled={isCurrentStep ? true : false} onClick={() => handleClickStep(step)}>{isCurrentStep ? `${description} (current)` : description}</button></li>
    )
  })
  
  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <Board onClick={selectSquare} squares={squaresHistory[currentStep]} />
        <ol>{moves}</ol>
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  console.log('calc status', winner)
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares, currentStep) {
  console.log('next val', squares, currentStep);
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
