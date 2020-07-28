import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

class Terms extends React.Component {
  // Render
  render() {
    return (
      <div class="container-md">
        <div class="row">
          <div class="col-md-auto">
            <h2>Terms and Conditions</h2>
            <Link to="/">Back</Link>
            <br />
            <ul>
              <li>We store your IP address, your nickname which you provided at first page, and your code for a litigation in case it appears</li>
              <li>We provide our service "as is" without any warranties</li>
              <li>We restrict an internet access in our code executor to not make any load to another web-sites</li>
              <li>You should not use this web-site if you are not sure 100% about your code execution results</li>
              <li>You are liable for your code execution results</li>
              <li>You are agree to not use this web-site to make any harm any resources</li>
              <li>We are not liable for client code execution results</li>
              <li>We are not liable for client code (words, names, symbols etc)</li>
            </ul>
            <Link to="/">Back</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Terms;
