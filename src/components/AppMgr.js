import React, { Component } from 'react';
import { Button, Modal, Form, Input, Radio, Select, Popconfirm, Divider } from 'antd';
import axios from 'axios'
import qs from 'qs'
import List from '../components/List'



const { Item } = Form
const { Option } = Select

const AppCreateForm = Form.create()(
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onCreate, form, loading, title, appgrp_data
            } = this.props;
            const { getFieldDecorator } = form
            return (
                <Modal  visible={visible} title={title} okText="Submit" onCancel={onCancel} onOk={onCreate} confirmLoading={loading}>
                    <Form layout="vertical">
                        <Item label="项目名" style={{marginBottom: 0}}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input the app_name!' }],
                        })(
                            <Input />
                        )}
                        </Item>
                        <Item label="Git仓库地址" style={{marginBottom: 0}}>
                        {getFieldDecorator('giturl', {
                            rules: [{ required: true, message: 'Please input the app_giturl!' }],
                        })(
                            <Input />
                        )}
                        </Item>
                        <Item label="应用组" style={{marginBottom: 0}}>
                        {getFieldDecorator("group", {
                            initialValue: appgrp_data.length > 0 ? appgrp_data[0].id : '',
                            // initialValue: 1
                        })(
                            <Select>
                                {appgrp_data.map((item) => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                            </Select>
                        )}
                        </Item>
                        <Item label="项目类型" style={{marginBottom: 0}}>
                        {getFieldDecorator("type", {
                            initialValue: 'springboot',
                        })(
                            <Select>
                                <Option value='springboot'>springboot</Option>
                                <Option value='tomcat'>tomcat</Option>
                            </Select>
                        )}
                        </Item>
                        <Item label="构建工具" style={{marginBottom: 0}}>
                        {getFieldDecorator("build", {
                            initialValue: 'mvn',
                        })(
                            <Select>
                                <Option value='mvn'>mvn</Option>
                                <Option value='gradle' disabled>gradle</Option>
                            </Select>
                        )}
                        </Item>
                        <Item label="配置覆盖" style={{marginBottom: 0}}>
                        {getFieldDecorator('cover', {
                            initialValue: 0,
                        })(
                            <Radio.Group>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                            </Radio.Group>
                        )}
                        </Item>
                        <Item label="应用监控" style={{marginBottom: 0}}>
                        {getFieldDecorator('monitor', {
                            initialValue: 0,
                        })(
                            <Radio.Group>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                            </Radio.Group>
                        )}
                        </Item>
                    </Form>
                </Modal>
            )
        }
    }
)


class AppMgr extends Component {
    state = {
        CreateVisible: false,
        CreateLoading: false,
        url: 'http://127.0.0.1:8000/api/app/',
        // url: 'http://127.0.0.1:8000/api/test/',
        data: [],
        appgrp_data: [],
        pagination: {},
        filterInfo: {
            name: '',
            type: '',
        },
        loading: false,
        method: 'post',
        editid: '',
        title: '应用创建'
    }

    componentDidMount () {
        this.fetch();
        this.fetchAppGrp();
    }

    fetch (params = {}) {
        this.setState({
            loading: true,
        })
        axios.get(
            this.state.url,
            { params: {...params,}}
            ).then((response) => {
                const pagination = {...this.state.pagination};
                pagination.total = response.data.count
                pagination.pageSize = 10
                this.setState({
                    loading: false,
                    data: response.data.results,
                    pagination,
                })
            }).catch((err) => {
                console.log(err)
                this.setState({
                    loading: false,
                })
            })
    }

    fetchAppGrp () {
        axios.get(
            'http://127.0.0.1:8000/api/appgrp/?size=100',
        ).then((response) => {
            this.setState({appgrp_data: response.data.results})
        }).catch((err) => {
            console.log(err)
        })
    }

    handleFilterChange = (e) => {
        switch (e.target.name) {
            case 'filter_name':
                this.setState({
                    filterInfo: {
                        ...this.state.filterInfo,
                        name: e.target.value
                    }
                })
                break;
            case 'filter_type':
                this.setState({
                    filterInfo: {
                        ...this.state.filterInfo,
                        type: e.target.value
                    }
                })
                break;
            default:
                break;
        }
    }

    handleSearch = () =>{
        this.fetch(this.state.filterInfo)
        this.setState({pagination: {...this.state.pagination, current:1}})
    }


    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        })
        this.fetch({
            page: pagination.current,
            ...this.state.filterInfo,
        })
    }

    showCreateModal = () => {
        this.setState({
            CreateVisible: true
        })
    }

    handleCreateOk = async() => {
        // console.log(this.state.editid, this.state.method)
        const form = this.formRef.props.form;
        form.validateFields( (err, values) => {
            if (err){
                return;
            }
            values.cover = Number(values.cover);
            values.monitor = Number(values.monitor);
            values.group = Number(values.group);
            this.handleCreateLoading();
            const url = this.state.editid ? this.state.url + this.state.editid + '/': this.state.url
            axios({
                method: this.state.method,
                url: url, 
                data: qs.stringify(values)
            }).then((response) => {
                console.log(response);
                console.log(response.data);
                form.resetFields();
                this.fetch({page: this.state.pagination.current, ...this.state.filterInfo})
                this.handleCreateLoading();
                this.handleCreateCancel();
            }).catch((error) => {
                console.log(error);
                alert('发生错误')
                this.handleCreateLoading();
                // this.handleCreateCancel();
            });
        });
    }

    handleCreateCancel = () => {
        this.setState({
            CreateVisible: false,
        })
        const form = this.formRef.props.form;
        form.resetFields();
        this.setState({
            method: 'post',
            editid: '',
            title: '应用创建'
        })
    }

    handleCreateLoading = () => {
        this.setState({
            CreateLoading: !this.state.CreateLoading
        })
    }

    handleDelete = (key) => {
        const url = this.state.url + key
        axios.delete(
            url
        ).then((response) => {
            console.log(response)
            console.log(response.data)
            this.fetch(this.state.filterInfo)
            this.setState({pagination: {...this.state.pagination, current:1}})
        }).catch((err) => {
            console.log(err)
        })
    }

    handleEdit = async (record) => {
        // console.log(record)
        const form = this.formRef.props.form;
        form.setFieldsValue({
            name : record.name,
            giturl: record.giturl,
            build: record.build,
            cover: record.cover ? 1 : 0,
            monitor: record.monitor ? 1 : 0,
            group: record.group ? record.group : 1, 
        });
        await this.setState({
            method: 'put',
            editid: record.id,
            title: '应用更新'
        })
        this.showCreateModal()
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render () {
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            // sorter: (a, b) => a.name.length - b.name.length,
        },{
            title: 'GitUrl',
            dataIndex: 'giturl'
        },{
            title: 'Type',
            dataIndex: 'type',
            // filters: [
            //     { text: 'Tomcat', value: 'tomcat' },
            //     { text: 'Springboot', value: 'springboot' },
            //   ],
            // filterMultiple: false,
            // onFilter: (value, record) => record.type.includes(value)
        },{
            title: 'Build',
            dataIndex: 'build'
        },{
            title: 'Cover',
            dataIndex: 'cover',
            render: cover => (cover ? 'true' : 'false')
        },{
            title: 'Monitor',
            dataIndex: 'monitor',
            render: monitor => (monitor ? 'true': 'false')
        },{
            title: 'GroupName',
            dataIndex: 'group_name',
        },{
            title: 'Operation',
            render: (text, record) => (
              this.state.data.length >= 1
                ? (
                    <span>
                        <Popconfirm title="Sure to edit?" onConfirm={() => this.handleEdit(record)}>
                            <Button icon='edit'>Edit</Button>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                            <Button type='danger' icon='delete'>Delete</Button>
                        </Popconfirm>
                    </span>
                ) : null
            ),
          }]


        return (
            <div>
                <h3>应用管理</h3>
                <hr></hr>
                <div className='TableButton' style={{marginBottom:16}}>
                    <Button onClick={this.showCreateModal} icon='plus' style={{marginLeft: 8}}>应用新增</Button>
                    <Button onClick={this.handleSearch} icon='search' type="primary" style={{marginLeft: 8}}>应用查询</Button>
                </div>
                <div className="TableInput" style={{marginBottom:16}}>
                    <Input 
                        style={{width: 200, marginLeft: 8}} 
                        name='filter_name'  
                        placeholder="input name" 
                        value={this.state.filterInfo.name} 
                        onChange={this.handleFilterChange}
                        onPressEnter={this.handleSearch}
                    />
                    <Input 
                        style={{width: 200, marginLeft: 8}} 
                        name='filter_type'  
                        placeholder="input type" 
                        value={this.state.filterInfo.type} 
                        onChange={this.handleFilterChange}
                        onPressEnter={this.handleSearch}
                    />
                </div>
                <AppCreateForm 
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.CreateVisible}
                    loading={this.state.CreateLoading} 
                    onCancel={this.handleCreateCancel} 
                    onCreate={this.handleCreateOk}
                    onLoading={this.handleCreateLoading}
                    title={this.state.title} 
                    appgrp_data={this.state.appgrp_data}
                />
                <List 
                    columns={columns} 
                    loading={this.state.loading} 
                    data={this.state.data} 
                    pagination={this.state.pagination}
                    handleChange={this.handleChange}
                />
            </div>
        )
    }
}

export default AppMgr