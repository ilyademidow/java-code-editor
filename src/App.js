import React from 'react';
import { render } from "react-dom";
import AceEditor from "react-ace";
import axios from "axios";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

const SERVER_URL = 'http://localhost:8080/api/v1/';

class App extends React.Component {
  defVal = "class Test {" + '\u000a' + " public static void main(String[] args) {" + '\u000a\u000a' + " }" + '\u000a' + "}";

  constructor(props) {
    super(props);
    this.state = { output: { success: "", error: "" }, input: this.defVal };
    this.saveTmpCodeSchedule();
  }

  regPlus = new RegExp(/\+/g);

  onChange = (newValue) => {
    console.log(newValue);
    this.setState({ input: newValue });
  }

  saveTmpCodeSchedule() {
    console.log('save tmp ' + this.state.input);
    axios.post(SERVER_URL + 'save_tmp', {"code": this.state.input}, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    // setTimeout(this.saveTmpCodeSchedule(), 5000);
  }

  send = () => {
    // axios
    //   .get('https://api.coindesk.com/v1/bpi/currentprice.json')
    //   .then(response => (this.setState(response)))
    //   .catch(resp => console.error(resp));
    this.setState({ output: { success: "compiling...", error: "" }, input: this.state.input });

    axios
      .post(SERVER_URL + 'run', { "code": this.state.input.replace(this.regPlus, "&plus;") }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(resp => {
        console.log(resp);
        this.setState({ output: resp.data, input: this.state.input });
      })
      .catch(resp => {
        console.log(resp);
        this.setState({ output: resp.data, input: this.state.input });
      });
  }

  // Render editor
  render() {
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

export default App;
