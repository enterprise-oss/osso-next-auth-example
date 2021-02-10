import Layout from '../components/layout'
import { signIn } from 'next-auth/client';
import { OssoProvider, OssoLogin } from '@enterprise-oss/osso';

const Button = props => (
  <button {...props} type="submit">Continue</button>
)

const Input = ({ onChange, ...props}) => (
  <>
    <label htmlFor={props.id}>{props.label}</label>
    <input 
      {...props}
      // Osso expects a value in change handlers rather than events
      onChange={(e) => onChange && onChange(e.target.value)} 
    />
  </>
)
export default function Page () {
  return (
    <Layout>
      <h1>Osso with NextAuth.js Example</h1>
      <h3>with @enterprise-oss/osso</h3>
      <p>
        This is an example site to demonstrate how to integrate{' '}
        <a href="https://ossoapp.com">Osso</a> into a NextJS app using{' '}
        <a href={`https://next-auth.js.org`}>NextAuth.js</a> by integrating  
        the OssoLogin component from Osso's react library.
      </p>
      <p>
        Use the Sign In form below and enter an email address - an IDP must be configured for the 
        provided domain. <code>user@example.com</code> is configured with Osso's Mock IDP.
      </p>
      <OssoProvider
        client={{
          baseUrl: "https://demo.ossoapp.com",
        }}
      >
        <OssoLogin
          containerClass="login-form"
          ButtonComponent={Button}
          InputComponent={Input}
          onSamlFound={(email) => signIn("osso", null, { email })}
          onSubmitPassword={(email, password) => {
           console.log(
              `Password submitted - sign the user in with Email: ${email}, Password: ${password}`
            );
            return Promise.resolve();
          }}
        />
      </OssoProvider>
    </Layout>
  )
}