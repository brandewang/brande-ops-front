import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import AppMgr from './AppMgr'
import AppGrpMgr from './AppGrpMgr'
import AppGrpEdit from './AppGrpEdit'
import AppHeader from './AppHeader';



class AppContent extends Component {
    render () {
        return (
            <div>
                <AppHeader />
                <Switch>
                    <Route path='/App/AppMgr' component={AppMgr}></Route>
                    <Route exact path='/App/AppGrpMgr' component={AppGrpMgr}></Route>
                    <Route path='/App/AppGrpMgr/:id' component={AppGrpEdit}></Route>
                    <Redirect to='/App/AppMgr'></Redirect>
                    {/* <Route render={() => <h3>Page Not Found</h3>}></Route> */}
                </Switch>
            </div>
        )
    }
}

export default AppContent;