import React from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown'
import $ from 'jquery'
import { Button, Input } from 'reactstrap';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { Editor } from '@toast-ui/react-editor';

class Admin extends React.Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {input:'', title: ''}
        this.handleChange = this.handleChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.editorRef = React.createRef();
    }

    handleChange(event) {
        if (event.target.name === 'markdowntext') {
            this.setState({input: event.target.value});
        } else if (event.target.name === 'submitbutton') {
            const { cookies } = this.props;
            console.log(cookies);
            $.post(process.env.REACT_APP_API_HOST+'api/saveblog/', 
                {'body': this.state.input, 'title': this.state.title, 'token': cookies.get('token')}, 
                function(data) {
                console.log(data);
            });
        } else if (event.target.name === 'blogtitle') {
            this.setState({'title': event.target.value});
        }
    }

    handleEditorChange(e) {
        var instance = this.editorRef.current.getInstance();
        this.setState({input:instance.getMarkdown()});
    }

    componentDidMount() {
        var instance = this.editorRef.current.getInstance();
        instance.eventManager.removeEventHandler('addImageBlobHook');
        instance.eventManager.listen('addImageBlobHook', (blob, callback) => {
            const formData = new FormData();
            formData.append('img', blob);
            $.ajax({
                url: process.env.REACT_APP_API_HOST+'api/uploadimg/',
                type:'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.code == 0) {
                        console.log(data.msg.img.path);
                        callback(process.env.REACT_APP_API_HOST + data.msg.img.path);
                    }
                }.bind(this)
            });
        });
    }

    render() {
        return (
            <div className="Admin">
                <div className="admin-markdown">
                    <div className="form-group">
                        <label>标题</label>
                        <Input name="blogtitle" onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <label>内容</label>
                        <Editor
                            initialValue="hello world!"
                            previewStyle="vertical"
                            height="600px"
                            initialEditType="markdown"
                            name="markdowntext"
                            useCommandShortcut={true}
                            ref={this.editorRef}
                            onChange={this.handleEditorChange}
                        />
                        
                    </div>
                </div>
                <Button name="submitbutton" color="primary" onClick={this.handleChange}>发布</Button>
            </div>
        )
    }
}

export default withCookies(Admin);
