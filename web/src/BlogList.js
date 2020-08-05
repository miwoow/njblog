import React from 'react';
import './App.css';
import PageNum from './PageNum'
import ReactMarkdown from 'react-markdown'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import Pager from './Pager'

class BlogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {blogList:[], PageIndex: 0, PageSize:5, TotalCount:100};
    }

    componentDidMount() {
        $.get(process.env.REACT_APP_API_HOST+'api/getblogs/'+this.state.PageIndex, function(data) {
            // this.state.blogList = data['msg'];
            this.setState({
                blogList: data['msg']['docs'],
                TotalCount: data['msg']['allnum']
            });
        }.bind(this));
    }

    pageIndexChanged(page) {
        this.setState({PageIndex: page});
    }

    render() {
        var pagerSetting={
			totalCount:this.state.TotalCount,
			pageSize:this.state.PageSize,
			pageIndex:this.state.PageIndex,
			firstText:"首页" ,
			prevText:"上一页",
			nextText:"下一页",
			lastText:"尾页",
			recordTextFormat: "{0}/{1}页 共{2}条记录",
			//showLinkNum:2,
			callBack:this.pageIndexChanged
		};
        return (
            <div className="BlogList">
            <content>
                { this.state.blogList && this.state.blogList.map((blog)=>
                    <div className="Blog" key={blog._id.toString()} id={blog._id.toString()}>
                        <h1>{blog.title}</h1>
                        <div className="blog-author">{blog.createAt.substring(0, 10)} by <Link to="/about">xd</Link></div>
                        <ReactMarkdown source={blog.body} />
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
}

export default BlogList;
