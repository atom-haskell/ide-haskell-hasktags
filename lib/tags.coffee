{CompositeDisposable, File, BufferedProcess,
BufferedNodeProcess} = require 'atom'
CP = require 'child_process'
{EOL} = require 'os'
chokidar = require 'chokidar'

module.exports=
class Tags
  constructor: ->
    @disposables = new CompositeDisposable
    @tags = new Map
    @watcher = {}
    @watchDirs(atom.project.getPaths())
    @disposables.add atom.project.onDidChangePaths (dirs) =>
      @watchDirs(dirs)

  destroy: ->
    for dir, w of @watcher
      w.close()
    @disposables.dispose()
    @disposables = null
    @watcher = null
    @tags = null

  watchDirs: (dirs) ->
    # Remove old dirs
    for dir, w of @watcher
      if dirs.indexOf(dir) is -1
        w.close()
        delete @watcher[dir]
    # Watch new dirs
    dirs.forEach (dir) =>
      @watchDir(dir) unless @watcher[dir]?

  watchDir: (dir) ->
    @update dir
    @watcher[dir] = chokidar.watch dir,
      useFsEvents: true
      ignoreInitial: true
      ignored: (f, s) ->
        return false unless s?
        return false if s.mode & 0o0040000
        # console.log f, s
        not (f.endsWith('.hs') or f.endsWith('.lhs') )
    @watcher[dir]
    .on 'add', (path) =>
      @update path
    .on 'change', (path) =>
      @update path
    .on 'unlink', (path) =>
      @tags.delete path

  update: (dir) ->
    @inProgress = true
    fn = false
    curfile = null
    cmd = atom.config.get 'ide-haskell-hasktags.hasktagsPath'
    if cmd is 'hasktags.js'
      {sep} = require 'path'
      cmd = "#{__dirname}#{sep}..#{sep}bin#{sep}hasktags.js"
      BP = BufferedNodeProcess
    else
      BP = BufferedProcess
    hasktagsArgs = ['-eRo-' ]
    if atom.config.get 'ide-haskell-hasktags.ignoreCloseImplementation'
      hasktagsArgs.push '--ignore-close-implementation'
    hasktagsArgs.push dir
    new BP
      command: cmd
      args: hasktagsArgs
      stdout: (data) =>
        if error?
          throw error
        lines = data.split EOL
        for line in lines.slice(0, -1)
          switch
            when line is "\x0c"
              fn = true
            when fn
              fn = false
              [_, src] = /^(.*),\d+$/.exec line
              curfile = new Map
              @tags.set src, curfile
            else
              rxr = /^(.*)\x7f(.*)\x01(\d+),(\d+)$/.exec line
              continue unless rxr?
              [_, context, tagName, line, line1] = rxr
              if not (curfile.has tagName)
                curfile.set tagName, []
              curfile.get(tagName).push {context, line: parseInt(line)}
      exit: =>
        @inProgress = false

  listTags: (uri) ->
    res = []
    unless uri?
      @tags.forEach (tagMap, uri) ->
        tagMap.forEach (lines, tag) ->
          lines.forEach ({context, line}) ->
            res.push {tag, uri, context, line}
    else
      tagMap = @tags.get uri
      if tagMap?
        tagMap.forEach (lines, tag) ->
          lines.forEach ({context, line}) ->
            res.push {tag, uri, context, line}
    return res

  findTag: (tag) ->
    res = []
    @tags.forEach (tagMap, uri) ->
      lines = tagMap.get(tag)
      lines?.forEach? ({context, line}) ->
        res.push {tag, uri, context, line}
    return res
