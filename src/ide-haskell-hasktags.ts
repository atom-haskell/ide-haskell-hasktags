import { CompositeDisposable, TextEditor } from 'atom'
import { Tags } from './tags'
import { selectListView } from './tags-list-view'
import { IUPIRegistration } from 'atom-haskell-upi'

export { config } from './config'

export let tagsInstance: Tags
let stack: Array<{
  uri: string
  line: number
  column: number
}>
let disposables: CompositeDisposable
let active = false

async function showList(editor: TextEditor, tags: SymRec[]) {
  const tag = await selectListView(tags, tagsInstance.inProgress)
  if (tag !== undefined) open(editor, tag)
}

function open(editor: TextEditor, tag: SymRec) {
  // editor ?= atom.workspace.getActiveTextEditor()
  const edp = editor.getPath()
  if (edp) {
    stack.push({
      uri: edp,
      line: editor.getLastCursor().getBufferRow(),
      column: editor.getLastCursor().getBufferColumn(),
    })
  }
  void atom.workspace.open(tag.uri, {
    initialLine: tag.line,
    searchAllPanes: true,
  })
}

export function activate() {
  active = true
  stack = []
  tagsInstance = new Tags()
  disposables = new CompositeDisposable()
  disposables.add(
    atom.commands.add('atom-workspace', {
      'ide-haskell-hasktags:show-tags': () => {
        if (!active) return
        const ed = atom.workspace.getActiveTextEditor()
        if (ed) void showList(ed, tagsInstance.listTags())
      },
      'ide-haskell-hasktags:go-back': () => {
        const prevpos = stack.pop()
        if (prevpos) {
          void atom.workspace.open(prevpos.uri, {
            initialLine: prevpos.line,
            initialColumn: prevpos.column,
            searchAllPanes: true,
          })
        }
      },
    }),
  )
  disposables.add(
    atom.commands.add('atom-text-editor', {
      'ide-haskell-hasktags:show-file-tags': ({ currentTarget }) => {
        if (!active) return
        const editor: TextEditor = (currentTarget as any).getModel()
        const path = editor.getPath()
        if (!path) return
        void showList(editor, tagsInstance.listTags(path))
      },
    }),
  )
  disposables.add(
    atom.contextMenu.add({
      'atom-text-editor[data-grammar~="haskell"]': [
        {
          label: 'Show File Tags',
          command: 'ide-haskell-hasktags:show-file-tags',
        },
      ],
    }),
  )
  disposables.add(
    atom.menu.add([
      {
        label: 'Haskell IDE',
        submenu: [
          {
            label: 'Hasktags',
            submenu: [
              {
                label: 'Show Tags',
                command: 'ide-haskell-hasktags:show-tags',
              },
              {
                label: 'Show File Tags',
                command: 'ide-haskell-hasktags:show-file-tags',
              },
            ],
          },
        ],
      },
    ]),
  )
}

export function consumeUPI(register: IUPIRegistration) {
  const upi = register({
    name: 'ide-haskell-hasktags',
  })
  const disp = new CompositeDisposable()
  disposables.add(disp)
  disp.add(upi)

  disp.add(
    atom.commands.add('atom-text-editor', {
      'ide-haskell-hasktags:go-to-declaration': ({ currentTarget, detail }) => {
        if (!active) return
        const editor: TextEditor = (currentTarget as any).getModel()
        const buffer = editor.getBuffer()
        const er = upi.getEventRange(editor, detail)
        if (!er) return
        const { crange } = er
        const { start, end } = buffer.rangeForRow(crange.start.row, false)
        const crange2 = { start: crange.start, end: crange.end }
        const left = buffer.getTextInRange([start, crange.start])
        crange2.start.column = left.search(/[\w']*$/)
        const right = buffer.getTextInRange([crange.end, end])
        crange2.end.column += right.search(/[^\w']|$/)
        const symbol = buffer.getTextInRange(crange2)
        const tags = tagsInstance.findTag(symbol)
        switch (tags.length) {
          case 0:
            return
          case 1:
            void open(editor, tags[0])
            break
          default:
            void showList(editor, tags)
        }
      },
    }),
  )

  disp.add(
    atom.contextMenu.add({
      'atom-text-editor[data-grammar~="haskell"]': [
        {
          label: 'Go to Declaration',
          command: 'ide-haskell-hasktags:go-to-declaration',
        },
      ],
    }),
  )

  return disp
}

export function deactivate() {
  disposables.dispose()
  tagsInstance.destroy()
  active = false
}
