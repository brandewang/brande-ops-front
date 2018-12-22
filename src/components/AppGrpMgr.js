import React, { Component } from 'react';
import { Button, Modal, Form, Input, Popconfirm, Divider } from 'antd';
import PropTypes from 'prop-types'
import axios from 'axios'
import qs from 'qs'
import List from '../components/List'



const { Item } = Form
// const { Option } = Select


const AppGrpCreateForm = Form.create()(
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onCreate, form, loading, title
            } = this.props;
            const { getFieldDecorator } = form
            return (
                <Modal  visible={visible} title={title} okText="Submit" onCancel={onCancel} onOk={onCreate} confirmLoading={loading}>
                    <Form layout="vertical">
                        <Item label="项目组名" style={{marginBottom: 0}}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input the appgrp_name!' }],
                        })(
                            <Input />
                        )}
                        </Item>
                        <Item label="描述" style={{marginBottom: 0}}>
                        {getFieldDecorator('describe', {
                            rules: [{ required: true, message: 'Please input the describe!' }],
                        })(
                            <Input />
                        )}
                        </Item>
                    </Form>
                </Modal>
            )
        }
    }
)

class AppGrpMgr extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    state = {
        url: 'http://127.0.0.1:8000/api/appgrp/',
        pagination: {},
        loading: false,
        filterInfo: {},
        CreateVisible: false,
        CreateLoading: false,
        title: '应用组创建',
        method: 'post',
        editid: '',
    }

    componentDidMount () {
        this.fetch();
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
                pagination.pageSize = 5
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

    handleSearch = () =>{
        this.fetch(this.state.filterInfo)
        this.setState({pagination: {...this.state.pagination, current:1}})
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
            default:
                break;
        }
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

    showCreateModal = () =>{
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
            title: '应用组创建'
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
            describe : record.describe,
        });
        await this.setState({
            method: 'put',
            editid: record.id,
            title: '应用组更新'
        })
        this.showCreateModal()
    }

    handleEditGrp = (record) => {
        const AppGrpEdit_url = '/App/AppGrpMgr/' + record.id
        this.props.history.push(AppGrpEdit_url);
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render () {
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <a onClick={() => this.handleEdit(record)}>{text}</a>
            )
        },{
            title: 'Describe',
            dataIndex: 'describe'
        },{
            title: 'Apps',
            dataIndex: 'app_name',
            render: (text, record) => (
                this.state.data.length >= 1 
                ? text.map((app,key) =>  <span key={key}>{app.name}<Divider type="vertical" /></span>)
                : null
            ),
        },{
            title: 'Operation',
            render: (text, record) => (
              this.state.data.length >= 1
                ? (
                    <span>
                        <Popconfirm title="Sure to edit?" onConfirm={() => this.handleEditGrp(record)}>
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
                <h3>应用组管理</h3>
                <hr></hr>
                <div className='TableButton' style={{marginBottom:16}}>
                    <Button onClick={this.showCreateModal} icon='plus' style={{marginLeft: 8}}>应用组新增</Button>
                    <Button onClick={this.handleSearch} icon='search' type="primary" style={{marginLeft: 8}}>应用组查询</Button>
                </div>
                <div className="TableInput" style={{marginBottom:16}}>
                    <Input 
                        style={{width: 200, marginLeft: 8}} 
                        name='filter_name'  
                        placeholder="input grpname" 
                        value={this.state.filterInfo.name} 
                        onChange={this.handleFilterChange}
                        onPressEnter={this.handleSearch}
                    />
                </div>
                <AppGrpCreateForm 
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

export default AppGrpMgr