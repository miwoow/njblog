import React from 'react';
import './App.css';

class Seed extends React.Component {

    render() {
        return (
            <div className="Seed">
                <h1>Seed</h1>
                <p><a href={process.env.REACT_APP_API_HOST+"api/rss"}>{process.env.REACT_APP_API_HOST}api/rss</a></p>
            </div>
        )
    }
}

export default Seed;
