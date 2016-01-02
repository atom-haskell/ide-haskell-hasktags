{CompositeDisposable, Point, File, BufferedProcess} = require 'atom'
CP = require 'child_process'
{EOL} = require 'os'
chokidar = require 'chokidar'

module.exports=
class Tags
  constructor: ->
    @tags = new Map
    atom.project.getPaths().forEach (dir) =>
      @update dir
      @watcher = chokidar.watch dir,
        useFsEvents: true
        ignoreInitial: true
        ignored: (f, s) ->
          return false unless s?
          return false if s.mode & 0o0040000
          # console.log f, s
          not (f.endsWith('.hs') or f.endsWith('.lhs') )
      @watcher
      .on 'add', (path) =>
        @update path
      .on 'change', (path) =>
        @update path
      .on 'unlink', (path) =>
        @tags.delete path

  destroy: ->
    @watcher.close()
    @watcher = null
    @tags = null

  update: (dir) ->
    @inProgress = true
    fn = false
    curfile = null
    new BufferedProcess
      command: atom.config.get 'ide-haskell-hasktags.hasktagsPath'
      args: ['-eRo-', dir]
      stdout: (data) =>
        if error?
          throw error
        lines = data.split EOL
        for line in lines.slice(0,-1)
          switch
            when line is "\x0c"
              fn = true
            when fn
              fn = false
              [_, src] = /^(.*),\d+$/.exec line
              curfile = new Map
              @tags.set src, curfile
            else
              rxr = /^.*\x7f(.*)\x01(\d+),(\d+)$/.exec line
              continue unless rxr?
              [_, tagName, line, col] = rxr
              curfile.set tagName,
                new Point(parseInt(line), parseInt(col))
      exit: =>
        @inProgress = false

  listTags: (uri) ->
    res = []
    unless uri?
      @tags.forEach (tagMap, uri) ->
        tagMap.forEach (point, tag) ->
          res.push {tag, uri, point}
    else
      tagMap = @tags.get uri
      if tagMap?
        tagMap.forEach (point, tag) ->
          res.push {tag, uri, point}
    return res

  findTag: (tag) ->
    res = []
    @tags.forEach (tagMap, uri) ->
      point = tagMap.get(tag)
      if point?
        res.push {tag, uri, point}
    return res
