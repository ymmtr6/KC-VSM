import React, { Component } from 'react';
import './tailwind.css'
import TableComponent from "./TableContent";
import { Button, TextField } from '@material-ui/core'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iseg: [
        "PUSHI 0",
        "PUSHI 1",
        "ASSIGN",
        "REMOVE",
      ],
      stack: [1, 2, 3, 4, 5],
      memory: [1, 2, 3, 4, 5],
      iseg_cursor: 0,
      isegNewText: ''
    };

    this.slider_settings = {
      dots: true,
      infinitie: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    this.addIseg = this.addIseg.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addIseg(e) {
    e.preventDefault();
    this.state.iseg.push(this.state.isegNewText.trim());
    this.setState({
      iseg: this.state.iseg,
      isegNewText: ''
    });
  }

  // input
  handleChange(e) {
    this.setState({
      isegNewText: e.target.value
    });
  }

  render() {
    return (
      <div className="h-screen">
        <div className="fixed bg-gray-300 w-full text-center pb-1">
          <TextField id="standard-basic" value={this.state.isegNewText} onChange={this.handleChange}
            size="small"></TextField>
          <Button variant="contained" onClick={this.addIseg}>
            Input
          </Button>
          <input accept="*/*" className="hidden" id="contained-button-file" multiple type="file" />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              UPLOAD
            </Button>
          </label>
        </div>
        <div className="pt-10 grid grid-cols-3 gap-1 grid-flow-col h-full">
          <div className="row-start-1 row-span-1 h-full bg-gray-400 text-center overflow-y-scroll">        <TableComponent items={this.state.iseg}></TableComponent>
          </div>
          <div className="row-start-1 row-span-1 bg-gray-500 text-center h-full overflow-y-scroll">
            <TableComponent items={this.state.stack}></TableComponent>
          </div>
          <div className="row-start-1 row-span-1 bg-gray-600 text-center h-full overflow-y-scroll">
            <TableComponent items={this.state.memory}></TableComponent>
          </div>
        </div>
      </div >

    );
  }
}
