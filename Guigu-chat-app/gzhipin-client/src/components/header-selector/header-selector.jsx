import React from 'react';
import {List,Grid} from 'antd-mobile';
import PropTypes from "prop-types";
export default class HeaderSelector extends React.Component{
    static propTypes = {
        setHeader: PropTypes.func.isRequired
    };
    state = {
       icon:null //图片对象
    };
    constructor(props){
        super(props);
        //准备头像列表数据
        this.headerList = [];
        for(let i=0;i<20;i++){
           this.headerList.push({
               text: '头像'+(i+1),
               icon: require(`../../assets/images/头像${i+1}.png`)//不能用import
           })
        }
    }
    handleClick = ({text,icon})=>{
        //更新当前组件的状态
        this.setState({icon})
        //更新父组件的状态
        this.props.setHeader(text)
    };
    render(){
        //头部界面
        const {icon} = this.state;
        const listHeader = !icon ? '请选择头像':(
            <div>已选择头像：<img src={icon}/></div>
        );
        return(
                <List renderHeader={()=>listHeader}>
                    <Grid data={this.headerList} columnNum={5} onClick={this.handleClick}/>
                </List>
        )
    }
}