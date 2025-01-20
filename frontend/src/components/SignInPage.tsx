interface SignInPageProps {
  login: () => void;
}

const SignInPage = ({ login }: SignInPageProps) => {
  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={() => login()}>Sign in with Google</button>
    </div>
  )
}

export default SignInPage;