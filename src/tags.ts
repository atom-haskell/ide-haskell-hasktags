import { CompositeDisposable, FilesystemChangeEvent } from 'atom'
import { EOL } from 'os'
import { sep } from 'path'
import { execFile } from 'child_process'
import { IgnoredNames } from './ignored'

interface LineRec {
  context: string
  line: number
}

type FileRec = Map<string, LineRec[]>
type Rec = Map<string, FileRec>

export class Tags {
  public inProgress: boolean = false
  private disposables = new CompositeDisposable()
  private tags: Rec = new Map()
  private paths = atom.project.getPaths()
  private ignored = new IgnoredNames()
  constructor() {
    this.disposables.add(atom.project.onDidChangeFiles(this.filesChanged))
    this.disposables.add(atom.project.onDidChangePaths(this.pathsChanged))
    for (const path of this.paths) {
      this.update(path)
    }
  }

  public destroy() {
    this.disposables.dispose()
    this.tags.clear()
  }

  public update(path: string) {
    this.inProgress = true
    let fn: boolean = false
    let curfile: Map<string, LineRec[]> = new Map()
    let cmd: string | undefined = atom.config.get(
      'ide-haskell-hasktags.hasktagsPath',
    )
    const env = Object.create(process.env)
    const args = []
    if (cmd === 'hasktags.js') {
      env.ELECTRON_RUN_AS_NODE = 1
      env.ELECTRON_NO_ATTACH_CONSOLE = 1
      cmd = process.execPath
      args.push('--no-deprecation')
      args.push(require.resolve('@atom-haskell/hasktags-js'))
    }
    args.push('-eRo-')
    if (atom.config.get('ide-haskell-hasktags.ignoreCloseImplementation')) {
      args.push('--ignore-close-implementation')
    }
    args.push(path)
    execFile(
      cmd,
      args,
      { env, encoding: 'utf8', maxBuffer: Infinity },
      (error, data, stderr) => {
        try {
          if (error) {
            switch (stderr) {
              case '<stdout>: hFlush: illegal operation (handle is closed)':
                break
              default:
                console.warn('hasktags stderr', stderr)
                atom.notifications.addError('Failed to run hasktags', {
                  detail: error.message,
                  stack: error.stack,
                  dismissable: true,
                })
                return
            }
          }
          const lines = data.split(EOL)
          for (const line of lines.slice(0, -1)) {
            switch (true) {
              case line === '\x0c':
                fn = true
                break
              case fn:
                fn = false
                const res = /^(.*),\d+$/.exec(line)
                if (res === null) continue
                const [, src] = res
                curfile = new Map()
                this.tags.set(src, curfile)
                break
              default:
                const rxr = /^(.*)\x7f(.*)\x01(\d+),(\d+)$/.exec(line)
                if (rxr === null) continue
                const [, context, tagName, lineNo] = rxr
                let obj = curfile.get(tagName)
                if (obj === undefined) {
                  obj = []
                  curfile.set(tagName, obj)
                }
                obj.push({ context, line: parseInt(lineNo, 10) })
            }
          }
        } finally {
          this.inProgress = false
        }
      },
    )
  }

  public listTags(uri?: string) {
    const res: SymRec[] = []
    if (!uri) {
      this.tags.forEach((tagMap, uri) =>
        tagMap.forEach((lines, tag) =>
          lines.forEach(({ context, line }) =>
            res.push({ tag, uri, context, line }),
          ),
        ),
      )
    } else {
      const tagMap = this.tags.get(uri)
      if (tagMap !== undefined) {
        tagMap.forEach((lines, tag) =>
          lines.forEach(({ context, line }) =>
            res.push({ tag, uri, context, line }),
          ),
        )
      }
    }
    return res
  }

  public findTag(tag: string) {
    const res: SymRec[] = []
    this.tags.forEach((tagMap, uri) => {
      const lines = tagMap.get(tag)
      if (lines === undefined) return
      lines.forEach(({ context, line }) => {
        res.push({ tag, uri, context, line })
      })
    })
    return res
  }

  private filesChanged = (evts: FilesystemChangeEvent) => {
    const dirs = atom.project.getDirectories()
    for (const evt of evts) {
      if (!evt.path.endsWith('.hs') && !evt.path.endsWith('.lhs')) continue
      if (this.ignored.matches(evt.path)) continue
      if (atom.config.get('ide-haskell-hasktags.ignoreVCSIgnoredPaths')) {
        const idx = dirs.findIndex((x) => x.contains(evt.path))
        if (idx === -1) continue
        const repo = atom.project.getRepositories()[idx]
        if (repo && repo.isPathIgnored(evt.path)) continue
      }
      switch (evt.action) {
        case 'created':
          this.update(evt.path)
          break
        case 'modified':
          this.update(evt.path)
          break
        case 'deleted':
          this.tags.delete(evt.path)
          break
        case 'renamed':
          // tslint:disable-next-line: no-non-null-assertion
          this.tags.delete(evt.oldPath!)
          this.update(evt.path)
          break
      }
    }
  }

  private pathsChanged = (paths: string[]) => {
    const removedPaths = this.paths.filter((p) => !paths.includes(p))
    const addedPaths = paths.filter((p) => !this.paths.includes(p))
    if (removedPaths.length > 0) {
      Array.from(this.tags.keys())
        .filter((f) => removedPaths.some((p) => f.startsWith(p + sep)))
        .forEach((k) => this.tags.delete(k))
    }
    for (const path of addedPaths) {
      this.update(path)
    }
    this.paths = paths
  }
}
