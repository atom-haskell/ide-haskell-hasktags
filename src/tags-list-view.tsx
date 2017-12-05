import SelectListView = require('atom-select-list')
import { Panel } from 'atom'
import * as etch from 'etch'

export async function selectListView(
  items: SymRec[],
  inProgress: boolean,
): Promise<SymRec | undefined> {
  let panel: Panel<SelectListView<SymRec>> | undefined
  let res: SymRec | undefined
  try {
    res = await new Promise<SymRec | undefined>((resolve) => {
      const select = new SelectListView({
        items,
        infoMessage: inProgress ? 'Update is in progress' : undefined,
        elementForItem: (item) => etch.render(
          <li class="two-lines">
            <div class="primary-line" style={{ float: 'right' }}>{item.context}</div>
            <div class="primary-line">{item.tag}</div>
            <div class="secondary-line">{item.uri}: {item.line}</div>
          </li>,
        ) as HTMLElement,
        filterKeyForItem: item => item.tag,
        didCancelSelection: () => {
          resolve()
        },
        didConfirmSelection: (item) => {
          resolve(item)
        },
      })
      select.element.classList.add('ide-haskell')
      panel = atom.workspace.addModalPanel({
        item: select,
        visible: true,
      })
      select.focus()
    })
  } finally {
    panel && panel.destroy()
  }
  return res
}
