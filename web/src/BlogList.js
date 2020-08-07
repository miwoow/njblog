import React, { useState, useEffect } from 'react';
import './App.css';
import $ from 'jquery'
import Pager from './Pager'

import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import CodeBlock from './CodeBlock';
import { motion } from "framer-motion"

function BlogList(props) {

    const [blogs, setBlogs] = useState({
        data: [],
        count: 0
    });
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        $.get(process.env.REACT_APP_API_HOST+'api/getblogs/'+page, function(data) {
            setBlogs({
                data: data['msg']['docs'],
                count: data['msg']['allnum']
            });
        });
    }, [page]);

    function onLikeClick(e) {
        var click_blog_id = e.target.id;
        $.ajax({
            url: process.env.REACT_APP_API_HOST+'api/like',
            type: 'POST',
            data: 'id='+e.target.id,
            success: function (data) {
                if (data.code === 0) {
                    blogs.data.forEach((blog, index)=>{
                        if (blog._id === data.msg.value._id) {
                            if (blog.like === data.msg.value.like) {
                                blog.like = blog.like + 1;
                            } else {
                                blog.like = data.msg.value.like;
                            }
                            setBlogs({data: blogs.data, count: blogs.count});
                            return;
                        }
                    });
                } else {
                    blogs.data.forEach((blog, index)=> {
                        if (blog._id === click_blog_id) {
                            blog.error = data.msg;
                            setBlogs({data: blogs.data, count: blogs.count});
                            return;
                        }
                    });
                }
              
            }
        });
      }

      function pageIndexChanged(index) {
        setPage(index);
        // $.get(process.env.REACT_APP_API_HOST+'api/getblogs/'+page, function(data) {
        //     setBlogs({
        //         data: data['msg']['docs'],
        //         count: data['msg']['allnum']
        //     });
        // });
    }
  
    var pagerSetting={
        totalCount:blogs.count,
        pageSize:pageSize,
        pageIndex:page,
        firstText:"首页" ,
        prevText:"上一页",
        nextText:"下一页",
        lastText:"尾页",
        recordTextFormat: "{0}/{1}页 共{2}条记录",
        //showLinkNum:2,
        callBack:(page) => {setPage(page)}
    };

    

    return (
        <div className="BlogList">
        <content>
            { blogs.data && blogs.data.map((blog)=>
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
                            onAnimationComplete={()=>{blog.error=''; setBlogs({data:blogs.data, allnum: blogs.allnum});}}
                            transition={{duration:3}}>
                            <Alert variant="danger">{blog.error}</Alert>
                        </motion.div>
                    }
                </div>            
            )}
        </content>
        {/* <PageNum page={this.state.pageNum} setPage={this.setPageNum} /> */}
        <div className="panel-body">
            <Pager {...pagerSetting} />
        </div>
        </div>
    )
    
}

export default BlogList;
