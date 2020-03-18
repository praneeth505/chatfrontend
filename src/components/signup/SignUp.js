import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import './SignUp.css'
class SignUp extends Component {

    constructor(props){
        super(props);

        this.state ={
            email: '',
            nickname: '',
            password: ''
        }
    }

    handleChange = (e) => {
        console.log('handlechange')
        this.setState({
            [e.target.name]: e.target.value
        })
    } 

    handleSubmit = (event) => {
        event.preventDefault();
        const {email, nickname, password} = this.state;

        console.log('handlesubmit')
        let userData = {
            email: email,
            nickname: nickname,
            password: password
        }
        axios.post("http://localhost:5000/userroute/saveuser", {...userData})
            .then(res => {
                console.log(res)
                this.setState({
                    email: '',
                    nickname: '',
                    password: ''
                }, () => {this.props.history.push('/')})
            })
    }

    render() {
        const {email, nickname, password} = this.state;

        return (
            <div className="parent-sign">
                {/* <div className="image">
                <img src={process.env.PUBLIC_URL + '/sign.png'} /> 
                </div> */}
                <form onSubmit={this.handleSubmit} className="form-sign">
                    <div className="formdiv-sign">
                        <div className="child-sign">    
                            <input type="text" placeholder="email" name="email" value={email} onChange={this.handleChange} />
                        </div>
                        <div className="child-sign">
                            <input type="text" placeholder="nickname" name="nickname" value={nickname} onChange={this.handleChange} />
                        </div>
                        <div className="child-sign">
                            <input type="password" placeholder="password" name="password" value={password} onChange={this.handleChange} />
                        </div>
                        <div className="child-sign submit-input">
                            <input className="sign-submit"type="submit"/>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(SignUp)
