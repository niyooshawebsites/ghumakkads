"use client";

/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NoNgNARAzAdAjPCkQA4UAYCsAmFmDsALAJzr5znFXb6qEGZQ4rnoZIQCmAdkumMDhh+/IaIC6kAGYAjTvin4UEcUA===
 */

import { useMemo } from "react";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";

import "../globals.css";

const LICENSE_KEY = process.env.NEXT_PUBLIC_CK_EDITOR_LICENSE_KEY;

interface CustomEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomEditor({ value, onChange }: CustomEditorProps) {
  const cloud = useCKEditorCloud({ version: "48.2.0" });

  const { ClassicEditor, editorConfig } = useMemo(() => {
    if (cloud.status !== "success") {
      return {};
    }

    const {
      ClassicEditor,
      Autosave,
      Essentials,
      Paragraph,
      Autoformat,
      TextTransformation,
      Link,
      ImageBlock,
      ImageToolbar,
      BlockQuote,
      Bold,
      Table,
      TableToolbar,
      Mention,
      Heading,
      Indent,
      IndentBlock,
      ImageInline,
      Italic,
      List,
      MediaEmbed,
      Underline,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Superscript,
      Subscript,
      Code,
      Strikethrough,
      Highlight,
      HorizontalLine,
      CodeBlock,
      Alignment,
    } = cloud.CKEditor;

    return {
      ClassicEditor,
      editorConfig: {
        root: {
          placeholder: "Type or paste your content here!",
          initialData: "",
        },
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "code",
            "|",
            "horizontalLine",
            "link",
            "mediaEmbed",
            "insertTable",
            "highlight",
            "blockQuote",
            "codeBlock",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Alignment,
          Autoformat,
          Autosave,
          BlockQuote,
          Bold,
          Code,
          CodeBlock,
          Essentials,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          Heading,
          Highlight,
          HorizontalLine,
          ImageBlock,
          ImageInline,
          ImageToolbar,
          Indent,
          IndentBlock,
          Italic,
          Link,
          List,
          MediaEmbed,
          Mention,
          Paragraph,
          Strikethrough,
          Subscript,
          Superscript,
          Table,
          TableToolbar,
          TextTransformation,
          Underline,
        ],
        licenseKey: LICENSE_KEY,
        fontFamily: {
          supportAllValues: true,
        },
        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 22],
          supportAllValues: true,
        },
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            } as const,
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            } as const,
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            } as const,
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            } as const,
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            } as const,
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            } as const,
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            } as const,
          ],
        },
        image: {
          toolbar: [],
        },
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual" as const,
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        mention: {
          feeds: [
            {
              marker: "@",
              feed: [
                /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
              ],
            },
          ],
        },
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
      },
    };
  }, [cloud]);

  return (
    <div className="main-container">
      <div className="editor-container editor-container_classic-editor">
        <div className="editor-container__editor">
          {ClassicEditor && editorConfig && (
            <CKEditor
              editor={ClassicEditor}
              config={editorConfig}
              data={value}
              onChange={(_, editor) => {
                onChange(editor.getData());
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
