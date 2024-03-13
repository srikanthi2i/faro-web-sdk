import { StrictMode } from 'react';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';

import { FaroErrorBoundary } from '@grafana/faro-react';

import { App } from './App';
import { initializeFaro } from './faro';
import { createStore } from './store';

initializeFaro();

hydrateRoot(
  document.getElementById('app') as HTMLElement,
  <StrictMode>
    <FaroErrorBoundary>
      <ReduxProvider store={createStore((window as any).__PRELOADED_STATE__)}>
        <HelmetProvider>
          {/* // 2️⃣ `BrowserRouter` component removed, but the <Routes>/<Route>
              // component below are unchanged */}
          {/* <BrowserRouter> */}
          <SSRProvider>
            <App />
          </SSRProvider>
          {/* </BrowserRouter> */}
        </HelmetProvider>
      </ReduxProvider>
    </FaroErrorBoundary>
  </StrictMode>
);
