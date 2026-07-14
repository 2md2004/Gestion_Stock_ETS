import LoginForm from '../components/LoginForm'
import loginIllustration from '../assets/login.svg'
import '../styles/Login.css'

const Login = () => {
  return (
    <div className="loginPage">
      <div className="background">
        <div className="gradient"></div>
        <div className="pattern"></div>
      </div>

      <div className="container">
        <div className="leftPanel">
          <LoginForm />
        </div>

        <div className="rightPanel">
          <div className="illustrationSection">
            <img
              src={loginIllustration}
              alt="Illustration connexion"
              className="illustration"
            />
          </div>

          <div className="footer">
            <p className="version">Version 1.0.0</p>
            <p className="copyright">
              © 2026 ETS Beug Serigne Mansour Sy - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login