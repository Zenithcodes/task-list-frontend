import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';
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

const CancelButton = styled(Button)`
  background-color: #d32f2f;

  &:hover {
    background-color: #c62828;
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
  flex-wrap: wrap;
`;

const StatusButton = styled(Button)`
  background-color: ${(props) =>
    props.status === 'complete' ? '#388e3c' : '#d32f2f'};

  &:hover {
    background-color: ${(props) =>
      props.status === 'complete' ? '#2e7d32' : '#c62828'};
  }
`;

function DashboardPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.tasks.tasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get('/tasks');
        if (res.status === 200 && Array.isArray(res.data.data)) {
          dispatch(setTasks(res.data.data));
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [dispatch, token]);

  const handleAdd = async () => {
    if (!title || !description) return;
    try {
      const res = await axiosInstance.post('/tasks', { title, description, status: 'pending' });
      if (res.status === 201) {
        dispatch(addTask(res.data));
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/tasks/${id}`);
      if (res.status === 200) {
        dispatch(deleteTask(id));
      }
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdate = async () => {
    try {
      const res = await axiosInstance.put(`/tasks/${editId}`, {
        title: editTitle,
        description: editDescription,
      });
      if (res.status === 200) {
        dispatch(updateTask(res.data));
        setEditId(null);
        setEditTitle('');
        setEditDescription('');
      }
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'complete' ? 'pending' : 'complete';
    try {
      const res = await axiosInstance.put(`/tasks/${task.id}`, {
        ...task,
        status: newStatus,
      });
      if (res.status === 200) {
        dispatch(updateTask(res.data));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <Container>
      <Title>Task Dashboard</Title>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <TaskInputContainer>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <Button onClick={handleAdd}>Add Task</Button>
          </TaskInputContainer>

          <TaskList>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskItem key={task.id}>
                  {editId === task.id ? (
                    <>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <TaskActions>
                        <Button onClick={handleUpdate}>Save</Button>
                        <CancelButton onClick={() => setEditId(null)}>Cancel</CancelButton>
                      </TaskActions>
                    </>
                  ) : (
                    <>
                      <strong>{task.title}</strong>
                      <div>{task.description}</div>
                      <div>Status: {task.status}</div>
                      <TaskActions>
                        <StatusButton
                          status={task.status}
                          onClick={() => toggleStatus(task)}
                        >
                          {task.status === 'complete' ? 'Mark Pending' : 'Mark Complete'}
                        </StatusButton>
                        <Button onClick={() => startEdit(task)}>Edit</Button>
                        <CancelButton onClick={() => handleDelete(task.id)}>Delete</CancelButton>
                      </TaskActions>
                    </>
                  )}
                </TaskItem>
              ))
            ) : (
              <div>No tasks available.</div>
            )}
          </TaskList>
        </>
      )}
    </Container>
  );
}

export default DashboardPage;
