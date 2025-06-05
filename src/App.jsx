import { useState, useEffect } from 'react'
import './App.css'

var word = "SQUID";


function Tile({alphabet}) {
  return (
    <>
      <span className="tile">{alphabet.toUpperCase()}</span>
    </>
  );
}

function checkWord(guessWord) {
  for (let i = 0; i < guessWord.length; i ++) {
    if (guessWord[i] == word[i]) {
      continue;
    }
    else {
      return false;
    }
  }
  return true;
}
 
function Board() {
  const height = 6;
  const width = 5;
  
  const [guess, setGuess] = useState(
    Array.from({ length: height }, () => Array(width).fill(""))
  );
  const[curRow, setCurRow] = useState(0);
  const[curCol, setCurCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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
        if (curCol === 0 && guess[curRow][0] === "") return;

        setGuess(prev => {
          const updated = prev.map(row => [...row]);
          //updated[curRow][curCol] = "";
          if (guess[curRow][curCol] !== "") {
            // If current tile is not empty, delete it
            updated[curRow][curCol] = "";
          } else if (curCol > 0) {
            // If current tile is empty, delete previous tile
            updated[curRow][curCol - 1] = "";
          }

          return updated;
        });

        if (curCol > 0) {
          setCurCol(prev => prev - 1);
        }
      }
      

      else if (e.code == "Enter") {
        const currentWord = guess[curRow].join("");
        if (currentWord.length != width || guess[curRow].includes("")) return;

        const isCorrect = checkWord(currentWord);

        if (isCorrect) {
          setGameOver(true);
        }

        setCurRow(prev => prev + 1);
        setCurCol(0);

        if (curRow + 1 === height) {
          setGameOver(true);
        } 
      }
    }

    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [curRow, curCol, guess, gameOver]);

return (
  <div id="board">
      {guess.map((row, i) => (
        <div className="word-guess" key={i}>
          {row.map((letter, j) => (
            <Tile key={j} alphabet={letter}/>
          ))}
        </div> 
      ))}
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

