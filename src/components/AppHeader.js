import React, { Component } from 'react'
import {Breadcrumb} from 'antd'
import { Link } from 'react-router-dom'

class AppHeader extends Component {
    render () {
        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>
                        <Link to='/App/AppMgr'>
                            应用管理
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/App/AppGrpMgr'>
                            应用组管理
                        </Link>
                    </Breadcrumb.Item> 
                </Breadcrumb>
            </div>
        )
    }
}

export default AppHeader;