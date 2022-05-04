import React from "react";
import connectAllProps from "../../../shared/connect";
import { Redirect } from "react-router-dom";
import Memory from "../../../models/Memory";
import ErrorPage from "../../pages/ErrorPage";
import { Container, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../../shared/styles";
import MemoryEditor from "./MemoryEditor";
import { FormattedMessage } from "react-intl";
import { isMobile } from "../dimension";
import { pendingRedirect } from "../../../shared/redirect";
import { ComponentProps as Props } from "../../../shared/ComponentProps";

interface States {}
class EditMemory extends React.Component<Props, States> {
    private memoryId: string = "";
    render(): React.ReactElement<any> {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        }
        const notFoundError: Error = {
            name: "404 Not Found",
            message: `not found for ${window.location.href} `
        };
        this.memoryId = this.props.match && this.props.match.params && this.props.match.params.memoryId;
        if (!this.memoryId) {
            return <ErrorPage error={notFoundError} />;
        }
        const memory: Memory | undefined = this.props.state.memoryState.myData.find(
            (value: Memory): boolean => value._id === this.memoryId
        );
        if (!memory) {
            return <ErrorPage error={notFoundError} />;
        }
        if (this.props.state.userState.currentUser) {
            const containerStyle: any = isMobile() ? CONTAINER_STYLE :
                {...CONTAINER_STYLE, paddingLeft: 20, paddingRight: 20};
            return (
                <Container style={containerStyle}>
                    <Header size={"medium"}>
                        <FormattedMessage id="page.memory.edit" />
                    </Header>
                    <MemoryEditor memory={memory}
                        submitTextId="component.button.update"
                        onSubmit={this.editMemory}
                        loading={this.props.state.memoryState.loading} />
                </Container>
            );
        } else {
            return <Redirect to="/mymemory" />;
        }
    }

    private editMemory = (title: string, content: string, isPrivate: boolean): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.editMemory({
                author: this.props.state.userState.currentUser._id,
                title: title,
                content: content,
                isPrivate: isPrivate,
                _id: this.memoryId
            } as Memory);
        }
    }
}

export default connectAllProps(EditMemory);