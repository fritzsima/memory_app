import React, { Fragment } from "react";
// eslint-disable-next-line
import { Route, Switch, match } from "react-router";
import MemoryDetail from "../components/memory/MemoryDetail";
import MyMemoryList from "../components/memory/MyMemoryList";
import CreateMemory from "../components/memory/CreateMemory";
import EditMemory from "../components/memory/EditMemory";
import connectAllProps from "../../shared/connect";
import { ComponentProps as Props } from "../../shared/ComponentProps";

interface States {}

class MyMemories extends React.Component<Props, States> {
    componentDidMount() {
        if (!this.props.state.memoryState.myValid) {
            this.props.actions.getMyMemories();
        }
    }
    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.memoryState.myValid && !this.props.state.memoryState.myValid) {
            this.props.actions.getMyMemories();
        }

        if ((!prevProps.state.userState.currentUser && this.props.state.userState.currentUser)) {
            this.props.actions.restoreEditCache();
        }
    }
    render(): any {
        const match: match<any> = this.props.match;
        return <Fragment>
            <Switch>
                <Route exact path={match.url} render={(props) => <MyMemoryList {...props} />} />
                <Route path={`${match.url}/create`} render={(props) => <CreateMemory {...props} />} />
                <Route path={`${match.url}/edit/:memoryId`} render={(props) => <EditMemory {...props} />} />
                <Route path={`${match.url}/:memoryId`} render={(props) => <MemoryDetail {...props} />} />
            </Switch>
        </Fragment>;
    }
}

export default connectAllProps(MyMemories);