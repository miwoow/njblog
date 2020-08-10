import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import $ from 'jquery';
import { Alert } from 'reactstrap';
import CodeBlock from './CodeBlock';
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { Link } from "react-router-dom";

function BlogPage(props) {

    const [blog, setBlog] = useState(null);

    console.log(props.match.params.bid);

    useEffect(()=>{
        var blogid = props.match.params.bid;
        console.log(blogid);
        $.ajax({
            url: process.env.REACT_APP_API_HOST+'api/getblog/'+blogid,
            type: 'GET',
            // data: 'id='+blogid,
            success: function (data) {
                if (data.code === 0) {
                    setBlog(data.msg.blog);
                } else {
                    console.log(data.msg);
                }
            }
        });
    }, []);

    function onLikeClick(e) {
        $.ajax({
            url: process.env.REACT_APP_API_HOST+'api/like',
            type: 'POST',
            data: 'id='+e.target.id,
            success: function (data) {
                if (data.code === 0) {
                    if (blog.like === data.msg.variant.like) {
                        blog.like = blog.like + 1;
                    } else {
                        blog.like = data.msg.value.like;
                    }
                    setBlog(blog);
                } else {
                    blog.error = data.msg;
                    setBlog(blog);
                }
            }
        });
      }

    return (
        <div>
            { blog !== null && 
                <div className="Blog" key={blog._id.toString()} id={blog._id.toString()}>
                <h1>{blog.title}</h1>
                <div className="blog-author">{blog.createAt.substring(0, 10)} by <Link to="/about">xd</Link></div>
                <ReactMarkdown 
                    source={blog.body} 
                    className="blog-markdown-content"
                    renderers={{code: CodeBlock}} />
                <motion.div 
                    whileHover={{y:+2, x:+2}}
                    className="Like">
                    <FontAwesomeIcon id={blog._id} icon={faHeart} fixedWidth size="lg" onClick={onLikeClick}/>&nbsp;{blog.like}
        
                    {/* <FontAwesomeIcon id={blog.id} icon={faCommentAlt} flip="horizontal" fixedWidth size="lg" onClick={onCommentClick}/>Comment */}
                </motion.div>
                { blog.error && 
                    <motion.div 
                        initial={{opacity:1}}
                        animate={{opacity:0}} 
                        onAnimationComplete={()=>{blog.error=''; setBlog(blog);}}
                        transition={{duration:3}}>
                        <Alert variant="danger">{blog.error}</Alert>
                    </motion.div>
                }
            </div>
            }
        </div>
    );
}

export default BlogPage;