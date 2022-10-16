import logo from './logo.svg';
import './App.css';
import { Profile } from './components/pages/Profile';
import { useEffect, useState } from 'react';
import { Loader } from './components/Loader';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(() => {
    setIsLoading(false)  
  });

  return (
      isLoading ? <></> :
      <Profile/>
  );
}

export default App;
