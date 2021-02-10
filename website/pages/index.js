import Layout from '../components/layout'
import { signIn } from 'next-auth/client';
import { useState } from 'react';

export default function Page () {
  const [email, setEmail] = useState('');

  return (
    <Layout>
      <h1>Osso with NextAuth.js Example</h1>
      <h3>with Osso's hosted login</h3>
      <p>
        This is an example site to demonstrate how to integrate{' '}
        <a href="https://ossoapp.com">Osso</a> into a NextJS app using{' '}
        <a href={`https://next-auth.js.org`}>NextAuth.js</a> using Osso's 
        hosted login page.
      </p>
      <p>
        Use the Sign In button below to use Osso's Hosted Login.{' '}
        <code>user@example.com</code> is configured with Osso's Mock IDP.
      </p>
      <div className="login-form">
        <button type="submit" onClick={() => signIn("osso")}>Sign In with SSO</button>
      </div>
    </Layout>
  )
}