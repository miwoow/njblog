import React from 'react';
import './App.css';
import PageNum from './PageNum'

class BlogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {blogList:[{'id':1, 'title': 'hello', 'content': 'hello world.'}]};
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div className="BlogList">
            <content>
                {this.state.blogList.map((blog)=>
                    <div className="Blog" key={blog.id.toString()} id={blog.id.toString()}>
                        <h3>{blog.title}</h3>
                        <content>{blog.content}</content>
                    </div>                
                )}
            </content>
            <PageNum />
            </div>
        )
    }
}


// function BlogList(props) {
//     const blogs = props.blogs;
//     const blogList = blogs.map((blog)=>
//         <div className="Blog" key={blog.id.toString()} id={blog.id.toString()}>
//             <h3>{blog.title}</h3>
//             <content>{blog.content}</content>
//         </div>
//     );

//   return (
//     <div className="BlogList">
//       <content>
//         {blogList}
//       </content>
//       <PageNum />
//     </div>
//   );
// }

export default BlogList;
