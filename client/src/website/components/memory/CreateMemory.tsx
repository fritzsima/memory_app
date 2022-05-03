import React from "react";
import connectAllProps from "../../../shared/connect";
import { Redirect } from "react-router-dom";
import { Container, Header } from "semantic-ui-react";
import MemoryEditor from "./MemoryEditor";
import { CONTAINER_STYLE } from "../../../shared/styles";
import { FormattedMessage } from "react-intl";
import { isMobile } from "../dimension";
import { pendingRedirect } from "../../../shared/redirect";
import { ComponentProps as Props } from "../../../shared/ComponentProps";

interface States {}
class CreateMemory extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (this.props.state.userState.currentUser) {
            const loading: boolean | undefined = this.props.state.memoryState.loading;
            const containerStyle: any = isMobile() ? CONTAINER_STYLE :
                {...CONTAINER_STYLE, paddingLeft: 20, paddingRight: 20};
            return (
                <Container style={containerStyle}>
                    <Header size={"medium"}>
                        <FormattedMessage id="page.memory.add" />
                    </Header>
                    <MemoryEditor
                        onSubmit={this.createMemory}
                        submitTextId="component.button.submit"
                        loading={loading}/>
                </Container>
            );
        } else {
            return <Redirect to="/memory" />;
        }
    }

    private createMemory = (title: string, content: string, isPrivate: boolean): void => {
        if (this.props.state.userState.currentUser) {
            this.props.actions.addMemory(title, content, isPrivate, this.props.state.userState.currentUser._id);
        }
    }
}

export default connectAllProps(CreateMemory);