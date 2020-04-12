import { Minimatch, IMinimatch } from 'minimatch'

function isNotUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}

export class IgnoredNames {
  private ignoredPatterns: IMinimatch[]

  constructor() {
    this.ignoredPatterns = atom.config
      .get('core.ignoredNames')
      .map((x) => {
        try {
          return new Minimatch(x, { matchBase: true, dot: true })
        } catch (error) {
          atom.notifications.addWarning(
            'Error parsing ignore pattern (#{ignoredName})',
            { detail: error.message },
          )
          return undefined
        }
      })
      .filter(isNotUndefined)
  }

  public matches(filePath: string) {
    for (const ignoredPattern of this.ignoredPatterns) {
      if (ignoredPattern.match(filePath)) return true
    }
    return false
  }
}
