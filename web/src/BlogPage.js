import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import $ from 'jquery';
import { Alert } from 'reactstrap';
import CodeBlock from './CodeBlock';
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { Link } from "react-router-dom";
import { Button, Input } from 'reactstrap';

function BlogPage(props) {

    const [blog, setBlog] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentPage, setCommentPage] = useState(0);
    const [noMoreComment, setNoMoreComment] = useState(0);

    useEffect(()=>{
        var blogid = props.match.params.bid;
        $.ajax({
            url: process.env.REACT_APP_API_HOST+'api/getblog/'+blogid,
            type: 'GET',
            // data: 'id='+blogid,
            success: function (data) {
                if (data.code === 0) {
                    setBlog(data.msg.blog);
                    // get comment for this blog.
                    $.ajax({
                        url: process.env.REACT_APP_API_HOST+'api/getcomment/'+blogid+'/'+commentPage,
                        type: 'GET',
                        success: function(res) {
                            if (res.code === 0) {
                                if (res.msg.length > 0) {
                                    setComments(res.msg);
                                }
                            } else {
                                console.log(res.msg);
                            }
                        }
                    });
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

      function submitComment(e) {
        $.ajax({
            url: process.env.REACT_APP_API_HOST+'api/sendcomment/',
            type: "POST",
            data: "id="+blog._id+"&comment="+comment,
            success: function(res) {
                if(res.code === 0) {
                    comments.unshift(res.msg);
                    setComment('');
                    // console.log(comments);
                    setComments(comments);
                } else {
                    console.log(res.msg);
                }
            }
        });
      }

      function moreComment(e) {
        
        $.ajax({
            url: process.env.REACT_APP_API_HOST+'api/getcomment/'+blog._id+'/'+(commentPage+1),
            type: 'GET',
            success: function(res) {
                if (res.code === 0) {
                    if (res.msg.length > 0) {
                        console.log('okokoko');
                        res.msg.forEach((value) => {
                            comments.push(value);
                        });
                        setCommentPage(commentPage + 1);
                        setComments(comments);
                        if (res.msg.length<5) {
                            setNoMoreComment(1);
                        }
                    } else {
                        setNoMoreComment(1);
                    }
                } else {
                    console.log(res.msg);
                }
            }
        });
      }

      function inputComment(e) {
        setComment(e.target.value);
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
                <div className="comment">
                    
                    <label htmlFor="comment-input">评论：</label>
                    <Input name="commentForBlog" onChange={(e)=>{inputComment(e)}} value={comment} />
                    <div className="text-right">
                        <Button name="submit-comment" color="primary" onClick={(e)=>{submitComment(e)}}>发布</Button>
                    </div>
                </div>
                <div className="comments">
                    { comments && comments.map((comm)=>
                        <div className="one-comment" key={comm._id.toString()}>
                            {new Date(comm.createAt).toLocaleString() }
                            <p>{comm.comment}</p>
                        </div>
                    )}
                    <Button color="primary" disabled={noMoreComment} onClick={(e)=>{moreComment(e)}}>加载更多...</Button>
                </div>
            </div>
            }
        </div>
    );
}

export default BlogPage;