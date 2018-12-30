import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Deploy from './Deploy'
import DeployBuild from './DeployBuild'
// import DeployHeader from './DeployHeader'




class AppContent extends Component {
    render () {
        return (
            <div>
                {/* <DeployHeader /> */}
                <Switch>
                    <Route path='/Deploy/List' component={Deploy}></Route>
                    <Route path='/Deploy/Build/:id' component={DeployBuild}></Route>
                    <Redirect to='/Deploy/List'></Redirect>
                </Switch>
            </div>
        )
    }
}

export default AppContent;