import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import AppMgr from './AppMgr'
import AppGrpMgr from './AppGrpMgr'


class AppContent extends Component {
    render () {
        return (
            <div>
                <Switch>
                    <Route path='/App/AppMgr' component={AppMgr}></Route>
                    <Route path='/App/AppGrpMgr' component={AppGrpMgr}></Route>
                    <Redirect to='/App/AppMgr'></Redirect>
                    {/* <Route render={() => <h3>Page Not Found</h3>}></Route> */}
                </Switch>
            </div>
        )
    }
}

export default AppContent;