import React, { Component } from 'react';
import { Button, Modal, Form, Input, Radio, Select, Checkbox } from 'antd';
import axios from 'axios'
import qs from 'qs'



const { Item } = Form
const { Option } = Select

const AppCreateForm = Form.create()(
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onCreate, form, loading
            } = this.props;
            const { getFieldDecorator } = form
            return (
                <Modal visible={visible} title="创建一个新项目" okText="Create" onCancel={onCancel} onOk={onCreate} confirmLoading={loading}>
                    <Form layout="vertical">
                        <Item label="项目名" style={{marginBottom: 0}}>
                        {getFieldDecorator('app_name', {
                            rules: [{ required: true, message: 'Please input the app_name!' }],
                        })(
                            <Input />
                        )}
                        </Item>
                        <Item label="Git仓库地址" style={{marginBottom: 0}}>
                        {getFieldDecorator('app_giturl', {
                            rules: [{ required: true, message: 'Please input the app_giturl!' }],
                        })(
                            <Input />
                        )}
                        </Item>
                        <Item label="项目类型" style={{marginBottom: 0}}>
                        {getFieldDecorator("app_type", {
                            initialValue: 'springboot',
                        })(
                            <Select>
                                <Option value='springboot'>springboot</Option>
                                <Option value='tomcat'>tomcat</Option>
                            </Select>
                        )}
                        </Item>
                        <Item label="构建工具" style={{marginBottom: 0}}>
                        {getFieldDecorator("app_build", {
                            initialValue: 'mvn',
                        })(
                            <Select>
                                <Option value='mvn'>mvn</Option>
                                <Option value='gradle' disabled>gradle</Option>
                            </Select>
                        )}
                        </Item>
                        <Item label="配置覆盖" style={{marginBottom: 0}}>
                        {getFieldDecorator('app_cover', {
                            initialValue: '0',
                        })(
                            <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                            </Radio.Group>
                        )}
                        </Item>
                        <Item label="应用监控" style={{marginBottom: 0}}>
                        {getFieldDecorator('app_monitor', {
                            initialValue: '0',
                        })(
                            <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
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
        CreateLoading: false
    }

    handleCreateLoading = () => {
        this.setState({
            CreateLoading: !this.state.CreateLoading
        })
    }

    showCreateModal = () => {
        this.setState({
            CreateVisible: true
        })
    }

    handleCreateCancel = () => {
        this.setState({
            CreateVisible: false,
        })
    }

    handleCreateOk = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err){
                return;
            }
            values.app_cover = Number(values.app_cover);
            values.app_monitor = Number(values.app_monitor);
            const handleCreateLoading = this.handleCreateLoading;
            handleCreateLoading();
            axios.post(
                'http://127.0.0.1:8080/sysmgr/appMgr/add/', 
                qs.stringify(values)
            ).then(function (response) {
                console.log(response);
                alert(response.data);
                form.resetFields();
                handleCreateLoading();
            }).catch(function (error) {
                console.log(error);
                alert('发生错误')
                handleCreateLoading();
            });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render () {
        return (
            <div>
                <h3>应用管理</h3>
                <hr></hr>
                <Button type='primary' onClick={this.showCreateModal}>应用新增</Button>
                <Button type='primary' >应用查询</Button>
                <AppCreateForm 
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.CreateVisible}
                    loading={this.state.CreateLoading} 
                    onCancel={this.handleCreateCancel} 
                    onCreate={this.handleCreateOk}
                    onLoading={this.handleCreateLoading} 
                />
            </div>
        )
    }
}

export default AppMgr