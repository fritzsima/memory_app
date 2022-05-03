import React, { Fragment } from "react";
import connectAllProps from "../../../shared/connect";
import { Redirect } from "react-router-dom";
import { pendingRedirect } from "../../../shared/redirect";
import Memory from "../../../models/Memory";
import ErrorPage from "../../pages/ErrorPage";
import { Container, Header, Label, Rating, RatingProps, Popup } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../../shared/styles";
import "react-tiny-fab/dist/styles.css";
import { MessageDescriptor, FormattedMessage } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { Viewer } from "@toast-ui/react-editor";
import WarningModal from "../shared/WarningModal";
import UserLabel from "../user/UserLabel";
import FabAction from "../../../models/client/FabAction";
import moment from "moment";
import { ComponentProps as Props } from "../../../shared/ComponentProps";

interface States {
    openDeleteWarning: boolean;
}

class MemoryDetail extends React.Component<Props, States> {
    private memoryId: string = "";
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.memoryId = this.props.match && this.props.match.params && this.props.match.params.memoryId;
        this.getString = this.props.intl.formatMessage;
        this.state = {
            openDeleteWarning: false
        };
    }
    componentDidMount() {
        if (this.memoryId) {
            this.addFabActions();
        }
        this.props.actions.resetRedirectTask();
        window.scrollTo(0, 0);
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
    render(): React.ReactElement<any> {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        }
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        if (!this.memoryId) {
            return <ErrorPage error={notFoundError} />;
        }
        const memory: Memory | undefined = this.props.state.memoryState.data.find(
            (value: Memory): boolean => value._id === this.memoryId
        );
        if (!memory) {
            return <ErrorPage error={notFoundError} />;
        }
        return (
            <Fragment>
                <div style={{paddingTop: 20}} >
                    <Container text textAlign="center">
                        <Header size={"medium"}>
                            {memory.title}
                        </Header>
                    </Container>
                    <Container text style={CONTAINER_STYLE}>
                        <Viewer initialValue={memory.content} />
                    </Container>
                    { this.renderMetaInfo(memory) }
                </div>
                {
                    this.renderDeleteWarningModal(memory)
                }
            </Fragment>
        );
    }
    private isAuthorOf = (memory: Memory): boolean => {
        return memory.author === (
            this.props.state.userState.currentUser &&
            this.props.state.userState.currentUser._id);
    }
    private addFabActions = (): void => {
        const memory: Memory | undefined = this.props.state.memoryState.data.find(
            (value: Memory): boolean => value._id === this.memoryId
        );
        if (!memory) {
            return;
        }
        if (this.isAuthorOf(memory)) {
            const actions: FabAction[] = [{
                text: this.getString({id: "component.button.delete"}),
                icon: "trash alternate",
                onClick: () => { this.setState({openDeleteWarning: true }); },
            }, {
                text: this.getString({id: "component.button.edit"}),
                icon: "edit",
                onClick: () => {
                    const target: string = this.props.match.url.replace(/^(.+)(\/[0-9a-z]+$)/, "$1/edit$2");
                    this.props.history.push(target, this.props.location.state);
                },
            }];
            this.props.actions.setFabActions(actions);
        }
    }
    private renderDeleteWarningModal = (memory: Memory): React.ReactElement<any> | undefined => {
        return this.isAuthorOf(memory) ?
            <WarningModal
                descriptionIcon="delete" open={this.state.openDeleteWarning}
                descriptionText={this.getString({id: "page.memory.delete"}, {title: memory.title})}
                warningText={this.getString({id: "page.memory.delete_confirmation"})}
                onConfirm={this.removeMemory}
                onCancel={ () => {this.setState({openDeleteWarning: false}); }}/>
                : undefined;
    }
    private renderMetaInfo = (memory: Memory): React.ReactElement<any> => {
        const createDate: Date = memory.createdAt ? new Date(memory.createdAt) : new Date(0);
        const labelStyle: any = {
            color: "grey",
            marginTop: 2,
            marginBottom: 2
        };
        return <Fragment>
            <Container text>
                <UserLabel user={this.props.state.userDictionary[memory.author]} />
                <Label style={labelStyle}>
                    <FormattedMessage id="post.created_at" />
                    {moment(createDate).fromNow()}
                </Label>
            </Container>
        </Fragment>;
    }
    private removeMemory = (): void => {
        this.props.actions.removeMemory(this.memoryId);
    }
}

export default connectAllProps(MemoryDetail);