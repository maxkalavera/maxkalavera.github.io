import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from 'src/pages/Home';
import Resume from 'src/pages/Resume';
import Projects from 'src/pages/Projects';

export default function Router () {
  return (
    <HashRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route 
          path="/"
          Component={Home}
        />
        <Route 
          path="/resume"
          Component={Resume}
        />
        <Route 
          path="/projects"
          Component={Projects}
        />
      </Routes>
    </HashRouter>
  );
}