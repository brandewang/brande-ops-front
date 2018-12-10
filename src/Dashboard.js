import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import { Layout, Menu, Icon, Row, Col} from 'antd';
import DashboardHeader from './components/DashboardHeader'
import DashboardContent from './components/DashboardContent'
import AppHeader from './components/AppHeader';
import AppContent from './components/AppContent';
import UserHeader from './components/UserHeader';
import UserContent from './components/UserContent';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu




class Dashboard extends Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        })
    };

    render () {
        return (
            <Layout style={{background:'#001529'}}>
                <Sider width={200} trigger={null} collapsible collapsed={this.state.collapsed} style={{height: '100vh'}}>
                    <div className='logo'/>
                    <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
                        <Menu.Item key='1'>
                            <Link to='/'>
                                <Icon type='dashboard'/>
                                <span>仪表盘</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='2'>
                            <Icon type='user'/>
                            <span>用户信息</span>
                        </Menu.Item>
                        <Menu.Item key='3'>
                            <Icon type='deployment-unit'/>
                            <span>应用发布</span>
                        </Menu.Item>
                        <Menu.Item key='4'>
                            <Icon type='fire'/>
                            <span>系统监控</span>
                        </Menu.Item>
                        <Menu.Item key='5'>
                            <Icon type='copy'/>
                            <span>批量处理</span>
                        </Menu.Item>
                        <SubMenu key='sub1' title={<span><Icon type='setting'/><span>系统管理</span></span>}>
                            <Menu.Item key='10'>
                                <Link to='/App'>
                                    <Icon type='hdd'/>
                                    <span>应用管理</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key='11'>
                                <Link to='/User'>
                                    <Icon type='usergroup-add'/>
                                    <span>用户管理</span>
                                </Link>
                            </Menu.Item>  
                            <Menu.Item key='12'>
                                <Icon type='file'/>
                                <span>脚本管理</span>
                            </Menu.Item>   
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background:'#fff'}}>
                        <Row>
                            <Col span={2}>
                                <Icon className='sider-toggle' type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle}/>
                            </Col>
                            <Col span={0} lg={{span:4,offset:10}}>
                                <span>欢迎使用ops系统</span>
                            </Col>
                            <Col span={0} lg={{span:4}}>
                                <span>About</span>
                            </Col>
                            <Col span={4}>
                                <Icon type='logout' />
                                <span>  Log Out</span>
                            </Col>
                        </Row>
                    </Header>
                    <Layout>
                    <Header style={{background:'#f0f2f5'}}>
                            <Route exact path='/' component={DashboardHeader}/>
                            <Route path='/App' component={AppHeader}/>
                            <Route path='/User' component={UserHeader}/>
                    </Header>
                    <Content style={{ margin:'0 10px', padding: 24, background: '#fff', minHeight: 580}}>
                        <Switch>
                            <Route exact path='/' component={DashboardContent}/>
                            <Route path='/App' component={AppContent}/>
                            <Route path='/User' component={UserContent}/>
                            {/* <Route path='/test02/:location' component={test02}/> */}
                            <Redirect to='/' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by Ant UED
                    </Footer>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default Dashboard;