// SignUp.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
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

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if username already exists
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('username', username);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.length > 0) {
      setError('Username is already taken.');
      return;
    }

    // Create new user
    const { user, error: signUpError } = await supabase
      .from('users')
      .insert([{ username, password }]);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      console.log('User signed up successfully:', user);
      setError('');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit">Sign Up</Button>
      </Form>
    </Container>
  );
};

export default SignUp;
