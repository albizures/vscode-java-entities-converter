const vscode = require('vscode')
const utils = require('./utils')

const isTextEditorActive = () => vscode.window.activeTextEditor && vscode.window.activeTextEditor.document
const fullRange = doc => doc.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE))

const parserDocRanges = (doc, ranges) => {
  if (!doc) {
    vscode.window.showInformationMessage(
      "Can't get the file information because the editor won't supply it. (File probably too large)")
    throw new Error("Can't get the file information because the editor won't supply it. (File probably too large)")
  }
  return ranges.map(range => utils.utf8ToEntities(doc.getText(range)))
}

const applyEdits = (editor, ranges, edits) => {
  return editor.edit(editorEdit => {
    for (let i = 0; i < ranges.length; i++) {
      editorEdit.replace(ranges[i], edits[i])
    }
  })
}

const formatActiveDocument = ranged => {
  if (!isTextEditorActive()) return
  const active = vscode.window.activeTextEditor

  let ranges = []
  if (ranged && active.selection) {
    ranges = active.selections
      .filter(selection => !selection.isEmpty)
  }
  if (ranges.length === 0) ranges = [fullRange(active.document)]
  if (ranges.length) {
    const edits = parserDocRanges(active.document, ranges)
    applyEdits(vscode.window.activeTextEditor, ranges, edits)
  }

  vscode.window.showInformationMessage('Converted!')
  return Promise.resolve()
}

exports.activate = (context) => context.subscriptions.push(
  vscode.commands.registerCommand('JavaEntities.convertFile', formatActiveDocument),
  vscode.commands.registerCommand('JavaEntities.convertSelection', formatActiveDocument.bind(0, true))
)

exports.deactivate = () => {}
