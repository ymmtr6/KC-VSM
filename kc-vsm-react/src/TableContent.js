import React, { Component } from 'react';

class TableComponent extends Component {
  render() {
    return (
      <ul>{this.props.items.map((item, i) => {
        return <li key={i}>{item}</li>
      })}</ul>
    );
  }
}
export default TableComponent;
