import React, { Component } from 'react';
import { Table } from 'antd';

class MyTable extends Component {
    render () {
        return (
            <div>
                <Table 
                    columns={this.props.columns}
                    rowKey={record => record.id}
                    dataSource={this.props.data}
                    pagination={this.props.pagination}
                    onChange={this.props.handleChange}
                    loading={this.props.loading} 
                />
            </div>
        )
    }
}

export default MyTable