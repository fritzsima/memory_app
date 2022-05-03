import React, { Fragment } from "react";
// eslint-disable-next-line
import { Route, Switch, match } from "react-router";
import MemoryDetail from "../components/memory/MemoryDetail";
import MemoryList from "../components/memory/MemoryList";
import CreateMemory from "../components/memory/CreateMemory";
import EditMemory from "../components/memory/EditMemory";
import connectAllProps from "../../shared/connect";
import { ComponentProps as Props } from "../../shared/ComponentProps";

interface States {}

class Memories extends React.Component<Props, States> {
    componentDidMount() {
        if (!this.props.state.memoryState.valid) {
            this.props.actions.getMemories();
        }
    }
    componentDidUpdate(prevProps: Props) {
        if (prevProps.state.memoryState.valid && !this.props.state.memoryState.valid) {
            this.props.actions.getMemories();
        }

        if ((!prevProps.state.userState.currentUser && this.props.state.userState.currentUser)) {
            this.props.actions.restoreEditCache();
        }
    }
    render(): any {
        const match: match<any> = this.props.match;
        return <Fragment>
            <Switch>
                <Route exact path={match.url} render={(props) => <MemoryList {...props} />} />
                <Route path={`${match.url}/create`} render={(props) => <CreateMemory {...props} />} />
                <Route path={`${match.url}/edit/:memoryId`} render={(props) => <EditMemory {...props} />} />
                <Route path={`${match.url}/:memoryId`} render={(props) => <MemoryDetail {...props} />} />
            </Switch>
        </Fragment>;
    }
}

export default connectAllProps(Memories);