import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import { BrowserRouter, Routes, Route, useParams, Outlet } from 'react-router';

import NotFound from 'routes/NotFound';
import Home from 'routes/Home';
import Settings from 'routes/Settings';
import Catalog from 'routes/Catalog';
import Details from 'routes/Details';
import Watch from 'routes/Watch';

import { isTypeValid } from 'lib/helpers';

import 'index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SWRConfig
    value={{
      loadingTimeout: 5000,
      errorRetryCount: 3,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route index element={<Home />} />
        <Route path="settings" element={<Settings />} />
        <Route path=":type" element={<Type />}>
          <Route index element={<Catalog />} />
          <Route path=":id">
            <Route index element={<Details />} />
            <Route path=":episodeId?/watch/:streamId?" element={<Watch />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </SWRConfig>,
);

function Type() {
  const params = useParams();
  return isTypeValid(params.type!) ? <Outlet /> : <NotFound />;
}
