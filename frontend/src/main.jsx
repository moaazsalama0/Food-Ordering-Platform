import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {HeroUIProvider} from '@heroui/react'
import App from './App.jsx'
import { Provider } from "react-redux";
import store from "./redux/store/store";

createRoot(document.getElementById('root')).render(
<HeroUIProvider>
    <Provider store={store}>
      <App />
    </Provider>

  </HeroUIProvider>
   
  
)
