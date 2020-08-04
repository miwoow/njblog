import React from 'react';
import './App.css';

class PageNum extends React.Component {

    constructor(props) {
        super(props);
        this.pageNum = props.page;
        this.setPageNum = props.setPage;
        console.log(this.pageNum);
        console.log(this.setPageNum);
        // this.pageNum = 1;
    }

    render() {
        return (
            <nav aria-label="...">
                <ul className="pagination">
                    <li className="page-item">
                    <a className="page-link" href="#" tabindex="-1" aria-disabled={this.pageNum==0?true:false}>Previous</a>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">{this.pageNum}</a></li>
                    <li className="page-item active" aria-current="page">
                        <a className="page-link" href="#">2 <span className="sr-only">{this.pageNum+1}</span></a>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">{this.pageNum+2}</a></li>
                    <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default PageNum;
