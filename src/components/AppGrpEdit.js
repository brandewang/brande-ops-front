import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import { Transfer, Button } from 'antd'
import axios from 'axios';
import qs from 'qs'



class AppGrpEdit extends Component {
    state = {
        appurl: 'http://127.0.0.1:8000/api/app/',
        appgrpurl: 'http://127.0.0.1:8000/api/appgrp/',
        loading: false,
        name: '',
        mockData: [],
        targetKeys: [],
        default_targetKeys: [],
    }

    componentDidMount () {
        this.getMock();
    }

    getMock = () => {
        this.fetchApp(this.state.appurl, {size:1000});
        const appgrpurl = this.state.appgrpurl + this.props.match.params.id + '/'
        // console.log(appgrpurl)
        this.fetchAppGrp(appgrpurl);
    }

    fetchApp (url, params = {}) {
        const mockData = []
        axios.get(
            url,
            { params: {...params,}}
            ).then((response) => {
                response.data.results.forEach(item => {
                    const data = {
                        key: item.id,
                        title: item.type,
                        description: item.name,
                    }
                    mockData.push(data)
                })
                this.setState({
                    loading: false,
                    mockData: mockData,
                })
            }).catch((err) => {
                console.log(err)
                this.setState({
                    loading: false,
                })
            })
    }

    fetchAppGrp (url) {
        const targetKeys = []
        axios.get(
            url,
            ).then((response) => {
                this.setState({
                    name: response.data.name,
                })
                response.data.app_name.forEach((item) => {
                    targetKeys.push(item.id)
                })
                this.setState({
                    loading: false,
                    targetKeys: targetKeys,
                    default_targetKeys: targetKeys,
                })
            }).catch((err) => {
                console.log(err)
                this.setState({
                    loading: false,
                })
            })
    }

    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    }

    renderFooter = () => (
        <Button
          size="small"
          style={{ float: 'right', margin: 5 }}
          onClick={this.getMock}
        >
            reload
        </Button>
    )

    handleUpdate = () => {
        // console.log('ok')
        this.state.targetKeys.forEach(item => {
            const appurl = this.state.appurl + item + '/'
            this._patchAppGroup(appurl, {group: this.props.match.params.id})
            console.log(appurl)
        })
        const {default_targetKeys, targetKeys} = this.state;
        const delTargetKeys = default_targetKeys.filter(el => !targetKeys.includes(el));
        delTargetKeys.forEach(item => {
            const appurl = this.state.appurl + item + '/'
            this._patchAppGroup(appurl, {group: ''})
            console.log(appurl)
        })
    }

    _patchAppGroup = (url, params={}) => {
        axios({
                method: 'patch',
                url: url, 
                data: qs.stringify(params),
            }).then((response) => {
                console.log(response)
                this.setState({
                    loading: false,
                })
            }).catch((err) => {
                console.log(err)
                this.setState({
                    loading: false,
                })
            })
    }

    render () {
        // console.log(this.state.mockData)
        // console.log(this.state.targetKeys)
        if(this.props.match.params.id>100){
            alert('应用组不存在')
            return (<Redirect to="/App/AppGrpMgr" />);
        }else{
        return (
            <div>
                <h3>编辑应用组</h3>
                <hr></hr>
                {/* <p>{this.props.match.params.id}</p> */}
                <h4>应用组:{this.state.name}</h4>
                <Transfer
                    dataSource={this.state.mockData}
                    showSearch
                    listStyle={{width: 250, height: 300,}}
                    targetKeys={this.state.targetKeys}
                    render={item => `${item.description}(${item.title})`} 
                    onChange={this.handleChange}
                    footer={this.renderFooter}
                    style={{marginBottom:16}}
                />
                <Link to="/App/AppGrpMgr/"><Button>Cancel</Button></Link>
                <Button type="primary" style={{marginLeft:16}} onClick={this.handleUpdate}>Update</Button>
            </div>
        )}
    }
}

export default AppGrpEdit;