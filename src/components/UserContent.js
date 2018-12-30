import React, { Component } from 'react'
import UserHeader from './UserHeader';


class UserContent extends Component {
    render () {
        return (
            <div>
                <UserHeader />
                <h2>UserContent</h2>
            </div>
        )
    }
}

export default UserContent;