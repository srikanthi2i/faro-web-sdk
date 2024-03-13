import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { faro, globalObject, NavigationType } from '@grafana/faro-react';
import { isInitialized } from '@grafana/faro-react/src/router/v6/routerDependencies';
import type { EventRouteTransitionAttributes } from '@grafana/faro-react/src/router/v6/types';
import { getRouteFromLocation } from '@grafana/faro-react/src/router/v6/utils';
import { EVENT_ROUTE_CHANGE } from '@grafana/faro-web-sdk';

import { GeneralLayout } from '../layouts';
import { About, ArticleAdd, Articles, ArticleView, Features, Home, Login, Register, Seed } from '../pages';
import { LoggedInGuard, LoggedOutGuard } from '../router/guards';

import { AuthWrapper } from './AuthWrapper';

// 3️⃣ Router singleton created

// 4️⃣ RouterProvider added
export function App() {
  if (typeof window !== 'undefined') {
    // const router = createBrowserRouter([{ path: '*', Component: Root }]);
    const browserRouter = createBrowserRouter(
      createRoutesFromElements(
        // <AuthWrapper>
        // <FaroRoutes>
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
        // </FaroRoutes>
        // </AuthWrapper>
      )
    );

    // console.log('router.routes :>> ', router.routes);
    // console.log('router.state :>> ', router.state);
    console.log('browserRouter.state.location :>> ', browserRouter.state.location);

    browserRouter.subscribe((state) => {
      console.log('new state', state);

      const navigationType: NavigationType = state.historyAction as unknown as NavigationType;
      const location = state.location;
      const routes = browserRouter.routes;

      let lastRoute: EventRouteTransitionAttributes = {};

      console.log({
        isInitialized,
        navigationType,
      });

      if ((faro != null && navigationType === NavigationType.Push) || navigationType === NavigationType.Pop) {
        // console.log('faro :>> ', faro);

        console.log('abc');

        const route = getRouteFromLocation(routes, location);

        console.log('route :>> ', route);

        const url = globalObject.location?.href;

        console.log('url :>> ', url);

        const { fromRoute, fromUrl } = lastRoute;

        if (route === fromRoute && url === fromUrl) {
          return;
        }

        faro.api.pushEvent(EVENT_ROUTE_CHANGE, {
          toRoute: route,
          toUrl: globalObject.location?.href,
          ...lastRoute,
        });

        console.log('pushEvent', {
          toRoute: route,
          toUrl: globalObject.location?.href,
          ...lastRoute,
        });

        lastRoute = {
          fromRoute: route,
          fromUrl: url,
        };
      }
    });

    return (
      <AuthWrapper>
        {/* <FaroRoutes>
        </FaroRoutes> */}
        <RouterProvider router={browserRouter!} />
      </AuthWrapper>
    );
  }

  return null;
}
