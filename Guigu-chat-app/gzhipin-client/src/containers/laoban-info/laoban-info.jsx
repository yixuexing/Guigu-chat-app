/*老板信息完善路由容器组件*/
import React from 'react';
import {connect} from 'react-redux';
import {Button,
         NavBar,
         InputItem,
         WhiteSpace,
         TextareaItem} from 'antd-mobile';
import HeaderSelector from "../../components/header-selector/header-selector";
import {updateUser} from "../../redux/actions";
import {Redirect} from 'react-router-dom';
class LaobanInfo extends React.Component{
    state = {
        header:'',
        post:'',
        info:'',
        company:'',
        salary:''
    };
    //更新header状态
    setHeader = (header) =>{
        this.setState({header})
    };
    handleChange =(name,value)=>{
        this.setState({
            [name]:value
        })
    };
    save = ()=>{
        this.props.updateUser(this.state);
    };
    render(){
        const {header,type} = this.props.user;
        if(header){//说明信息已完善
            const path = type === 'dashen'? "/dashen":"/laoban";
            return <Redirect to={path}/>
        }
        return(
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <WhiteSpace/><WhiteSpace/>
                <InputItem placeholder='请输入职位' onChange={val =>  {this.handleChange('post',val)}}>招聘职位：</InputItem>
                <WhiteSpace/>
                <WhiteSpace/>
                <InputItem placeholder='请输入公司名称' onChange={val => {this.handleChange('company',val)}}>公司名称：</InputItem>
                <WhiteSpace/>
                <WhiteSpace/>
                <InputItem placeholder='请输入职位薪资' onChange={val =>{this.handleChange('salary',val)}}>职位薪资：</InputItem>
                <TextareaItem title='职位要求：' rows={3} placeholder='请输入个人介绍' onChange={val=>{this.handleChange('info',val)}}/>
                <WhiteSpace/>
                <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {updateUser}
)(LaobanInfo);