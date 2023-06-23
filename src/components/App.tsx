import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from 'src/components/Layout';
import Home from 'src/pages/Home';
import Resume from 'src/pages/Resume';
import Projects from 'src/pages/Projects';
import 'src/styles/globals.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/resume/?",
    element: <Layout><Resume /></Layout>,
  },
  {
    path: "/projects/?",
    element: <Layout><Projects /></Layout>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
