import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import { BrowserRouter, Routes, Route } from 'react-router';

import Home from 'routes/Home';
import Details from 'routes/Details';
import Watch from 'routes/Watch';

import 'index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SWRConfig value={{ revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }}>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path=":type/:id" element={<Details />} />
        <Route path="watch/:id" element={<Watch />} />
      </Routes>
    </BrowserRouter>
  </SWRConfig>,
);
