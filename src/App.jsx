import Die from "./Die";
import React from "react";
import { nanoid } from "nanoid";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";


export default function App() {
  const [dice, setDice] = React.useState(() => generateAllNewDice());
  const [getWin,setGetWin]  = React.useState(false);
  const { width, height } = useWindowSize();
  let rollCount = React.useRef(0);
  const buttonRef = React.useRef(null);

  React.useEffect(() => {
    const hasWon =
      dice.every((die) => die.isHeld) &&
      dice.every((die) => die.value === dice[0].value);
    setGetWin(hasWon);
  }, [dice]);
  
  function rollDice() {
    if (!getWin) {
      rollCount.current += 1;
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld === false
            ? { ...die, value: Math.ceil(Math.random() * 6) }
            : die
        )
      );
    } else {
      rollCount.current = 0;
      setDice(generateAllNewDice(),
      handleReset())
    }
  }

  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        if (die.id === id) {
          return { ...die, isHeld: !die.isHeld };
        }
        return die;
      })
    );
    handleStart();
  }
  function generateAllNewDice() {
    return new Array(10).fill(1).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }
  const diceElements = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      handleClick={() => hold(dieObj.id)}
    />
  ));


  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  React.useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) return;
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };
  const formattedTime = `${Math.floor(time / 60000)}:${Math.floor(
    (time % 60000) / 1000
  )
    .toString()
    .padStart(2, "0")}:${(time % 1000).toString().padStart(3, "0")}`;


  React.useEffect(() => {
    if (getWin) {
      buttonRef.current.focus();
    }
    }, [getWin]);

  return (
    <>
      <main>
        {getWin && <Confetti width={width} height={height} />}
        {getWin?handlePause():null}
        <div aria-live='polite' className='sr-only'>
          {getWin && (
            <p>
              Congratulations! You won! Press &quot;New Game&quot; to start
              again.
            </p>
          )}
        </div>
        <h1 className='title'>Tenzies</h1>
        <p className='instructions'>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className='die-container'>{diceElements}</div>
        <button ref={buttonRef} className='roll' onClick={rollDice}>
          {getWin ? "New Game" : "Roll"}
        </button>
        <div className="stopwatch-container">
          <p>Time to make a tenzie: </p>
          <h1 className="stopwatch-time">{formattedTime}</h1>
        </div>
        <div className="roll-container">
          <p>Times you rolled Dice: </p>
          <h1 className="roll-no">{rollCount.current}</h1>
        </div>
      </main>
    </>
  );
}
