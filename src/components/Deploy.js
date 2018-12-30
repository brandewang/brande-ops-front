import React, { Component } from 'react'
import { Menu, Icon, List, Divider, Button, Tag, Input } from 'antd'
import axios from 'axios';
import PropTypes from 'prop-types'
// import ButtonGroup from 'antd/lib/button/button-group';


const Search = Input.Search
const SubMenu = Menu.SubMenu;
const ButtonGroup = Button.Group;


class Deploy extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    state = {
        url: 'http://127.0.0.1:8000/api/appgrp/',
        app_url: 'http://127.0.0.1:8000/api/app/',
        filterInfo: {},
        data: [],
        apps: [],
        loading: false,
        teams: [{name:'FruitDay', icon: 'smile'},
                {name:'OMS', icon: 'profile'},
                {name:'TMS', icon: 'car'},
                {name:'SAP', icon: 'database'},
                {name:'PMS', icon: 'bar-chart'},
                {name:'GW', icon: 'ie'}],
        pagination: {
            onChange: (page) => {
                this.setState({pagination: {...this.state.pagination, current: page}})
                const { app_url, group_id } = this.state
                this.fetchApp(app_url, {page: page, group: group_id})}
        },                   
    }

    componentWillMount () {
        const { url, app_url } = this.state
        this.fetch(url, {size:100})
        this.fetchApp(app_url)

    }

    fetch (url, params={}) {
        axios.get(
            url,
            { params: {...params,}},
            ).then((response) => {
                this.setState({
                    data: response.data.results,
                })
            }).catch((err) => {
                console.log(err)
            })
    }

    fetchApp (url, params={}) {
        this.setState({loading: true})
        axios.get(
            url,
            { params: {...params, size:6}},
            ).then((response) => {
                const pagination = this.state.pagination
                pagination.total = response.data.count
                pagination.pageSize = 6
                this.setState({
                    apps: response.data.results,
                    pagination,
                    loading: false
                })
            }).catch((err) => {
                console.log(err)
                this.setState({loading: false})
            })
    }

    handleClick = (e) => {
        const { app_url } = this.state
        if (e.key === 'all'){
            this.fetchApp(app_url)
            this.setState({group_id:''})
        }else{
            this.fetchApp(app_url, {group: e.key})
            this.setState({group_id: e.key})
        }
        this.setState({pagination: {...this.state.pagination, current:1}})
    }

    handleBuild = (item) => {
        // console.log('building' + item)
        // const DeployBuild_url = '/Deploy/' + JSON.stringify(item)
        // console.log(DeployBuild_url)
        // this.props.history.push({pathname: '/Deploy/Build', query: item});
        const DeployBuild_url = '/Deploy/Build/' + item.id
        this.props.history.push(DeployBuild_url)
    }

    handleRelease = (id) => {
        console.log('releaseing'+ id)
    }

    render () {
        // console.log(this.state.apps)
        const { data, teams, apps, app_url } = this.state
        return (
            <div>
                <Divider orientation='left'>
                    <h3>应用发布</h3>
                </Divider>
                <Menu style={{marginBottom:16}} mode="horizontal" onClick={this.handleClick} defaultSelectedKeys={['all']}>
                    <Menu.Item key='all'>All</Menu.Item>
                    {teams.map((team, key) => <SubMenu key={key} title={<span><Icon type={team.icon}/>{team.name}</span>}>
                        {data.filter(el => el.team === team.name).map(item => <Menu.Item key={item.id}><span>{item.name}</span></Menu.Item>)}
                    </SubMenu>)}
                </Menu>
                <Search
                    placeholder="input search text"
                    onSearch={value => this.fetchApp(app_url, {name: value})}
                    style={{ width: 200 }}
                />
                <List
                    loading={this.state.loading}
                    itemLayout="horizontal"
                    pagination={this.state.pagination}
                    dataSource={apps}
                    renderItem={item => (
                        <List.Item 
                            actions={[
                                <ButtonGroup>
                                    <Button icon="setting" onClick={this.handleBuild.bind(this, item)}>构建</Button>
                                    <Button icon="upload" onClick={this.handleRelease.bind(this, item.id)}>发布</Button>
                                </ButtonGroup>
                            ,]}
                        >
                            <List.Item.Meta
                                title={item.name}
                                description={item.giturl}
                            />
                            <div style={{minWidth:200}}>
                                <span>
                                    <Tag color="#108ee9">{item.type}</Tag>
                                    <Tag color="#87d068">{item.build}</Tag>
                                    {item.cover ? <Tag color="magenta">cover</Tag> : null}
                                </span>
                            </div>
                            <div style={{minWidth:200}}>
                                最后发布时间:9:30<br/>
                                发布人: xxx<br/>
                                commit: commit info<br/>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

export default Deploy;