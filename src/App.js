// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import SignUp from './SignUp';
import Login from './Login';
import SignOut from './SignOut';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function App() {
  const [session, setSession] = useState(null);
  const [showSignUp, setShowSignUp] = useState(true);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Container>
      <h1>Tether</h1>
      {!session ? (
        <>
          {showSignUp ? <SignUp /> : <Login />}
          <Button onClick={() => setShowSignUp(!showSignUp)}>
            {showSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </Button>
        </>
      ) : (
        <SignOut />
      )}
    </Container>
  );
}

export default App;
