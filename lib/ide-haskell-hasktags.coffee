{CompositeDisposable} = require 'atom'
Tags = require './tags'
TagsListView = require './tags-list-view'

module.exports = IdeHaskellHasktags =
  config:
    hasktagsPath:
      type: "string"
      default: "hasktags.js"
      description: "Path to hasktags executable; if set to 'hasktags.js'
                    (default) will use bundled ghcjs-powered implementation"

  showList: (editor, tags) ->
    new TagsListView tags, @tags.inProgress, (tag) =>
      @open(editor, tag)

  open: (editor, tag) ->
    editor ?= atom.workspace.getActiveTextEditor()
    @stack.push
      uri: editor.getURI()
      line: editor.getLastCursor().getBufferRow()
    atom.workspace.open tag.uri,
      initialLine: tag.line
      searchAllPanes: true

  activate: (state) ->
    @stack = []
    @tags = new Tags
    @disposables = new CompositeDisposable
    @disposables.add atom.commands.add 'atom-workspace',
      'ide-haskell-hasktags:show-tags': =>
        return unless @tags?
        @showList null, @tags.listTags()
      'ide-haskell-hasktags:go-back': =>
        if (prevpos = @stack.pop())?
          atom.workspace.open prevpos.uri,
            initialLine: prevpos.line
            searchAllPanes: true
    @disposables.add atom.commands.add 'atom-text-editor',
      'ide-haskell-hasktags:show-file-tags': ({currentTarget}) =>
        return unless @tags?
        @showList currentTarget.getModel(), @tags.listTags(currentTarget.getModel().getURI())
    @disposables.add atom.contextMenu.add
      'atom-text-editor[data-grammar~="haskell"]': [
          label: 'Show File Tags'
          command: 'ide-haskell-hasktags:show-file-tags'
      ]
    @disposables.add atom.menu.add [
        label: 'Haskell IDE'
        submenu: [
          label: 'Hasktags'
          submenu: [
              label: 'Show Tags'
              command: 'ide-haskell-hasktags:show-tags'
            ,
              label: 'Show File Tags'
              command: 'ide-haskell-hasktags:show-file-tags'
          ]
        ]
      ]

  consumeUPI: (service) ->
    upi = service.registerPlugin @upidisp = new CompositeDisposable
    @disposables.add @upidisp

    @upidisp.add atom.commands.add 'atom-text-editor',
      'ide-haskell-hasktags:go-to-declaration': ({currentTarget, detail}) =>
        return unless @tags?
        editor = currentTarget.getModel()
        buffer = editor.getBuffer()
        upi.withEventRange {editor, detail}, ({crange}) =>
          {start, end} = buffer.rangeForRow crange.start.row
          crange2 = {start: crange.start, end: crange.end}
          left = buffer.getTextInRange [start, crange.start]
          crange2.start.column = left.search(/[\w']*$/)
          right = buffer.getTextInRange [crange.end, end]
          crange2.end.column += right.search(/[^\w']/)

          symbol = buffer.getTextInRange crange2
          tags = @tags.findTag(symbol)
          switch tags.length
            when 0 then null
            when 1 then @open editor, tags[0]
            else @showList editor, tags

    @upidisp.add atom.contextMenu.add
      'atom-text-editor[data-grammar~="haskell"]': [
          label: 'Goto Declaration'
          command: 'ide-haskell-hasktags:go-to-declaration'
      ]

    @upidisp

  deactivate: ->
    @disposables.dispose()
    @tags.destroy()
