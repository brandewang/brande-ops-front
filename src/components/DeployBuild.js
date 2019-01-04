import React, { Component } from 'react'
import { Divider, Tag, Select, Icon, List, Button, Timeline, Row, Col, Modal, message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import io from 'socket.io-client';



// axios.defaults.headers.common['token'] = 'DKqR6HK-ktaiWUiRM4xF';

const Option = Select.Option

class DeployBuild extends Component {
    state = {
        packing_lock: false,
        app_url: 'http://127.0.0.1:8000/api/app/',
        gitlab_url: 'http://gitlab.corp.fruitday.com/api/v4/projects/',
        get_modules_url: 'http://127.0.0.1:8000/api/gitlab/get_modules/',
        deploy_package_url: 'http://127.0.0.1:8000/api/deploy/deploy_package/',
        deploy_package_delete_url: 'http://127.0.0.1:8000/api/deploy/deploy_package_delete/',
        package_history_url: 'http://127.0.0.1:8000/api/package/',
        package_log_url: 'http://127.0.0.1:8000/data/logs/package/',
        gitlab_token: 'DKqR6HK-ktaiWUiRM4xF',
        git_id: '',
        branch: {},
        branches: [],
        commits: [],
        app_info: {},
        data: [],
        loading: false,
        env: 'test',
        module: '',
        modules: [],
        package_history: [],
        log_visible: false,
        log_content: '',
        log_title: '',
    }
    componentWillMount () {
        const url =  this.state.app_url + this.props.match.params.id
        axios.get(url,
            ).then((response) => {
                // console.log(response.data.packing_lock)
                this.setState({
                    app_info: response.data, 
                    git_id: response.data.git_id, 
                    packing_lock: response.data.packing_lock,
                    module: response.data.name,
                })
                return response.data.git_id
            }).then((git_id) => {
                const { gitlab_token } = this.state
                const url = this.state.gitlab_url + git_id + '/repository/branches/'
                this.fetchBranches(url, gitlab_token)
                const commit_url = this.state.gitlab_url + git_id + '/repository/commits/'
                this.fetchCommits(commit_url, gitlab_token, {ref_name:'master'})
                this.fetchModules(this.state.get_modules_url, {gitlab_id: git_id})
            }).catch((err) => {
                console.log(err)
            })
        this.fetchPackageHistory(this.state.package_history_url, {size:50, app_id: this.props.match.params.id})
    }

    fetchBranches (url, token, params={}) {
        axios.get(url,
            {headers: {'PRIVATE-TOKEN': token},
            params: {...params}},
        ).then((response) => {
            this.setState({
                branches: response.data,
                branch: response.data.filter(el => el.name === 'master')[0]
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    fetchCommits (url, token, params={}) {
        this.setState({loading: true})
        axios.get(url,
            {headers: {'PRIVATE-TOKEN': token},
             params: {...params}},
        ).then((response) => {
            this.setState({
                commits: response.data,
                loading: false,
            })
        }).catch((err) => {
            console.log(err)
            this.setState({loading: false})
        })
    }

    fetchModules (url, params={}) {
        axios.get(url,
            {params: {...params}}
        ).then((response) => {
            // console.log(response)
            this.setState({
                modules: response.data
            })
        })
    }

    fetchPackageHistory (url, params={}) {
        axios.get(url,
            {params: {...params}}
        ).then((response) => {
            // console.log(response.data.results)
            this.setState({
                package_history: response.data.results
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    handleChange = (value) => {
        // console.log(value)
        const { branches, gitlab_url, gitlab_token, git_id } = this.state
        this.setState({
            branch: branches.filter(el => el.name === value)[0]
        })
        const commit_url = gitlab_url + git_id + '/repository/commits/'
        this.fetchCommits(commit_url, gitlab_token, {ref_name: value})
    }

    handleEnvChange = (value) => {
        this.setState({env: value})
    }

    handleModuleChange = (value) => {
        this.setState({module: value})
    }

    // openNotification = (message, description, type, color) => {
    //     notification.open({
    //       message: message,
    //       description: description,
    //       duration: 4,
    //       icon: <Icon type={type} style={{ color: color }} />,
    //     });
    //   };

    handlePacking = (short_id) => {
        // deploy = DeployAct(app_seq, app_id, app_name, module, git_url, short_id, branch, env, type)
        this.setState({packing_lock: true})
        const {app_info, branch, env, deploy_package_url} = this.state
        // console.log(branch)
        axios({
            method: 'post',
            url: deploy_package_url, 
            data: qs.stringify({ 
                app_id: app_info.id, 
                app_name: app_info.name,
                module: this.state.module,
                git_url: app_info.giturl,
                short_id: short_id,
                branch: branch.name,
                env: env,
                type: app_info.type,
            })
        }).then((response) => {
            console.log('packing', response)
            response.data ? message.success('打包成功', 5) : message.error('打包失败', 5)
            // response.data ? this.openNotification('打包成功', '打包成功', 'smile', '#108ee9') : this.openNotification('打包失败', '打包失败', 'frown', '#eb2f96')
            this.setState({packing_lock: false})
            this.fetchPackageHistory(this.state.package_history_url, {size:50, app_id: this.props.match.params.id})
        }).catch((err) => {
            console.log(err)
            message.error('打包失败', 5)
            // this.openNotification('打包失败', '打包失败', 'frown', '#eb2f96')
            this.setState({packing_lock: false})
            this.fetchPackageHistory(this.state.package_history_url, {size:50, app_id: this.props.match.params.id})
        })
        // console.log(short_id, git_id, app_info, branch.name, env, this.state.module)
        // setTimeout(() => this.setState({packing_lock: false}), 5000)
    }

    handleLogShow = (app_name, tag) =>{
        const url = this.state.package_log_url + app_name + '/' + tag + '.log'
        console.log(url)

        axios.get(
            url,
        ).then((response) =>{
            this.setState({
                log_visible: true,
                log_title: tag,
                log_content: response.data.replace(/\n/g,'<br/>')
            })
            console.log(response.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    handleLogCancel = () => {
        this.setState({ log_visible: false });
      }

    handlePackageDelete = (package_id) =>{
        const url = this.state.deploy_package_delete_url
        axios({
            method: 'post',
            url: url,
            data: qs.stringify({package_id: package_id})
        }).then((response) => {
            console.log(response)
            this.fetchPackageHistory(this.state.package_history_url, {size:50, app_id: this.props.match.params.id})
        }).catch((err) => {
            console.log(err)
            this.fetchPackageHistory(this.state.package_history_url, {size:50, app_id: this.props.match.params.id})
        })
    }

    // handleTest = () => {
    //     const socket = io("http://127.0.0.1:8000", {
    //         path: '/api/echo_once/',
    //     });


    //     socket.emit('chat message', 'haha');

    //     socket.on('chat message', msg => {
    //         console.log(msg)
    //     })
    // }

    render () {
        // console.log(this.state.commits)
        const {name, git_id, giturl, type, build, cover} = this.state.app_info
        const { branch, branches, commits, modules } = this.state
        return (
            <div>
                <Icon type='github'/><strong> Gitlab_ID: </strong>{git_id}<span style={{marginLeft:16}}>{giturl}</span><br/>
                <strong>Project_Name: </strong>{name}
                <span style={{marginLeft:16}}>
                    <Tag color="#f50">{branch.name}</Tag>
                    <Tag color="#108ee9">{type}</Tag>
                    <Tag color="#87d068">{build}</Tag>
                    {cover ? <Tag color="magenta">cover</Tag> : null}
                </span><br/>
                <strong>State: </strong> 
                {this.state.packing_lock ? 
                    <span style={{color: '#eb2f96'}}>Packing <Icon type='loading'/></span> :
                    <span style={{color: '#108ee9'}}>Ready <Icon type='smile'/></span> 
                }
                <Divider>Build</Divider>
                <strong>切换分支  </strong>
                <Select defaultValue='master' style={{ width: 200 }} onChange={this.handleChange}>
                    {branches.map((item, index) => <Option key={index} value={item.name}>{item.name}</Option>)}
                </Select>
                <Row gutter={16}>
                <Col span={14}>
                    {branch.commit ? 
                    <div>
                        <strong>Commit: </strong>{branch.commit.short_id}<br/>
                        <strong>Message: </strong>{branch.commit.title}<br/>
                        <strong>提交时间: </strong>{branch.commit.committed_date}<br/>
                        <strong>提交人: </strong>{branch.commit.committer_name}<br/>
                    </div>  : ''}
                </Col>
                <Col span={3}>
                    <strong>环境选择: </strong><br/>
                    <Select style={{ width: 100 }} value={this.state.env} onChange={this.handleEnvChange}>
                        <Option value='product'>生产</Option>
                        <Option value='test'>测试</Option>
                        <Option value='dev'>开发</Option>
                    </Select>
                </Col>
                {this.state.app_info.build === 'mvn' ?
                <Col span={4}>
                    <strong>组件选择: </strong><br/>
                    <Select style={{ width: 200 }} value={this.state.module} onChange={this.handleModuleChange}>
                        <Option value={this.state.app_info.name}>{this.state.app_info.name}</Option>
                        {modules ? modules.map(item => <Option key={item} value={item}>{item}</Option>) : ''}
                        {/* <Option value='other'>其他</Option> */}
                    </Select>
                </Col> : ''}
                </Row>
                {/* <div style={{position:'relative', height:600, overflow:'auto'}}> */}
                <Row gutter={16}>
                <Col span={18}>
                    <List
                        pagination={{pageSize:6, hideOnSinglePage:true}}
                        loading={this.state.loading}
                        itemLayout="horizontal"
                        dataSource={commits}
                        renderItem={item => (
                            <List.Item 
                                actions={[ <Button icon="upload" disabled={this.state.packing_lock} onClick={this.handlePacking.bind(this, item.short_id)}>打包</Button>,]}
                            >
                                <List.Item.Meta
                                    title={item.title}
                                    description={item.committer_name + '  ' + item.committed_date}
                                />
                                <div style={{minWidth:200}}>
                                    <strong>Commit: {item.short_id}</strong>
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={6}>
                <h3>打包历史:</h3>
                <div style={{position:'relative', height:400, overflow:'auto'}}>
                <Timeline>
                    {this.state.package_history.map(item => 
                    <Timeline.Item key={item.id} color={item.status === 'success'  ? 'green' : 'red'}>
                        {item.status} <a onClick={this.handleLogShow.bind(this, name, item.tag)}>{item.tag}</a>
                        <br/>{item.create_time} <Icon onClick={this.handlePackageDelete.bind(this, item.id)} type="close-circle" theme="filled" />
                    </Timeline.Item>)}
                </Timeline>
                </div>
                </Col>
                 </Row>
                 <Modal
                    width={800}
                    visible={this.state.log_visible}
                    onCancel={this.handleLogCancel}
                    title={this.state.log_title}
                    footer=''
                >
                    <div style={{position:'relative', height:500, overflow:'auto'}}>
                        <div dangerouslySetInnerHTML={{__html: this.state.log_content}} />
                    </div>
                </Modal>
                {/* <Button onClick={this.handleTest}>test</Button> */}
                {/* </div> */}
            </div>
        )
    }
}

export default DeployBuild