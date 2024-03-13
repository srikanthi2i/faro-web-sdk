import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { withFaroRouterInstrumentation } from '@grafana/faro-react';

import { GeneralLayout } from '../layouts';
import { About, ArticleAdd, Articles, ArticleView, Features, Home, Login, Register, Seed } from '../pages';
import { LoggedInGuard, LoggedOutGuard } from '../router/guards';

import { AuthWrapper } from './AuthWrapper';

// 3️⃣ Router singleton created

// 4️⃣ RouterProvider added
export function App() {
  if (typeof window !== 'undefined') {
    const browserRouter = withFaroRouterInstrumentation(
      createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route
              path="/auth"
              element={
                <LoggedOutGuard>
                  <GeneralLayout />
                </LoggedOutGuard>
              }
            >
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>

            <Route
              path="/articles"
              element={
                <LoggedInGuard>
                  <GeneralLayout />
                </LoggedInGuard>
              }
            >
              <Route path="" element={<Articles />} />
              <Route path="add" element={<ArticleAdd />} />
              <Route path="view/:id" element={<ArticleView />} />
            </Route>

            <Route path="*" element={<GeneralLayout />}>
              <Route path="" element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="features" element={<Features />} />
              <Route path="seed" element={<Seed />} />
            </Route>
          </>
        )
      )
    );

    // console.log('router.routes :>> ', router.routes);
    // console.log('router.state :>> ', router.state);
    console.log('browserRouter.state.location :>> ', browserRouter.state.location);

    return (
      <AuthWrapper>
        <RouterProvider router={browserRouter} />
      </AuthWrapper>
    );
  }

  return null;
}
