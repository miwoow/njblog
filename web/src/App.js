import React from 'react';
import './App.css';
import BlogList from './BlogList';

function App() {
  // const blogs = [{'id':1, 'title': 'hello', 'content':'hello world.'}]
  return (
    <div className="App">
      <header className="App-header">
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
