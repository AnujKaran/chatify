
import './App.css';
import Auth from './components/Auth/Auth';
import Error from './components/Error/customError';
import Home from './components/Home/Home';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/Loader/Loader';


function App() {

  return (
    
    <div className="App">
     
     
        <BrowserRouter>
        
        <Routes>
          <Route path='/auth' element={<Auth/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/l' element={<Loader/>}/>
          <Route path='*' element={Error(404)}/>
        </Routes>
        <ToastContainer/>
        {/* <Chat/>s */}
        </BrowserRouter>
        
   
    </div>
  );
}

export default App;
