import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import axiosInstance from '../utils/axiosInstance'; 
import {
  Container,
  Title,
  Form,
  Input,
  Button,
  LinkText,
} from '../components/styledAuthComponents';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        '/users/login', 
        { email, password }
      );
      console.log(response)
      const {  tokens } = response.data;
      const user = response?.data?.data?.user;
      dispatch(setCredentials({ user, token: tokens.accessToken }));
      localStorage.setItem('refreshToken', tokens.refreshToken); 
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container>
      <Title>Login</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </Form>
      <LinkText>
        Don't have an account? <Link to="/register">Register</Link>
      </LinkText>
    </Container>
  );
}

export default LoginPage;
