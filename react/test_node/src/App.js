import React from 'react';
import './App.css';
import { BrowserRouter as Router, NavLink, Route, Redirect } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="nav">
          <Redirect from="/" to="login" />
          <NavLink to="/login">登录</NavLink>
          <NavLink to="/register">注册</NavLink>
        </div>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Router>
    </div>
  );
}



class Register extends React.Component {
  render() {
    return (
      <div>
        <div>注册组件</div>
          <button data-index='1' onClick={this.handleClick}>点击</button> 
      </div>
    )
  }
  handleClick = (e) => {
    console.log(this)
    console.log(e.target.dataset)
  }
}

class Login extends React.Component {
  state = {
    params: {}
  }
  componentDidMount() {
    this.getSome()
  }

  getSome = async () => {
    // const { data } = await this.$http.get('home', { params: { a: 1, b: 2 } })
    // // console.log(data)
    // this.setState({ params: data })
  }

  render() {
    const { params } = this.state
    return (
      <div>
        登录组件 params: {params.a}---{params.b}
      </div>
    )
  }
}


export default App;
