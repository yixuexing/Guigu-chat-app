import React from "react";
import {Switch,Route,Redirect} from 'react-router-dom';
import LaobanInfo from "../laoban-info/laoban-info";
import DashenInfo from "../dashen-info/dashen-info";
import Laoban from "../laoban/laoban";
import Dashen from "../dashen/dashen";
import Message from "../message/message";
import Personal from "../personal/personal";
import NotFound from "../../components/not-found/not-found";
import Chat from '../chat/chat';
import {connect} from 'react-redux';
import Cookies from "js-cookie";//可以操作前端cookie的对象set()get()remove()
import {NavBar} from "antd-mobile";
import {getRedirectTo}  from "../../utils/index";
import {getUser} from '../../redux/actions';
import NavFooter from "../../components/nav-footer/nav-footer";
class Main extends React.Component{
    //给组件对象添加属性
    navList=[//包含所有导航组件的相关信息路由
        {
            path:'/laoban',
            component:Laoban,
            title:'大神列表',
            icon:'dashen',
            text:'大神'
        },
        {
            path:'/dashen',
            component:Dashen,
            title:'老板列表',
            icon:'laoban',
            text:'老板'
        },
        {
            path:'/message',
            component:Message,
            title:'消息列表',
            icon:'message',
            text:'消息'
        },
        {
            path:'/personal',
            component:Personal,
            title:'用户中心',
            icon:'personal',
            text:'个人'
        }
    ];
    componentDidMount(){
        //登陆过(cookie中有userid)还没有登录（redux管理的user中没有_id），发送请求获取对应的user，暂时不做任何显示
        const userid = Cookies.get('userid');
        const {_id} = this.props.user;
        if(userid && !_id){
            //发生异步请求，获取user
            this.props.getUser();
        }
    }
    render(){
        //读取cookie中的userid
        const userid = Cookies.get('userid');
        //如果没有，自动重定向到登录界面
        if(!userid){
            return <Redirect to='/login'/>
        }
        //如果有，读取redux中的user状态
        const {user,unReadCount} = this.props;
        //如果user没有_id，返回null（不作任何显示）
        if(!user._id){
            return null;
        }else{//如果user有_id，显示对应界面
        // 如果请求根路径，根据user的type和header来计算出一个重定向的路由路径，并自动重定向
            let path = this.props.location.pathname;
            if(path==='/')
            {
                path = getRedirectTo(user.type,user.header);
                return <Redirect to={path}/>
            }
        }
        const {navList} = this;
        const path = this.props.location.pathname;//请求的路径
        const currentNav = navList.find(nav => nav.path === path);//得到当前的nav，可能没有
        if(currentNav){
            if(user.type==='laoban'){
                navList[1].hide = true;
            }else{
                navList[0].hide = true;
            }
        }
        return(
            <div>
                {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> :null}
                <Switch>
                    {
                        navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component}/>)
                    }
                    <Route path="/laobaninfo" component={LaobanInfo}/>
                    <Route path="/dasheninfo" component={DashenInfo}/>
                    <Route path="/chat/:userid" component={Chat}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user,unReadCount:state.chat.unReadCount}),
    {getUser}
)(Main);
/*1.实现自动登录：
   1）.登陆过还没有登录（cookie中有userid但浏览器关闭），发送请求获取对应的user，暂时不做任何显示
   2）.如果Cookie中无userid，直接重定向到login界面
   3）.判定redux管理的user中是否有_id，如果没有，暂时不作任何显示
   4）.如果有，说明当前已经登录，显示对应界面
   5）.如果请求根路径：根据user的type和header来计算出一个重定向的路由路径，并自动重定向
*/