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

const Login = ({ toggleForm, handleLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data } = await supabase
      .from('users')
      .select()
      .eq('username', username)
      .eq('password', password)
      .single();

    if (!data) {
      setError('Invalid username or password.');
      return;
    }

    console.log('User logged in successfully');
    setError('');
    handleLoginSuccess();
  };

  return (
    <Form onSubmit={handleLogin}>
      <h2>Login</h2>
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
      <Button type="submit">Login</Button>
      <SwitchButton onClick={toggleForm}>Don't have an account? Sign Up</SwitchButton>
    </Form>
  );
};

export default Login;
