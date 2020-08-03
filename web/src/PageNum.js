import React from 'react';
import './App.css';

function PageNum() {
  return (
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item"><a class="page-link" href="#">上一页</a></li>
            <li class="page-item"><a class="page-link" href="#">下一页</a></li>
        </ul>
</nav>
  );
}

export default PageNum;
