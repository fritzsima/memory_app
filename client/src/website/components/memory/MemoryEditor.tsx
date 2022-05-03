import Memory from "../../../models/Memory";
import { Form, Button, FormGroup, Checkbox } from "semantic-ui-react";
import { RefObject } from "react";
import React from "react";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import "codemirror/lib/codemirror.css";
import "tui-editor/dist/tui-editor.min.css";
import "tui-editor/dist/tui-editor-contents.min.css";
import "../../css/tui-editor-override.css";
import { Editor } from "@toast-ui/react-editor";
import connectAllProps from "../../../shared/connect";
import fetch from "../../../shared/fetch";
import { getToast as toast } from "../../../shared/toast";
import { DEFAULT_PREFERENCES } from "../../../shared/preferences";
import ResponsiveFormField from "../shared/ResponsiveFormField";
import { isMobile } from "../dimension";
import MemoryCache from "../../../models/client/MemoryCache";
import { NEW_MEMORY_CACHE_ID } from "../../../actions/memory";
import { PrimitiveType } from "intl-messageformat";
import WarningModal from "../shared/WarningModal";
import { ComponentProps } from "../../../shared/ComponentProps";

interface Props extends ComponentProps {
    memory?: Memory;
    submitTextId: string;
    onSubmit: (title: string, content: string, isPrivate: boolean) => void;
    loading?: boolean;
}

interface States {
    editing: boolean;
    openClearEditWarning: boolean;
}

class MemoryEditor extends React.Component<Props, States> {
    private titleRef: RefObject<HTMLInputElement>;
    private contentRef: RefObject<any>;
    private privateRef: RefObject<HTMLInputElement>;

    private originalTitle: string = "";
    private originalContent: string = "";
    private originalPrivate: boolean = false;
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    constructor(props: Props) {
        super(props);
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
        this.privateRef = React.createRef();
        this.getString = this.props.intl.formatMessage;
        this.state = {
            editing: false,
            openClearEditWarning: false
        };
    }
    componentDidMount() {
        this.restoreFromCache();
    }
    render(): React.ReactElement<any> {
        if (this.props.memory) {
            this.originalTitle = this.props.memory.title;
            this.originalContent = this.props.memory.content;
            this.originalPrivate = this.props.memory.isPrivate || false;
        }
        const editorType: string = DEFAULT_PREFERENCES.editorType;
        return (
            <Form>
                <ResponsiveFormField>
                    <label>
                        <FormattedMessage id="memory.title" />
                    </label>
                    <input ref={this.titleRef} autoFocus={true}
                        defaultValue={this.originalTitle}
                        onChange={this.onEditing}/>
                </ResponsiveFormField>
                <ResponsiveFormField>
                    <label>
                        <FormattedMessage id="memory.private" />
                    </label>
                    <input ref={this.privateRef} autoFocus={true}
                        defaultChecked={this.originalPrivate}
                        type="checkbox"
                        onChange={this.onEditing}/>
                </ResponsiveFormField>
                <Form.Field>
                    <label>
                        <FormattedMessage id="memory.content" />
                    </label>
                    <Editor
                        language={this.props.state.translations.locale.replace("-", "_")} // i18n use _ instead of -
                        ref={this.contentRef}
                        initialValue={this.originalContent}
                        placeholder={this.getString({id: "memory.content_placeholder"})}
                        previewStyle={isMobile() ? "tab" : "vertical"}
                        height="54vh"
                        initialEditType={editorType}
                        usageStatistics={false}
                        hideModeSwitch={true}
                        useCommandShortcut={true}
                        toolbarItems={[
                            "image", "link", "table", "divider",
                            "bold", "italic", "strike", "divider",
                            "heading", "hr", "quote", "divider",
                            "ol", "ul", "task", "divider",
                            "indent", "outdent", "divider",
                            "code", "codeblock"
                        ]}
                        events={{
                            change: () => {
                                this.onEditing();
                            }
                        }}
                        hooks={{
                            addImageBlobHook: this.onInsertImage,
                        }} />
                </Form.Field>
                <FormGroup inline>
                    <Form.Field control={Button} onClick={this.onSubmit} primary
                        loading={this.props.loading}
                        disabled={this.props.loading || !this.state.editing}>
                        <FormattedMessage id={this.props.submitTextId} />
                    </Form.Field>
                    <Form.Field control={Button} onClick={() => this.setState({openClearEditWarning: true})}
                        loading={this.props.loading}
                        disabled={this.props.loading || !this.state.editing}>
                        <FormattedMessage id="component.button.clear_edit" />
                    </Form.Field>
                </FormGroup>
                {this.renderClearEditWarningModal()}
            </Form>
        );
    }

    private onSubmit = (): void => {
        const title: any = this.titleRef.current && this.titleRef.current.value;
        const content: any = this.contentRef.current && this.contentRef.current.getInstance().getMarkdown();
        const isPrivate: any = this.privateRef.current && this.privateRef.current.checked;
        console.log(isPrivate);
        this.props.onSubmit(title, content, isPrivate);
    }

    private onInsertImage = (blob: File, callback: (url: string, altText: string) => void): void => {
        fetch("/api/image/upload/memory", blob, "PUT")
        .then((json: any) => {
            if (json && json.url) {
                callback(json.url, blob.name);
            } else {
                toast().error("toast.post.insert_image_failed");
            }
        }, (error: Error) => {
            toast().error("toast.post.insert_image_failed");
        });
    }
    private onEditing = () => {
        if (!this.contentRef.current || !this.titleRef.current || !this.privateRef.current) {
            return;
        }
        const instanceTitle: string = this.titleRef.current.value;
        const instanceContent: string = this.contentRef.current.getInstance().getMarkdown();
        const instancePrivate: boolean = this.privateRef.current?.checked;
        const id: string = this.props.memory ? this.props.memory._id : NEW_MEMORY_CACHE_ID;
        if (this.originalTitle === instanceTitle
            && this.originalContent === instanceContent
            && this.originalPrivate === instancePrivate) {
            this.setState({
                editing: false
            });
            this.props.actions.removeEditCache(id);
        } else {
            this.setState({
                editing: true
            });
            this.props.actions.setEditCache(id, {title: instanceTitle, content: instanceContent, isPrivate: instancePrivate});
        }
    }
    private restoreFromCache = () => {
        if (this.titleRef.current && this.contentRef.current && this.privateRef.current) {
            const cache: {[id: string]: MemoryCache} = this.props.state.memoryState.editCache;
            if (this.props.memory) {
                const id: string = this.props.memory._id;
                if (cache[id]) {
                    this.titleRef.current.value = cache[id].title;
                    this.contentRef.current.getInstance().setMarkdown(cache[id].content);
                    this.privateRef.current.checked = cache[id].isPrivate;
                }
            } else {
                if (cache[NEW_MEMORY_CACHE_ID]) {
                    this.titleRef.current.value = cache[NEW_MEMORY_CACHE_ID].title;
                    this.contentRef.current.getInstance().setMarkdown(cache[NEW_MEMORY_CACHE_ID].content);
                    this.privateRef.current.checked = cache[NEW_MEMORY_CACHE_ID].isPrivate;
                }
            }
        }
    }
    private clearEditing = () => {
        if (this.titleRef.current && this.contentRef.current && this.privateRef.current) {
            if (this.props.memory) {
                this.props.actions.removeEditCache(this.props.memory._id);
            } else {
                this.props.actions.removeEditCache(NEW_MEMORY_CACHE_ID);
            }
            this.titleRef.current.value = this.originalTitle;
            this.contentRef.current.getInstance().setMarkdown(this.originalContent);
            this.privateRef.current.checked = this.originalPrivate;
        }
        this.setState({
            editing: false,
            openClearEditWarning: false
        });
    }
    private renderClearEditWarningModal = (): React.ReactElement<any> | undefined => {
        return <WarningModal
                descriptionIcon="close" open={this.state.openClearEditWarning}
                descriptionText={this.getString({id: "page.memory.clear_edit"})}
                warningText={this.getString({id: "page.memory.clear_edit_confirmation"})}
                onConfirm={this.clearEditing}
                onCancel={ () => {this.setState({openClearEditWarning: false}); }}/>;
    }
}

export default connectAllProps(MemoryEditor);