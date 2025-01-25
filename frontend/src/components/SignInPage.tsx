import '../css/SignInPage.css'

interface SignInPageProps {
  login: () => void;
}

const SignInPage = ({ login }: SignInPageProps) => {
  return (
    <div className='signin-container'>
      <header>
        <h1>Library app</h1>
      </header>
      <button onClick={() => login()}>Google login</button>
    </div>
  )
}

export default SignInPage;