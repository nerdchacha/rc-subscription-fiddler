import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'

const useIsLoggedIn = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const dispatch = useDispatch()
  useEffect(() => {
    if (isLoggedIn) { return }
    dispatch(push('/login'))
  }, [])
  
}

export default useIsLoggedIn