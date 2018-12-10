import React, { Component } from 'react'

class test02 extends Component {
    render () {
        console.log(this.props)
        return (
            <div>
                <h2>test02</h2>
                <p>测试组件，location参数：{this.props.match.params.location}</p>
            </div>
        )
    }
}

export default test02;