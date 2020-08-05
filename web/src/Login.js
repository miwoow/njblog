import React, {useState} from 'react';
import './App.css';
import $ from 'jquery'
import { useCookies } from 'react-cookie';


function MLogin() {

    const [email, setEmail] = useState('');
    const [passwd, setPasswd] = useState('');
    const [cookies, setCookies] = useCookies('token');
    
    function onLogin(e) {
        $.ajax({
            url: process.env.REACT_APP_API_HOST+'api/login',
                type:'POST',
                data: 'email='+email+'&passwd='+passwd,
                success: function (data) {
                    if (data.code === 0) {
                        console.log(data.msg.token);
                        setCookies('token', data.msg.token);
                        window.location.href='/admin';
                    } else {
                        console.log(data.msg);
                    }
                }.bind(this)
        });
    }

        return (
            <div className="Login">
                <h1>Login</h1>
                
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" onChange={(v) => setEmail(v.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" onChange={(v) => setPasswd(v.target.value)} className="form-control" id="exampleInputPassword1" />
                </div>
                <button type="submit" onClick={onLogin} className="btn btn-primary">Submit</button>
                
            </div>
        )
    
}

export default MLogin;
