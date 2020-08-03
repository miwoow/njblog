import React from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown'
import $ from 'jquery'
import { Button, Input } from 'reactstrap';

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
                <div className="admin-markdown">
                    <div className="form-group">
                        <label>标题</label>
                        <Input name="blogtitle" onChange={this.handleChange} />
                    </div>
                    <div class="form-group">
                        <label>内容</label>
                        <textarea className="form-control" name="markdowntext" cols="50" rows="10" onChange={this.handleChange}></textarea>
                    </div>
                </div>
                <div className="admin-html">
                    <ReactMarkdown source={this.state.input} />
                </div>
                <Button name="submitbutton" color="primary" onClick={this.handleChange}>发布</Button>
            </div>
        )
    }
}

export default Admin;
