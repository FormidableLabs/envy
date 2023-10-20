import Header from '@/components/ui/Header';
import MainDisplay from '@/components/ui/MainDisplay';
import ApplicationContextProvider from '@/context/ApplicationContext';

export default function App() {
  return (
    <ApplicationContextProvider>
      <div className="h-full flex flex-col overflow-hidden">
        <Header />
        <main className="flex-auto overflow-hidden">
          <MainDisplay />
        </main>
      </div>
    </ApplicationContextProvider>
  );
}
