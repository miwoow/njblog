import React from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown'
import $ from 'jquery'

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {input:'', title: ''}
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event.target.name);
        if (event.target.name === 'markdowntext') {
            this.setState({input: event.target.value});
        } else if (event.target.name === 'submitbutton') {
            $.post('http://localhost:3001/api/saveblog/', {'body': this.state.input, 'title': this.state.title}, function(data) {
                console.log(data);
            });
        } else if (event.target.name === 'blogtitle') {
            this.setState({'title': event.target.value});
        }
    }

    render() {
        return (
            <div className="Admin">
                <div className="Admin-markdown">
                    <input name="blogtitle" onChange={this.handleChange} />
                    <textarea name="markdowntext" cols="50" rows="10" onChange={this.handleChange}></textarea>
                </div>
                <div className="Admin-html">
                    <ReactMarkdown source={this.state.input} />
                </div>
                <button name="submitbutton" onClick={this.handleChange}>发布</button>
            </div>
        )
    }
}

export default Admin;
