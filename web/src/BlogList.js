import React from 'react';
import './App.css';
import PageNum from './PageNum'
import ReactMarkdown from 'react-markdown'
import $ from 'jquery'

class BlogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {blogList:[]};
    }

    componentDidMount() {
        $.get('http://localhost:3001/api/getblogs/', function(data) {
            // this.state.blogList = data['msg'];
            this.setState({
                blogList: data['msg']
            });
        }.bind(this));
    }

    render() {
        return (
            <div className="BlogList">
            <content>
                { this.state.blogList && this.state.blogList.map((blog)=>
                    <div className="Blog" key={blog._id.toString()} id={blog._id.toString()}>
                        <h1>{blog.title}</h1>
                        <ReactMarkdown source={blog.body} />
                    </div>                
                )}
            </content>
            <PageNum />
            </div>
        )
    }
}

export default BlogList;
