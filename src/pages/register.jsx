import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Title,
  Form,
  Input,
  Button,
  LinkText,
} from '../components/styledAuthComponents';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, {
        name,
        email,
        password,
      });

      if (res.status === 201 || res.status === 200) {
        navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      alert(message);
    }
  };

  return (
    <Container>
      <Title>Register</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <Button type="submit">Register</Button>
      </Form>
      <LinkText>
        Already have an account? <Link to="/">Login</Link>
      </LinkText>
    </Container>
  );
}

export default RegisterPage;
