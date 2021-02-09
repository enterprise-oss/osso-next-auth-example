import Layout from '../components/layout'
import { getCsrfToken, signIn } from 'next-auth/client';
import { useEffect, useState } from 'react';

export default function Page () {
  const [email, setEmail] = useState('');

  return (
    <Layout>
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use <a href={`https://next-auth.js.org`}>NextAuth.js</a> for authentication.
      </p>
      <p>
        Use the Sign In button above to use Osso's Hosted Login, or enter an email address below - an IDP must be configured for the 
        provided domain. <code>user@example.com</code> is configured with Osso's Mock IDP.
      </p>
        <form onSubmit={(e) => {
          e.preventDefault();
          signIn("osso", null, { email })
          }
        }>
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <button type="submit">Sign In with SSO</button>
        </form>  
      
    </Layout>
  )
}