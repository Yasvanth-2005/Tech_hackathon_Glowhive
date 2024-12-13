import react from '@vitejs/plugin-react';

export default {
  plugins: [
    react(), // React plugin to handle React JSX and features
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        console.log(warning); // Log the warning to understand its cause
        warn(warning); // Pass the warning to the default handler
      },
    },
  },
};
