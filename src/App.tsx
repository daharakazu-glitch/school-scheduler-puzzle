import { useEffect } from 'react';
import { ScheduleProvider, useScheduleContext } from './contexts/ScheduleContext';
import { Board } from './components/Board/Board';
import { initialInstructors, initialSessions } from './engine/initialData';

const SchedulerApp = () => {
  const { dispatch } = useScheduleContext();

  useEffect(() => {
    // Inject initial static data
    dispatch({
      type: 'INIT_DATA',
      payload: { sessions: initialSessions, instructors: initialInstructors }
    });
  }, [dispatch]);

  return <Board />;
};

function App() {
  return (
    <ScheduleProvider>
      <SchedulerApp />
    </ScheduleProvider>
  );
}

export default App;
