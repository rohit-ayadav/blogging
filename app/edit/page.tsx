import React from 'react'
import { ErrorMessage } from '../blogs/[id]/ErrorMessage'

const page = () => {
  return (
    <div>
      <ErrorMessage message='No Blog id found, please check the id...' />
    </div>
  )
}

export default page
