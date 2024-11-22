import React, { useMemo } from 'react'

export function StatusModal({message, error}) {
  const sourceMessage = error.type === 'field' ? `Try to look at ${error.path} form field` : error.type === 'user' ? `It seems like you don't have ${error.path} or it is invalid` : null
  return (
    <div className={`StatusModal ${message === 'Success' ? 'Success' : 'Error'}`}>
      <h3>{message} : {error.msg}</h3>
      {sourceMessage ?? (<span>{source}</span>)}
    </div>
  )
}
