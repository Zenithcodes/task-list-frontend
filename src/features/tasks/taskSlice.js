import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    setTasks: (state, action) => {
      return action.payload;
    },
    addTask: (state, action) => {
      state.push(action.payload);
    },
    deleteTask: (state, action) => {
      return state.filter(task => task.id !== action.payload);
    },
    updateTask: (state, action) => {
      return state.map(task =>
        task.id === action.payload.id ? action.payload : task
      );
    },
  },
});

export const { setTasks, addTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
