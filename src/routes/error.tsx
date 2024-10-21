import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex justify-center align-center" id="error-page">
        <h1 className="text-center">Oops!</h1>
        <p className="text-center">Sorry, an unexpected error has occurred.</p>
        <p className="text-center">
          <i>{error.statusText || error.status}</i>
        </p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    );
  } else {
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>Unknown Error</i>
        </p>
      </div>
    );
  }
};

export default ErrorPage;
