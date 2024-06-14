// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Indexlogin from './Pages/Login/index'; // Corrected import to index.jsx
// import Login from './Pages/Login/Login'; // Import Login component
// import Search from './Pages/Search/index';
// import Home from './Pages/Home/index'
// import FSearch from './Pages/Search/FSearch'
// import RSearch from './Pages/Search/RSearch'
// import './App.css';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Indexlogin />} /> {/* Render Index first */}
//         <Route path="/Login" element={<Login />} /> {/* Render Login component */}
//         <Route path="/Home" element={<Home />} />
//         <Route path="/search" element={<Search />} />
//         <Route path="/FSearch" element={<FSearch />} />
//         <Route path="/RSearch" element={<RSearch />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Pages/Search/AuthContext';
import ProtectedRoute from './Pages/Search/ProtectedRoute';
// import Indexlogin from './Pages/Login/index'; // Corrected import to index.jsx
import Login from './Pages/Login/index'; // Import Login component
import Search from './Pages/Search/index';
import Home from './Pages/Home/index';
import FSearch from './Pages/Search/FSearch';
import RSearch from './Pages/Search/RSearch';
// import NavBar from './components/Navbar';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      {/* <NavBar/> */}
        <Routes>
        {/* <Route path="/" element={<Indexlogin />} />  */}
          <Route path="/" element={<Login />} /> {/* Render Login component */}
          <Route path="/Home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
          <Route path="/FSearch" element={<ProtectedRoute element={<FSearch />} />} />
          <Route path="/RSearch" element={<ProtectedRoute element={<RSearch />} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;