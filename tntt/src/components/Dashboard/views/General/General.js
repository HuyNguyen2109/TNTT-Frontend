import React from 'react';

class Temp extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      username: localStorage.getItem('username')
    }
  }

  render = () => {
    return (
      <div>
        <h1>
          Hello, your username is {this.state.username}
        </h1>
      </div>
    )
  }
}

export default Temp