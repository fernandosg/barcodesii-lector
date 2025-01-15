import React from 'react'

export default function Show({ children, when }) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return when ? <>{children}</> : null
}
