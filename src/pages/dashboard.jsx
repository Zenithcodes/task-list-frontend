import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

// ... imports remain unchanged
import { setTasks, addTask, deleteTask, updateTask } from '../features/tasks/taskSlice';

const Container = styled.div`
  padding: 40px;
  max-width: 600px;
  margin: auto;
  font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const TaskInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1565c0;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled.li`
  background-color: #f5f5f5;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  position: relative;
`;

const TaskActions = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;

const TaskEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const CancelButton = styled(Button)`
  background-color: #d32f2f;

  &:hover {
    background-color: #c62828;
  }
`;


function DashboardPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.tasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json.data)) {
          dispatch(setTasks(json.data));
        }
      });
  }, [dispatch, token]);

  const handleAdd = async () => {
    if (!title || !description) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();
    if (res.ok) dispatch(addTask(data));
    setTitle('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) dispatch(deleteTask(id));
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdate = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    });
    const data = await res.json();
    if (res.ok) {
      dispatch(updateTask(data));
      setEditId(null);
      setEditTitle('');
      setEditDescription('');
    }
  };

  return (
    <Container>
      <Title>Task Dashboard</Title>
      <TaskInputContainer>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <Button onClick={handleAdd}>Add Task</Button>
      </TaskInputContainer>

      <TaskList>
        {tasks.map(task => (
          <TaskItem key={task.id}>
            {editId === task.id ? (
              <>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <TaskActions>
                  <Button onClick={handleUpdate}>Save</Button>
                  <Button onClick={() => setEditId(null)}>Cancel</Button>
                </TaskActions>
              </>
            ) : (
              <>
                <strong>{task.title}</strong>
                <div>{task.description}</div>
                <div>Status: {task.status}</div>
                <TaskActions>
                  <Button onClick={() => startEdit(task)}>Edit</Button>
                  <Button onClick={() => handleDelete(task.id)}>Delete</Button>
                </TaskActions>
              </>
            )}
          </TaskItem>
        ))}
      </TaskList>
    </Container>
  );
}

export default DashboardPage;
