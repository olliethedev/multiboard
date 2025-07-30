import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { DOMParser, Slice } from '@tiptap/pm/model';
import { EditorView } from "@tiptap/pm/view";

export const MarkdownClipboard = Extension.create({
    name: 'customMarkdownClipboard',
    priority: 9999999,
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('customMarkdownClipboard'),
                props: {
                    clipboardTextParser: (text, $context, plain, view) => {
                        try {
                            if (plain) {
                                // Return default parsed slice without markdown transformation
                                return DOMParser.fromSchema(view.state.schema)
                                    .parseSlice(elementFromString(text), {
                                        preserveWhitespace: true,
                                        context: $context,
                                    });
                            }
                            
                            // Parse markdown if available
                            if (this.editor.storage.markdown?.parser) {
                                const parsed = this.editor.storage.markdown.parser.parse(text);
                                return DOMParser.fromSchema(view.state.schema)
                                    .parseSlice(elementFromString(parsed), {
                                        preserveWhitespace: true,
                                        context: $context,
                                    });
                            }
                            
                            // Fallback to plain text parsing
                            return DOMParser.fromSchema(view.state.schema)
                                .parseSlice(elementFromString(text), {
                                    preserveWhitespace: true,
                                    context: $context,
                                });
                        } catch (error) {
                            console.warn('Failed to parse clipboard text:', error);
                            // Fallback to plain text parsing
                            return DOMParser.fromSchema(view.state.schema)
                                .parseSlice(elementFromString(text), {
                                    preserveWhitespace: true,
                                    context: $context,
                                });
                        }
                    },
                    /**
                     * @param {import('prosemirror-model').Slice} slice
                     */
                    clipboardTextSerializer: (slice) => {
                        try {
                            if (this.editor.storage.markdown?.serializer) {
                                return this.editor.storage.markdown.serializer.serialize(slice.content);
                            }
                            // Fallback to plain text
                            return slice.content.textBetween(0, slice.content.size);
                        } catch (error) {
                            console.warn('Failed to serialize clipboard content:', error);
                            // Fallback to plain text
                            return slice.content.textBetween(0, slice.content.size);
                        }
                    },
                },
            })
        ]
    }
})



function elementFromString(value: string) {
    // add a wrapper to preserve leading and trailing whitespace
    const wrappedValue = `<body>${value}</body>`

    return new window.DOMParser().parseFromString(wrappedValue, 'text/html').body
}