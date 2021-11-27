import Select from '../../components/Input/Select'

const Login = () => {
  const loginTypeOptiosn = [{name: 'Password Flow', value: 'passwordFlow'}, {name: '3 Legged Login', value: '3leggedLogin'}]
  const handleLoginTypeChange = (e) => {
    console.log('Changed')
  }
  return (
    <>
      Login
      <Select label="Login type" id="loginType" options={loginTypeOptiosn} value='3LeggedLogin' onChange={handleLoginTypeChange} />
    </>
  )
}

export default Login