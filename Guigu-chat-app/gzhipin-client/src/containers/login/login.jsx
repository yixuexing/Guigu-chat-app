import React from "react";
import Logo from "../../components/logo/logo.jsx";
import {Button,
    NavBar,
    List,
    InputItem,
    WingBlank,
    WhiteSpace,
    Radio} from "antd-mobile";
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {login} from '../../redux/actions';
const ListItem = List.Item;
class Login extends React.Component{
    state={
        username:'',
        password:'',
        type:'laoban'
    };
    handleChange=(name,val)=>{
        this.setState({
            [name]:val
        })
    };
    toRegister=()=>{
        this.props.history.replace('/register')
    };
    login=()=>{
        this.props.login(this.state);
    };
    render(){
        const {type} = this.state;
        const {msg,redirectTo} = this.props.user;
        if(redirectTo){
            return <Redirect to ={redirectTo}/>
        }
        return(
            <div>
                <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
                <Logo/>
                <WingBlank>
                    {msg ? <div className='error-msg'>{msg}</div> : null}
                    <List>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <InputItem type="text" placeholder="请输入用户名" onChange={val =>{this.handleChange("username",val)}}>用户名：</InputItem>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <InputItem type="password" placeholder="请输入密码" onChange={val =>{this.handleChange("password",val)}}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <ListItem>
                            <span>用户类型：</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type==="dashen"} onChange={() => {this.handleChange("type","dashen")}}>大神</Radio>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type==="laoban"} onChange={() => {this.handleChange("type","laoban")}}>老板</Radio>
                        </ListItem>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toRegister}>还没有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {login}
)(Login)