import React from 'react';
import {
  Link
} from "react-router-dom";

class Notfound extends React.Component {
  // Render
  render() {
    return (
      <div class="container-md">
        <div class="row">
          <div class="col-md-auto">
            <h1>Page not found</h1>
            <br />
            <p><span role="img" aria-label="oops">😯 </span> We are not aware why you reach this address. We never use it... Anyway you 
              can return <Link to="/">Home</Link></p>
          </div>
        </div>
      </div>
    );
  }
}

export default Notfound;
