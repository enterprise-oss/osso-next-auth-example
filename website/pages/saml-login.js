import Layout from '../components/layout'
import { signIn } from 'next-auth/client';
import { useState } from 'react';

export default function Page () {
  const [email, setEmail] = useState('');

  return (
    <Layout>
      <h1>Osso with NextAuth.js Example</h1>
      <h3>with a SAML-only form</h3>
      <p>
        This is an example site to demonstrate how to integrate{' '}
        <a href="https://ossoapp.com">Osso</a> into a NextJS app using{' '}
        <a href={`https://next-auth.js.org`}>NextAuth.js</a> by implementing 
        a sign in form only for SAML SSO users.
      </p>
      <p>
        Use the Sign In form below and enter an email address - an IDP must be configured for the 
        provided domain. <code>user@example.com</code> is configured with Osso's Mock IDP.
      </p>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            signIn("osso", null, { email })
          }}
          className="login-form"
        >
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <button type="submit">Sign In with SSO</button>
        </form>  
    </Layout>
  )
}