import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  margin-bottom: 15px;
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #1976d2;
    outline: none;
  }
`;

export const Button = styled.button`
  padding: 12px;
  background-color: #1976d2;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #115293;
  }
`;

export const LinkText = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  a {
    color: #1976d2;
    text-decoration: none;
    font-weight: bold;
  }
`;
