import React, { RefObject } from "react";
import connectAllProps from "../../shared/connect";
import { Redirect, Link } from "react-router-dom";
import _ from "lodash";
import { Form, Button, Icon, Container, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";
import { ComponentProps as Props } from "../../shared/ComponentProps";
import { pendingRedirect } from "../../shared/redirect";

interface States {}
class LogIn extends React.Component<Props, States> {
    emailRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.emailRef = React.createRef();
    }
    componentDidMount() {
        this.props.actions.resetRedirectTask();
    }
    render(): React.ReactElement<any> {
        const message: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string = this.props.intl.formatMessage;
        if (pendingRedirect(this.props)) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>
                    <FormattedMessage id="page.me.login"/>
                </Header>
                <Form>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.email"/>
                        </label>
                        <input placeholder={ message({id: "user.email"}) } ref={this.emailRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10}}>
                        <Button primary type="submit" onClick={ this.login } loading={loading} disabled={loading}>
                            <Icon name="check circle outline" />
                            <FormattedMessage id="component.button.submit"/>
                        </Button>
                    </ResponsiveFormField>
                </Form>
            </Container>);
        } else {
            return <Redirect to="/" />;
        }
    }

    private login = (): void => {
        const email: any = this.emailRef.current && this.emailRef.current.value;
        if (_.isString(email)) {
            this.props.actions.login(email);
        } else {
            // TODO: prompt error
        }
    }
}

export default connectAllProps(LogIn);