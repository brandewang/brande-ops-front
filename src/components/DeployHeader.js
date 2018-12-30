import React, { Component } from 'react'
import {Breadcrumb} from 'antd'
import { Link } from 'react-router-dom'

class DeployHeader extends Component {
    render () {
        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>
                        <Link to='/Deploy'>
                            应用发布
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
        )
    }
}

export default DeployHeader;