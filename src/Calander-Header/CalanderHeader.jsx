import React from 'react'

export const CalanderHeader = ({dateDisplay, onNext, onBack}) => {
  return (
    <div id="header">
      <div id="monthDisplay">{dateDisplay}</div>
      <div>
          <button onClick={onBack} id="backButton">Back</button>
          <button onClick={onNext} id="nextButton">Next</button>
      </div>
    </div>
  )
}
