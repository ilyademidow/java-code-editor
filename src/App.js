import React from 'react';
import AceEditor from "react-ace";
import axios from "axios";
import md5 from "md5";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

// Test
// const SERVER_URL = 'http://localhost:7171/api/v1/';
// Prod
const SERVER_URL = '/api/v1/';
const TMP_SAVE_CODE_INTERVAL = 5000;
const DELAY = 6000;
const DEMO_API_KEY = "demo";

const SERVICE_UNAVLBL_TEXT = "Sorry, service is unavailable. We are fixing it. Please try again later";

class App extends React.Component {
  tmpUsername = "";
  checkResultSchedule = true;
  defVal = 'class Test {\u000a public static void main(String[] args) { \u000a\u000a }\u000a}';

  constructor(props) {
    super(props);
    this.state = {
      tmpUsername: "",
      username: "",
      output: {
        success: "",
        error: ""
      },
      input: this.defVal
    };
    this.saveTmpCodeSchedule();
  }

  regPlus = new RegExp(/\+/g);

  onChange = (newValue) => {
    this.setState({ input: newValue });
  }

  saveTmpCodeSchedule = () => {
    console.log('save tmp ' + this.state.input);
    if ("" !== this.state.username) {
      axios.post(SERVER_URL + 'save_tmp', { "username": this.state.username, "code": this.state.input, "apiKey": DEMO_API_KEY }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .catch(error => {
        if (error.response === undefined) {
          this.checkResultSchedule = false;
        }
      });
    }
    if (this.checkResultSchedule) {
      console.log(this.checkResultSchedule);
      setTimeout(this.saveTmpCodeSchedule, TMP_SAVE_CODE_INTERVAL);
    }
  }

  send = () => {
    this.setState({ output: { success: "compiling...", error: "" }, input: this.state.input });

    axios
      .post(SERVER_URL + 'run', { "username": this.state.username, "code": this.state.input.replace(this.regPlus, "&plus;"), "apiKey": DEMO_API_KEY }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(setTimeout(this.checkResult, DELAY))
      .catch(error => {
        if (error.response !== undefined) {
          this.setState({ output: error.response.data });
        } else {
          this.setState({ output: { sucess: "", error: SERVICE_UNAVLBL_TEXT } });
          this.checkResultSchedule = false;
        }
      });
  }

  checkResult = () => {
    axios
      .get(SERVER_URL + 'get_result/' + md5(this.state.username))
      .then(resp => {
        console.log(resp);
        this.setState({ output: resp.data, input: this.state.input });
      })
      .catch(error => {
        if (error.response !== undefined) {
          this.setState({ output: error.response.data, input: this.state.input });
        } else {
          this.setState({ output: { sucess: "", error: SERVICE_UNAVLBL_TEXT } });
        }
      });
  }

  updateTmpUsername = (event) => {
    this.setState({ tmpUsername: event.target.value });

    console.log(this.state.tmpUsername);
  }

  setUsername = () => {
    this.setState({ username: this.state.tmpUsername });
    console.log(this.state.username);
  }

  // Render editor
  render() {
    if ("" === this.state.username) {
      return (
        <div className="container-fluid">
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <h1><span role="img" aria-label="developer">👨‍💻</span> Welcome to free online OpenJDK 11!</h1>
              <p>We need to know your nickname just to separate your code to others</p>
            </div>
          </div>
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <input type="text" id="username" onChange={this.updateTmpUsername}
                value={this.state.tmpUsername} placeholder="Enter here your nickname" />
            </div>
          </div>
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <button className="btn btn-primary" onClick={this.setUsername}>Confirm and open the editor</button>
            </div>
          </div>
        </div >
      )
    } else {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 wrap-border">
              <small><span role="img" aria-label="atention">⚠️</span> For some circumstances we don't accept code longer than 3096 symbols</small>
              For DB usage please use this parameters <b>Driver</b> <code>org.h2.Driver</code> <b>DB URL</b><code>jdbc:h2:~/test</code>
              <AceEditor
                width="100%"
                mode="java"
                theme="github"
                fontSize="16px"
                wrapEnabled={true}
                defaultValue={this.defVal}
                value={this.state.input}
                onChange={this.onChange}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
              />
              <small>written {this.state.input.length} symbols</small>
            </div>
            <div className="col-md-6 wrap-border">
              Output:<br />
              <pre>
                {this.state.output.success}<br />
                {this.state.output.error}<br />
              </pre>
            </div>
          </div>
          <button className="btn btn-primary" onClick={this.send}>Run my code</button>
        </div>
      );
    }
  }
}

export default App;
