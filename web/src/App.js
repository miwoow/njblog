import React from 'react';
import './App.css';
import BlogList from './BlogList';

function App() {
  // const blogs = [{'id':1, 'title': 'hello', 'content':'hello world.'}]
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-right-menu">
          <div className="App-right-menu-item"><a href="">About</a></div>
          <div className="App-right-menu-item"><a href="">Seed</a></div>
          <div className="App-right-menu-item"><a href="">Login</a></div>
        </div>
        <h1>闲情逸志的博客</h1>
      </header>
      <content>
        {/* <BlogList blogs={blogs}/> */}
        <BlogList />
      </content>
    </div>
  );
}

export default App;
