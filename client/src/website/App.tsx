import React, { RefObject, createRef } from "react";
import { Route, Switch } from "react-router-dom";
import NavBarLayout from "./components/NavBarLayout";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import ErrorPage from "./pages/ErrorPage";
import Waiting from "./pages/Waiting";
import Footer from "./components/Footer";
import { WRAPPER_VIEW_STYLE } from "../shared/styles";
import Memories from "./pages/Memories";
import MyMemories from "./pages/MyMemories";
import { ComponentProps as Props } from "../shared/ComponentProps";
import connectAllProps from "../shared/connect";
import { SHOW_UNDER_SCROLL_HEIGHT } from "./components/constants";
import FabAction from "../models/client/FabAction";

interface States {}

class App extends React.Component<Props, States> {
    private contextRef: RefObject<any>;
    readonly scrollUpAction: FabAction = {
        text: this.props.intl.formatMessage({id: "component.button.scroll_up"}),
        icon: "arrow up",
        onClick: () => { window.scrollTo({
                left: 0,
                top: 0,
                behavior: "smooth"
            });
        },
    };
    constructor(props: Props) {
        super(props);
        this.contextRef = createRef();
    }
    render(): React.ReactElement<any> {
        return (
            <div ref={this.contextRef} style={WRAPPER_VIEW_STYLE}>
                <Route render={ (props) =>
                    <NavBarLayout {...props} containerRef={this.contextRef}>
                        <main style={WRAPPER_VIEW_STYLE} >
                            <Switch>
                                <Route exact path="/" render={ (props) => <Home {...props} /> } />
                                <Route path="/login" render={ (props) => <LogIn {...props} /> } />
                                <Route path="/home" render={ (props) => <Memories {...props} /> } />
                                <Route path="/mymemory" render={ (props) => <MyMemories {...props} /> } />
                                <Route path="/waiting" component={Waiting} />
                                {/* add more routes here, the path should keep the same as PostType if necessary */}
                                <Route render={ (props) => <ErrorPage {...props} error={{
                                            name: "404 Not Found",
                                            message: `not found for ${window.location.href} `
                                        }}
                                    />}
                                />
                            </Switch>
                        </main>
                        <Footer />
                    </NavBarLayout>
                } />
            </div>
        );
    }
    componentDidMount() {
        this.handleScroll();
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }
    handleScroll = () => {
        if (window.pageYOffset > SHOW_UNDER_SCROLL_HEIGHT) {
            if (this.props.state.fabActions.findIndex((action: FabAction) => action.icon === "arrow up") < 0) {
                this.props.actions.addFabAction(this.scrollUpAction);
            }
        } else {
            if (this.props.state.fabActions.findIndex((action: FabAction) => action.icon === "arrow up") >= 0) {
                this.props.actions.removeFabAction(this.scrollUpAction.icon);
            }
        }
    }
}

export default connectAllProps(App);