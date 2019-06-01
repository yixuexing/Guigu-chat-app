/*个人中心主界面路由容器组件*/
import React from 'react';
import{connect} from 'react-redux';
import {Button,Result,List,WhiteSpace,Modal} from 'antd-mobile';
import Cookies from 'js-cookie';
import {resetUser} from '../../redux/actions';
import "../../assets/css/index.less";
const Item = List.Item;
const Brief = Item.Brief;
class Personal extends React.Component {
    logout= ()=>{
       Modal.alert('退出','确认退出登录吗？',[
           {
               text:'取消'},
           {
           text:'确定',
               onPress:()=>{
               //干掉cookie中userid
                   Cookies.remove('userid');
               //干掉redux管理user
                   this.props.resetUser();
               }
           }
       ])
    };
    render(){
        const {username,header,company,post,salary,info} = this.props.user;
        return (
            <div style={{marginBottom:50,marginTop:50}} >
                <Result
                img={<img src={require(`../../assets/images/${header}.png`)} style={{width:50}} alt="header"/>}
                title={username} message={company}/>
                <List renderHeader={()=>'相关信息'}>
                    <Item multipleLine>
                    <Brief>职位:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{post}</Brief>
                        <Brief>简介:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{info}</Brief>
                        {salary ? <Brief>薪资: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{salary}</Brief> : null}
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button type='warning' onClick={this.logout}>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state =>({user:state.user}),
    {resetUser}
)(Personal)