/**
 * @fileoverview Main Application Component
 * @module app
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { TasksPage } from '@/pages/tasks-page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <TasksPage />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
