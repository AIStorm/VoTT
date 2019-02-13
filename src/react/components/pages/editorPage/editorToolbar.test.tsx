import React from "react";
import _ from "lodash";
import { EditorToolbar, IEditorToolbarProps, IEditorToolbarState } from "./editorToolbar";
import MockFactory from "../../../../common/mockFactory";
import { ToolbarItemFactory } from "../../../../providers/toolbar/toolbarItemFactory";
import registerToolbar from "../../../../registerToolbar";
import { ReactWrapper, mount } from "enzyme";
import { Select } from "../../toolbar/select";
import { ZoomIn } from "../../toolbar/zoomIn";
import { ToolbarItem } from "../../toolbar/toolbarItem";
import { KeyboardManager } from "../../common/keyboardManager/keyboardManager";

describe("Editor Toolbar", () => {
    let wrapper: ReactWrapper = null;

    function createComponent(props: IEditorToolbarProps) {
        return (mount(
            <KeyboardManager>
                <EditorToolbar {...props} />
            </KeyboardManager>,
        ));
    }

    function createProps(): IEditorToolbarProps {
        return {
            actions: MockFactory.projectActions(),
            project: MockFactory.createTestProject("TestProject"),
            items: ToolbarItemFactory.getToolbarItems(),
            onToolbarItemSelected: (toolbarItem: ToolbarItem) => null,
        };
    }

    beforeAll(() => {
        registerToolbar();
    });

    beforeEach(() => {
        const props = createProps();
        wrapper = createComponent(props);
    });

    it("Initializes state", () => {
        const state = wrapper.find(EditorToolbar).state() as IEditorToolbarState;
        expect(state.selectedItem).toEqual(Select.prototype);
    });

    it("Renders toolbar items in groups", () => {
        const toolbarGroups = wrapper.find(".btn-group");
        const toolbarRegistry = ToolbarItemFactory.getToolbarItems();
        const groups = _(toolbarRegistry).groupBy("config.group").values().value();

        expect(toolbarGroups.length).toEqual(groups.length);
    });

    it("Renders toolbar items", () => {
        const items = wrapper.find(".toolbar-btn");
        const toolbarRegistry = ToolbarItemFactory.getToolbarItems();
        expect(items.length).toEqual(toolbarRegistry.length);
    });

    it("Sets the selected toolbar item", async () => {
        const zoom = wrapper.find(ZoomIn).first();
        expect(zoom.exists()).toBe(true);
        zoom.find("button").simulate("click");

        const toolbar = wrapper.find(EditorToolbar) as ReactWrapper<IEditorToolbarProps, IEditorToolbarState>;
        expect(toolbar.state().selectedItem).toEqual(ZoomIn.prototype);
    });
});