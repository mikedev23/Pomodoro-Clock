import React, { useState, useEffect, useRef } from 'react'
import './App.css'

const App = () => {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [timerLabel, setTimerLabel] = useState('Session')
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60)
  const [isActive, setIsActive] = useState(false)
  const [isSession, setIsSession] = useState(true)
  const [intervalId, setIntervalId] = useState(null)
  const beepRef = useRef(null)

  useEffect(() => {
    setTimeLeft(sessionLength * 60)
  }, [sessionLength])

  useEffect(() => {
    if (isActive && timeLeft === 0) {
      beepRef.current.play()
      if (isSession) {
        setTimerLabel('Break')
        setTimeLeft(breakLength * 60)
      } else {
        setTimerLabel('Session')
        setTimeLeft(sessionLength * 60)
      }
      setIsSession(!isSession)
    }
  }, [isActive, timeLeft, breakLength, sessionLength, isSession])

  const formatTime = time => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (time % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const handleStartStop = () => {
    if (isActive) {
      clearInterval(intervalId)
      setIsActive(false)
    } else {
      const id = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)
      setIntervalId(id)
      setIsActive(true)
    }
  }

  const handleReset = () => {
    clearInterval(intervalId)
    setIsActive(false)
    setBreakLength(5)
    setSessionLength(25)
    setTimerLabel('Session')
    setTimeLeft(25 * 60)
    setIsSession(true)
    if (beepRef.current) {
      beepRef.current.pause()
      beepRef.current.currentTime = 0
    }
  }

  const handleBreakDecrement = () => {
    if (breakLength > 1 && !isActive) {
      setBreakLength(prevLength => prevLength - 1)
    }
  }

  const handleBreakIncrement = () => {
    if (breakLength < 60 && !isActive) {
      setBreakLength(prevLength => prevLength + 1)
    }
  }

  const handleSessionDecrement = () => {
    if (sessionLength > 1 && !isActive) {
      setSessionLength(prevLength => prevLength - 1)
    }
  }

  const handleSessionIncrement = () => {
    if (sessionLength < 60 && !isActive) {
      setSessionLength(prevLength => prevLength + 1)
    }
  }

  return (
    <div className='container'>
      <h1>⏰ Pomodoro Clock ⏰</h1>

      <div className='grid-container'>
        <div className='grid-item'>
          <div>
            <h2 id='break-label'>Break Length</h2>
            <div className='buttons'>
              <button id='break-decrement' onClick={handleBreakDecrement}>
                -
              </button>
              <span id='break-length'>{breakLength}</span>
              <button id='break-increment' onClick={handleBreakIncrement}>
                +
              </button>
            </div>
          </div>
        </div>

        <div className='grid-item'>
          <div>
            <h2 id='session-label'>Session Length</h2>
            <div className='buttons'>
              <button id='session-decrement' onClick={handleSessionDecrement}>
                -
              </button>
              <span id='session-length'>{sessionLength}</span>
              <button id='session-increment' onClick={handleSessionIncrement}>
                +
              </button>
            </div>
          </div>
        </div>

        <div className='grid-item'>
          <div>
            <h2 id='timer-label'>{timerLabel}</h2>
            <h2 id='time-left'>{formatTime(timeLeft)}</h2>
          </div>
        </div>

        <div className='grid-item'>
          <div className='buttons'>
            <button id='start_stop' onClick={handleStartStop}>
              {isActive ? 'Pause' : 'Play'}
            </button>
            <button id='reset' onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <audio
        id='beep'
        ref={beepRef}
        src={process.env.PUBLIC_URL + '/sounds/nba-draft-sound-2021.mp3'}
      ></audio>
    </div>
  )
}

export default App
