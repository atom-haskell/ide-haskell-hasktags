{CompositeDisposable, Point} = require 'atom'
Tags = require './tags'
TagsListView = require './tags-list-view'

module.exports = IdeHaskellHasktags =
  config:
    hasktagsPath:
      type: "string"
      default: "hasktags"
      description: "Path to hasktags executable"

  showList: (editor, tags) ->
    new TagsListView tags, @tags.inProgress, (tag) =>
      @open(editor, tag)

  open: (editor, tag) ->
    @stack.push
      uri: editor.getURI()
      line: editor.getLastCursor().getBufferRow()
    atom.workspace.open tag.uri,
      initialLine: tag.point.row
      searchAllPanes: true

  activate: (state) ->
    @stack = []
    setTimeout (=> @tags = new Tags), 1000
    @disposables = new CompositeDisposable
    @disposables.add atom.commands.add 'atom-workspace',
      'ide-haskell-hasktags:show-tags': ({target}) =>
        return unless @tags?
        @showList target.getModel(), @tags.listTags()
      'ide-haskell-hasktags:go-back': =>
        if (prevpos = @stack.pop())?
          atom.workspace.open prevpos.uri,
            initialLine: prevpos.line
            searchAllPanes: true
    @disposables.add atom.commands.add 'atom-text-editor',
      'ide-haskell-hasktags:show-file-tags': ({target}) =>
        return unless @tags?
        @showList target.getModel(), @tags.listTags(target.getModel().getURI())
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
      'ide-haskell-hasktags:go-to-declaration': ({target, detail}) =>
        return unless @tags?
        editor = target.getModel()
        buffer = editor.getBuffer()
        upi.withEventRange {editor, detail}, ({crange}) =>
          regex = /[\w'.]+/
          {start, end} = buffer.rangeForRow crange.start.row
          crange2 = {start: crange.start, end: crange.end}
          buffer.backwardsScanInRange regex, [start, crange.start],
            ({range, stop}) ->
              crange2.start = range.start
          buffer.scanInRange regex, [crange.end, end],
            ({range, stop}) ->
              crange2.end = range.end

          symbol = buffer.getTextInRange crange2
          tags = @tags.findTag(symbol)
          switch tags.length
            when 0 then null
            when 1 then @open editor, tags[0]
            else @showList editor, tags

    @upidisp.add atom.contextMenu.add
      'atom-text-editor[data-grammar~="haskell"]': [
          label: 'Go to Declaration'
          command: 'ide-haskell-hasktags:go-to-declaration'
      ]

    @upidisp

  deactivate: ->
    @disposables.dispose()
    @tags.destroy()
