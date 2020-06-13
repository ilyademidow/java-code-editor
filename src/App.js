import React from 'react';
import { render } from "react-dom";
import AceEditor from "react-ace";
import axios from "axios";
import md5 from "md5";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

const SERVER_URL = 'http://localhost:7171/api/v1/';
const TMP_SAVE_CODE_INTERVAL = 5000;
const DELAY = 3000;

class App extends React.Component {
  tmpUsername = "";
  defVal = "class Test {" + '\u000a' + " public static void main(String[] args) {" + '\u000a\u000a' + " }" + '\u000a' + "}";

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
    if ("" != this.state.username) {
      axios.post(SERVER_URL + 'save_tmp', { "username": this.state.username, "code": this.state.input }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
    setTimeout(this.saveTmpCodeSchedule, TMP_SAVE_CODE_INTERVAL);
  }

  send = () => {
    this.setState({ output: { success: "compiling...", error: "" }, input: this.state.input });

    axios
      .post(SERVER_URL + 'run', { "username": this.state.username, "code": this.state.input.replace(this.regPlus, "&plus;") }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(setTimeout(this.checkResult, DELAY));
  }

  checkResult = () => {
    axios
    .get(SERVER_URL + 'get_result/' + md5(this.state.username))
    .then(resp => {
      console.log(resp);
      this.setState({ output: resp.data, input: this.state.input });
    })
    .catch(resp => {
      console.log(resp);
      this.setState({ output: resp.data, input: this.state.input });
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
          <div className="col-md-6">
            <input type="text" id="username" onChange={this.updateTmpUsername} value={this.state.tmpUsername} />
          </div>
          <div className="col-md-6">
            <button className="btn btn-danger" onClick={this.setUsername}>Confirm and run editor</button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container-fluid">
          <h2>Live code interview</h2>
          <div className="row">
            <div className="col-md-6 wrap-border">
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
            </div>
            <div className="col-md-6 wrap-border">
              Output:<br />
              <pre>
                {this.state.output.success}<br />
                {this.state.output.error}<br />
              </pre>
            </div>
          </div>
          <button className="btn btn-danger" onClick={this.send}>Run my code</button>
        </div>
      );
    }
  }
}

export default App;
