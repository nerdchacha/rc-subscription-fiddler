import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { ROUTES } from '../constants'

const useIsLoggedIn = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const dispatch = useDispatch()
  useEffect(() => {
    if (isLoggedIn) { return }
    dispatch(push(ROUTES.LOGIN))
  }, [])
  
}

export default useIsLoggedIn