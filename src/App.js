import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import Loading from './Loading';
import HomePage from './HomePage';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fff;
  color: #000;
`;

const FormContainer = styled.div`
  position: relative;
  width: 300px;
  height: 400px;
  perspective: 1000px;
`;

const FormWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transition: transform 0.8s ease-in-out;
  transform-style: preserve-3d;
  transform: ${(props) => (props.showLogin ? 'rotateY(0)' : 'rotateY(180deg)')};
`;

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleLoginSuccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 2000);
  };

  return (
    <Container>
      {isLoading ? (
        <Loading />
      ) : isLoggedIn ? (
        <HomePage />
      ) : (
        <FormContainer>
          <FormWrapper showLogin={showLogin}>
            <div style={{ position: 'absolute', backfaceVisibility: 'hidden', width: '100%', height: '100%' }}>
              <Login toggleForm={toggleForm} handleLoginSuccess={handleLoginSuccess} />
            </div>
            <div style={{ position: 'absolute', backfaceVisibility: 'hidden', width: '100%', height: '100%', transform: 'rotateY(180deg)' }}>
              <SignUp toggleForm={toggleForm} />
            </div>
          </FormWrapper>
        </FormContainer>
      )}
    </Container>
  );
};

export default App;
