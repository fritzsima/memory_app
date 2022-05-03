import React from "react";
import { Header, Container } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../../shared/styles";
import { FormattedMessage } from "react-intl";

interface Props {}

interface States {}
export default class About extends React.Component<Props, States> {
    render() {
        return <Container text style={CONTAINER_STYLE}>
            <Header>
                <FormattedMessage id="page.waiting"/>
            </Header>
            <div><FormattedMessage id="page.waiting.description"/></div>
        </Container>;
    }
}