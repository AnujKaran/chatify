import "./Error.css";
const Error = (status, data = 'Error') => {
  if (status == 404 ) {
    return (
      <div className="container-Error">
        <h1>404 : page not found :(</h1>
      </div>
    );
  }
  if(status==502){
    return (
      <div className="container-Error">
        <h1>502 : Network fail :(</h1>
        <p>Please check your network connection</p>
      </div>
    );
  }
  if(status==401){
    return (
      <div className="container-Error">
        <h1>401 : Un-authorised :(</h1>
       <p>Cookies not found.</p>
      </div>
    );
  }
  if(status==500){
    return (
      <div className="container-Error">
        <h1>500 : Internal server error :(</h1>
          <p>Try again later.</p>
      </div>
    );
  }
  if(status==400){
    return (
      <div className="container-Error">
        <h1>400 : Something bad happend :(</h1>
          <p>Try again later.</p>
      </div>
    );
  }
};

export default Error;
