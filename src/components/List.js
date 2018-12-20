import React, { Component } from 'react';
import { Table } from 'antd';

class List extends Component {
    // state = {
    //     data: [],
    //     pagination: {},
    //     loading: false,
    //     // filteredInfo: null,
    //     // sortedInfo: null,
    //     // list: {}
    // };


    
    // clearFilters = () => {
    //     this.setState({ filteredInfo: null });
    // }

    // clearAll = () => {
    //     this.setState({
    //         filteredInfo: null,
    //         sortedInfo: null,
    //     });
    // }

    // setAgeSort = () => {
    //     this.setState({
    //         sortedInfo: {
    //             order: 'descend',
    //             columnKey: 'age',
    //         },
    //     });
    // }

    // test = () => {
    //     console.log(this.state.list.results[0].name);
    //     console.log(this.state.list.results[1].name);
    // }

    render () {
        return (
            <div>
                {/* <h3>列表</h3> */}
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

export default List