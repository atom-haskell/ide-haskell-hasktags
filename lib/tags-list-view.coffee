{BufferedProcess} = require 'atom'
{SelectListView} = require 'atom-space-pen-views'

module.exports=
class TagsListView extends SelectListView
  initialize: (items, inProgress, @onConfirmed) ->
    super
    @panel = atom.workspace.addModalPanel
      item: this
      visible: false
    @addClass 'ide-haskell'
    @show items
    @setLoading 'Update is in progress' if inProgress

  cancelled: ->
    @panel.destroy()

  getFilterKey: ->
    "tag"

  show: (list) ->
    @setItems list
    @panel.show()
    @storeFocusedElement()
    @focusFilterEditor()

  viewForItem: ({tag, uri, line}) ->
    dirs = atom.project.getDirectories()
    if dirs.length is 1
      uri = dirs[0].relativize uri
    """
    <li class='two-lines'>
      <div class='primary-line'>#{tag}</div>
      <div class='secondary-line'>#{uri}: #{line}</div>
    </li>
    """

  confirmed: (tag) ->
    @onConfirmed? tag
    @cancel()
