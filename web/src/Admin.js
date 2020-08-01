import React from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown'
import $ from 'jquery'

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {input:''}
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (event.target.name == 'markdowntext') {
            this.setState({input: event.target.value});
        } else if (event.target.name == 'submitbutton') {
            $.post('/api/saveblog/', {'postcontent': this.state.input}, function(data) {
                
            });
        }
    }

    render() {
        return (
            <div className="Admin">
                <div className="Admin-markdown">
                    <textarea name="markdowntext" cols="50" rows="10" onChange={this.handleChange}></textarea>
                </div>
                <div className="Admin-html">
                    <ReactMarkdown source={this.state.input} />
                </div>
                <button name="submitbutton" onClick={this.onChange}>发布</button>
            </div>
        )
    }
}

export default Admin;
