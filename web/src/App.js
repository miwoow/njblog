import React from 'react';
import './App.css';
import BlogList from './BlogList';
import { Route, Link } from "react-router-dom";
import About from './About';
import Seed from './Seed';
import Admin from './Admin';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-right-menu">
            <div className="App-right-menu-item"><Link to="/about">About</Link></div>
            <div className="App-right-menu-item"><Link to="/seed">Seed</Link></div>
            {/* <div className="App-right-menu-item"><Link to="/admin">Login</Link></div> */}
            <div className="App-right-menu-item"><Link to="/">Home</Link></div>
          </div>
          <h1>闲情逸志的博客</h1>
        </header>
        <div className="app-content">
          {/* <BlogList blogs={blogs}/> */}
          <Route path="/" exact component={BlogList} />
          <Route path="/about" component={About} />
          <Route path="/seed" component={Seed} />
          <Route path="/admin" component={Admin} />
        </div>
        <footer>
          <hr />
          <div>MAIL: <a href="mailto://xdsecret1@gmail.com">xdsecret1@gmail.com</a></div>
          <div><a href="http://www.beian.miit.gov.cn/">京ICP备19053525号-1</a></div>
        </footer>
      </div>
    );
  }
}

export default App;
