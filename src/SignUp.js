import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import styled from '@emotion/styled';

const Form = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  margin: 0.5rem 0;
  padding: 0.75rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: black;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px #007bff;
  }
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.6);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.8);
  }
`;

const SwitchButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: none;
  color: #007bff;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SignUp = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

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
      <SwitchButton onClick={toggleForm}>Already have an account? Login</SwitchButton>
    </Form>
  );
};

export default SignUp;
