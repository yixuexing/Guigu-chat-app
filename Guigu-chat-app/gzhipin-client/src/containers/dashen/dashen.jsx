/*大神主界面路由容器组件*/
import React from 'react';
import{connect} from 'react-redux';
import {getUserList} from "../../redux/actions";
import UserList from "../../components/user-list/user-list";

class Dashen extends React.Component{
    componentDidMount(){
        //获取userList
        this.props.getUserList('laoban');
    }
    render(){
        return (
              //<div>laoban列表</div>
            <UserList userList={this.props.userList}/>
        )
    }
}
export default connect(
    state =>({userList:state.userList}),
    {getUserList}
)(Dashen)