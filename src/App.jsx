import { useState, useEffect } from 'react'
import './App.css'
import 'animate.css'
import { wordList } from './assets/wordList';
import { guessList } from './assets/guessList';

var word = "SQUID";
//const word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

const guessSet = new Set(guessList); 

function Tile({alphabet, tileState, isShaking}) {
  let animationClass = '';
  if (tileState) {
    animationClass = 'animate__animated animate__flipInX';
  } else if (isShaking) {
    animationClass = 'animate__animated animate__shakeX';
  }

  return (
    <>
      <span className={`tile ${tileState} ${animationClass}`}>
        {alphabet.toUpperCase()}
      </span>
    </>
  );
}
 
function Board() {
  const height = 6;
  const width = 5;
  
  const [guess, setGuess] = useState(
    Array.from({ length: height }, () => Array(width).fill(""))
  );
  const [tileStatus, setTileStatus] = useState(
  Array.from({ length: height }, () => Array(width).fill(""))
  );
  const[curRow, setCurRow] = useState(0);
  const[curCol, setCurCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isValidGuess, setIsValidGuess] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    function handleKeyUp(e) {
      if (gameOver) return;

      if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (curRow >= height || curCol >= width) return;
        if ((guess[curRow][curCol] != "") && (curCol >= (width - 1))) return;
        
        const letter = e.key.toUpperCase();

        setGuess(prevGuess => {
          const newGuess = prevGuess.map(row => [...row]);
          newGuess[curRow][curCol] = letter;  
          return newGuess;
        });

        
        if (curCol < width -1) {
          setCurCol(prev => prev + 1);
        }
      }

      else if (e.code === "Backspace") {

        setGuess(prev => {
          const updated = prev.map(row => [...row]);
          let newCol = curCol;

          if (guess[curRow][curCol] !== "") {
            updated[curRow][curCol] = "";
          } else if (curCol > 0) {
            newCol = curCol - 1;
            updated[curRow][newCol] = "";
          }

          setCurCol(newCol);
          return updated;
        });
      }

      else if (e.code == "Enter") {
        const currentWord = guess[curRow].join("");
        if (currentWord.length != width || guess[curRow].includes("")) return;

        if (guessSet.has(currentWord.toLowerCase())) {
          setIsValidGuess(true);
        }
        else {
          setIsValidGuess(false);
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
          return;
        }


        const newStatus = Array(width).fill("absent");
        const wordArr = word.split("");
        const used = Array(width).fill(false);

        //First pass: correct letters
        for (let i = 0; i < width; i++) {
          if (guess[curRow][i] === word[i]) {
            newStatus[i] = "correct";
            used[i] = true;
          }
        }

        //second pass: present letters
        for (let i = 0; i < width; i++) {
          if (newStatus[i] === "correct") continue;
          const index = wordArr.findIndex((char, j) => char === guess[curRow][i] && !used[j]);
          if (index !== -1){
            newStatus[i] = "present";
            used[index] = true;
          }
        }

        setTileStatus(prev =>{
          const updated = prev.map(row => [...row]);
          updated[curRow] = newStatus;
          return updated;
        })


        const isCorrect = currentWord === word;
        if (isCorrect || curRow + 1 === height) {
          setGameOver(true);
        }

        setCurRow(prev => prev + 1);
        setCurCol(0);
      }
      setIsValidGuess(true);
    }
    

    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [curRow, curCol, guess, gameOver]);

return (
  <div id="board">
      {guess.map((row, i) => (
        <div className="word-guess" key={i}>
          {row.map((letter, j) => (
            <Tile key={`${i}-${j}-${tileStatus[i][j]}`}
                  alphabet={letter}
                  tileState={tileStatus[i][j]}
                  isShaking={i === curRow && isShaking}
            />
          ))}
        </div>
      ))}

      {gameOver && (
  <div className="game-over">
    <p><strong>{word}</strong></p>
  </div>
)}
  {!isValidGuess && (
  <div className="game-over">
    <p><strong>Invalid Guess</strong></p>
  </div>
)}

  </div>
);
}



function App() {
  
  

  return (
    <>
      <h1 className="title">Wordle</h1>
      <hr />
      <br />
      <Board />
      <br />
      
    </>
  )
}

export default App

