import { memo, SyntheticEvent, useEffect, useState } from 'react'

export function Snackbar(
  props: Readonly<{
    message: string
    open: boolean
    handleClose: (event: SyntheticEvent | Event, reason?: string) => void
    children?: React.ReactNode
  }>
) {
  const [isOpen, setIsOpen] = useState(props.open)

  useEffect(() => {
    setIsOpen(props.open)
  }, [props.open])

  return (
    <div>
      {props.children}
      {isOpen && (
        <div>
          <div>{props.message}</div>
          <button onClick={props.handleClose}>Close</button>
        </div>
      )}
    </div>
  )
}

export default memo(Snackbar)
