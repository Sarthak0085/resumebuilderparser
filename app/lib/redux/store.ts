import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import resumeReducer from './resumeSlice';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
