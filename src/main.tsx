import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import { BrowserRouter, Routes, Route } from 'react-router';

import Home from 'routes/Home';
import Catalog from 'routes/Catalog';
import Details from 'routes/Details';
import Watch from 'routes/Watch';

import 'index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SWRConfig value={{ revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }}>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path=":type">
          <Route index element={<Catalog />} />
          <Route path=":id">
            <Route index element={<Details />} />
            <Route path=":episodeId?/watch/*" element={<Watch />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </SWRConfig>,
);
