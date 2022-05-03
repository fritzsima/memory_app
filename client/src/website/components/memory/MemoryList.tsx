import React, { Fragment } from "react";
import connectAllProps from "../../../shared/connect";
import Memory from "../../../models/Memory";
import { byCreatedAtLatestFirst } from "../../../shared/date";
import { Container, Segment, Header, Icon, Button } from "semantic-ui-react";
import MemoryItem from "./MemoryItem";
import { CONTAINER_STYLE } from "../../../shared/styles";
import Loading from "./Loading";
import { FormattedMessage } from "react-intl";
import FabAction from "../../../models/client/FabAction";
import NothingMoreFooter from "../shared/NothingMoreFooter";
import { ComponentProps as Props } from "../../../shared/ComponentProps";

interface States {}

class MemoryList extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        return <Container text style={CONTAINER_STYLE}>
            {this.renderCreateMemorySection()}
            {this.renderMemories()}
            {this.renderLoadMore()}
        </Container>;
    }
    componentDidMount() {
        this.props.actions.resetRedirectTask();
        this.addFabActions();
    }
    componentDidUpdate(prevProps: Props) {
        if ((prevProps.state.memoryState.loading
            && !this.props.state.memoryState.loading) ||
            (!prevProps.state.userState.currentUser
            && this.props.state.userState.currentUser)) {
            this.addFabActions();
        }
    }
    componentWillUnmount() {
        this.props.actions.setFabActions([]);
    }
    private renderMemories = (): React.ReactElement<any> => {
        if (this.props.state.memoryState.loading) {
            return <Loading />;
        } else {
            return <Fragment>
            {
                this.props.state.memoryState.data
                .sort(byCreatedAtLatestFirst).map(
                    (memory: Memory) => <MemoryItem key={memory._id} memory={memory} />
                )
            }
            </Fragment>;
        }
    }
    private addFabActions = (): void => {
        if (this.props.state.userState.currentUser) {
            const editUri: string = "/memory/create";
            const actions: FabAction[] = [{
                text: this.props.intl.formatMessage({id: "page.memory.add"}),
                icon: "add",
                onClick: () => { this.props.history.push(editUri); },
            }];
            this.props.actions.setFabActions(actions);
        }
    }
    private renderCreateMemorySection = (): React.ReactElement<any> | undefined => {
        const memories: Memory [] = this.props.state.memoryState.data;
        if (this.props.state.memoryState.loading) {
            return <Loading />;
        } else if (this.props.state.userState.currentUser) {
            if (!memories || memories.length === 0) {
                return <Segment placeholder>
                    <Header icon>
                    <Icon name="edit outline" />
                    <FormattedMessage id="page.memory.empty" />
                    </Header>
                </Segment>;
            }
        } else {
            if (memories && memories.length > 0) {
                return undefined;
            } else {
                return <></>;
            }
        }
    }

    private renderLoadMore = (): React.ReactElement<any> | undefined => {
        const memories: Memory [] = this.props.state.memoryState.data;
        if (this.props.state.memoryState.hasMore) {
            const loadingMore: boolean | undefined = this.props.state.memoryState.loadingMore;
            const createdAt: string | undefined = memories[memories.length - 1].createdAt;
            if (!createdAt) {
                return undefined;
            }
            return <Button fluid basic
                onClick={() => { this.loadMore(createdAt); }}
                loading={loadingMore}
                disabled={loadingMore} >
                <Button.Content>
                    <FormattedMessage id="page.memory.load_more" />
                </Button.Content>
            </Button>;
        } else if (memories.length > 0) {
            return <NothingMoreFooter />;
        } else {
            return undefined;
        }
    }

    private loadMore = (createdAt: string): void => {
        this.props.actions.getMoreMemories(createdAt);
    }
}

export default connectAllProps(MemoryList);