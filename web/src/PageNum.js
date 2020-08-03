import React from 'react';
import './App.css';

function PageNum() {
  return (
    <nav aria-label="Page navigation example">
        <ul className="pagination">
            <li className="page-item"><a className="page-link" href="#">上一页</a></li>
            <li className="page-item"><a className="page-link" href="#">下一页</a></li>
        </ul>
</nav>
  );
}

export default PageNum;
