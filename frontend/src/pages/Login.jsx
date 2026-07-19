import LoginForm from '../components/LoginForm'
import loginIllustration from '../assets/Tablet login-rafiki.png'
import '../styles/Login.css'

const Login = () => {
  return (
    <div className="loginPage vh-100 d-flex align-items-center justify-content-center">
      <div className="loginCard row g-0 shadow-lg rounded-4 overflow-hidden bg-white mx-auto">
        <div className="col-12 col-lg-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
          <LoginForm />
        </div>

        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-4 p-lg-5 loginRightPanel">
          <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative illustrationSection">
            <img
              src={loginIllustration}
              alt="Illustration connexion"
              className="img-fluid illustration"
            />
          </div>

          <div className="text-center">
            <p className="small text-muted mb-1">Version 1.0.0</p>
            <p className="small text-muted mb-0">
              © 2026 Namora GROUP - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login