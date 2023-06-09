import {Routes,Route} from 'react-router-dom'
import Welcome from './pages/Welcome'
import Chat from './pages/Chat'

const App = () => {
  return (
    <Routes>
      <Route path='/welcome' element={<Welcome/>}/>
      <Route path='/' element={<Chat/>}/>
    </Routes>
  )
}

export default App