import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
  isInitialized: boolean;
}

const initialState: ThemeState = {
  isDarkMode: true, // Default to dark mode to match server HTML
  isInitialized: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      console.log('toggleTheme called, current isDarkMode:', state.isDarkMode);
      state.isDarkMode = !state.isDarkMode;
      console.log('toggleTheme new isDarkMode:', state.isDarkMode);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', state.isDarkMode.toString());
        
        // Apply theme to document
        if (state.isDarkMode) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
        
        console.log('Theme toggled, localStorage set to:', state.isDarkMode.toString());
        console.log('Document classes:', document.documentElement.className);
      }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', state.isDarkMode.toString());
        
        // Apply theme to document
        if (state.isDarkMode) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      }
    },
    initializeTheme: (state) => {
      console.log('initializeTheme called');
      if (typeof window !== 'undefined' && !state.isInitialized) {
        try {
          const savedTheme = localStorage.getItem('darkMode');
          console.log('Saved theme from localStorage:', savedTheme);
          
          // Default to dark mode if no saved preference (matches server HTML)
          const newIsDarkMode = savedTheme ? savedTheme === 'true' : true;
          state.isDarkMode = newIsDarkMode;
          state.isInitialized = true;
          
          // Only apply to document if theme actually changed from default
          if (!newIsDarkMode) {
            // Only switch to light if saved preference is light
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
          } else {
            // Ensure dark mode is set (should already be default)
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            document.documentElement.style.colorScheme = 'dark';
          }
          
          console.log('Theme initialized to:', state.isDarkMode ? 'dark' : 'light');
        } catch (error) {
          console.log('Error initializing theme, using default:', error);
          state.isDarkMode = true;
          state.isInitialized = true;
        }
      }
    },
  },
});

export const { toggleTheme, setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer; 