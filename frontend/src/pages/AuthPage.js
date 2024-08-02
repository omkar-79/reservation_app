import React from 'react';
import '../css/AuthPage.css'

class LoginComponent extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          mode: this.props.mode || 'login'
      };
  }

  toggleMode = (newMode) => {
      this.setState({ mode: newMode  });
  }

  render() {
    const { mode } = this.state;
      return (
        
          <div>
              <div className={`form-block-wrapper form-block-wrapper--is-${this.state.mode}`}></div>
              <section className={`form-block form-block--is-${this.state.mode}`}>
                  <header className="form-block__header">
                  <h1>{mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
            <div className="form-block__toggle-block">
              <span>
                {mode === 'login'
                  ? 'Don\'t have an account?'
                  : 'Already have an account?'}
              </span>
              <div className="form-toggle-buttons">
                {mode === 'login' && (
                  <button
                    className={`toggle-button ${mode === 'signup' ? 'active' : ''}`}
                    onClick={() => this.toggleMode('signup')}
                  >
                    Sign Up
                  </button>
                )}
                {mode === 'signup' && (
                  <button
                    className={`toggle-button ${mode === 'login' ? 'active' : ''}`}
                    onClick={() => this.toggleMode('login')}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
                  </header>
                  <LoginForm mode={this.state.mode} onSubmit={this.props.onSubmit} />
                  <div className="or">Or</div>
                  <button className="button button--google full-width">
                      Login with Google
                  </button>
              </section>
          </div>
      );
  }
}

class LoginForm extends React.Component {
  render() {
      return (
          <form onSubmit={this.props.onSubmit}>
              <div className="form-block__input-wrapper">
                  <div className={`form-group form-group--login ${this.props.mode === 'signup' ? 'hidden' : ''}`}>
                      <Input type="text" id="username" label="user name" />
                      <Input type="password" id="password" label="password" />
                  </div>
                  <div className={`form-group form-group--signup ${this.props.mode === 'login' ? 'hidden' : ''}`}>
                      <Input type="text" id="fullname" label="full name" />
                      <Input type="email" id="email" label="email" />
                      <Input type="password" id="createpassword" label="password" />
                      <Input type="password" id="repeatpassword" label="repeat password" />
                  </div>
              </div>
              <button className="button button--primary full-width" type="submit">
                  {this.props.mode === 'login' ? 'Log In' : 'Sign Up'}
              </button>
          </form>
      );
  }
}

const Input = ({ id, type, label }) => (
  <input className="form-group__input" type={type} id={id} placeholder={label} />
);

const AuthPage = () => {
  const mode = 'login';

  return (
      <div className={`app app--is-${mode}`}>
          <LoginComponent
              mode={mode}
              onSubmit={() => {
                  console.log('submit');
              }}
          />
      </div>
  );
};

export default AuthPage;
