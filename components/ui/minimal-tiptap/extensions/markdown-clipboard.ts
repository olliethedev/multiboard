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
                                //return this.editor.storage.markdown.serializer.serialize(slice.content);
                                // Get the serialized markdown
                                let markdown = this.editor.storage.markdown.serializer.serialize(slice.content);
                                
                                // Resolve CSS variables in style attributes
                                markdown = resolveCSSVariables(markdown);
                                
                                return markdown;
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

function resolveCSSVariables(html: string): string {
    // Create a temporary element to parse and resolve CSS variables
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Find all elements with style attributes
    const elementsWithStyles = tempDiv.querySelectorAll('[style]');
    
    elementsWithStyles.forEach((element) => {
        const styleAttr = element.getAttribute('style');
        if (!styleAttr) return;
        
        // Check if the style contains CSS variables
        if (styleAttr.includes('var(')) {
            // Apply the styles to a temporary element to get computed values
            const tempElement = document.createElement('div');
            tempElement.style.cssText = styleAttr;
            document.body.appendChild(tempElement);
            
            try {
                const computedStyle = window.getComputedStyle(tempElement);
                let resolvedStyle = '';
                
                // Extract individual CSS properties from the style attribute
                const cssProperties = styleAttr.split(';').filter(prop => prop.trim());
                
                for (const property of cssProperties) {
                    const [key, value] = property.split(':').map(s => s.trim());
                    if (!key || !value) continue;
                    
                    // Get the computed value for this property
                    const computedValue = computedStyle.getPropertyValue(key);
                    
                    if (computedValue && computedValue !== value) {
                        // Use computed value if it's different (i.e., CSS var was resolved)
                        resolvedStyle += `${key}: ${computedValue}; `;
                    } else {
                        // Keep original value if no resolution occurred
                        resolvedStyle += `${key}: ${value}; `;
                    }
                }
                
                // Update the element's style attribute
                element.setAttribute('style', resolvedStyle.trim());
                
            } catch (error) {
                console.warn('Failed to resolve CSS variables for element:', error);
            } finally {
                // Clean up temporary element
                document.body.removeChild(tempElement);
            }
        }
    });
    
    return tempDiv.innerHTML;
}