import Memory from "../../../models/Memory";
import React from "react";
import { Segment, Item, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import connectAllProps from "../../../shared/connect";
import { FormattedMessage } from "react-intl";
import { Viewer } from "@toast-ui/react-editor";
import { getMemoryAbstract, getMemoryCoverImage } from "../../../shared/string";
import UserLabel from "../user/UserLabel";
import { Image } from "semantic-ui-react";
import moment from "moment";
import { MEMORY_CONTENT_MIN_LENGTH } from "../../../shared/constants";
import { ComponentProps } from "../../../shared/ComponentProps";

interface Props extends ComponentProps {
    memory: Memory;
}

interface States {}

class MemoryItem extends React.Component<Props, States> {
    render(): React.ReactElement<any> {
        const { memory } = this.props;
        const createDate: Date = memory.createdAt ? new Date(memory.createdAt) : new Date(0);
        const previewContent: string = getMemoryAbstract(memory.content, MEMORY_CONTENT_MIN_LENGTH);
        const coverSrc: string = getMemoryCoverImage(memory.content);
        return <Segment key={createDate.getMilliseconds()}>
            <Item>
                <Item.Content>
                    <Item.Header as="h2">{memory.title}</Item.Header>
                    <Item.Meta>
                        <UserLabel user={this.props.state.userDictionary[memory.author]} />
                    </Item.Meta>
                    {
                        coverSrc ? <Image style={{paddingTop: 10}} src={coverSrc} />
                        : undefined
                    }
                    <Viewer style={{height: 3}} initialValue={previewContent + "..."} />
                    <Item.Extra style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"}}>
                        <div style={{color: "grey"}}>
                            {moment(createDate).fromNow()}
                        </div>
                        {this.renderSeeAllButton(memory)}
                    </Item.Extra>
                </Item.Content>
            </Item>
        </Segment>;
    }
    private renderSeeAllButton = (memory: Memory): React.ReactElement<any> | undefined => {
        const uri: string = `/memory/${memory._id}`;
        return <Button as={Link} to={uri}>
            <FormattedMessage id="component.button.see_all" />
            <Icon name="angle double right"/>
        </Button>;
    }
}

export default connectAllProps(MemoryItem);