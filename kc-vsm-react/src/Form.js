import React from 'react';

class Form extends React.Component {

  addIseg() {

  }

  render() {
    return (
      <div>
        <input type="text" ref="newText" />
        <input type="button" value="ADD" onClick={this.addIseg} />
      </div>
    );
  }
}
