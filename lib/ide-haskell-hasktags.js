"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const tags_1 = require("./tags");
const tags_list_view_1 = require("./tags-list-view");
var config_1 = require("./config");
exports.config = config_1.config;
let stack;
let disposables;
let active = false;
async function showList(editor, tags) {
    const tag = await tags_list_view_1.selectListView(tags, exports.tagsInstance.inProgress);
    if (tag !== undefined)
        open(editor, tag);
}
function open(editor, tag) {
    const edp = editor.getPath();
    if (edp) {
        stack.push({
            uri: edp,
            line: editor.getLastCursor().getBufferRow(),
            column: editor.getLastCursor().getBufferColumn(),
        });
    }
    void atom.workspace.open(tag.uri, {
        initialLine: tag.line,
        searchAllPanes: true,
    });
}
function activate() {
    active = true;
    stack = [];
    exports.tagsInstance = new tags_1.Tags();
    disposables = new atom_1.CompositeDisposable();
    disposables.add(atom.commands.add('atom-workspace', {
        'ide-haskell-hasktags:show-tags': () => {
            if (!active)
                return;
            const ed = atom.workspace.getActiveTextEditor();
            if (ed)
                void showList(ed, exports.tagsInstance.listTags());
        },
        'ide-haskell-hasktags:go-back': () => {
            const prevpos = stack.pop();
            if (prevpos) {
                void atom.workspace.open(prevpos.uri, {
                    initialLine: prevpos.line,
                    initialColumn: prevpos.column,
                    searchAllPanes: true,
                });
            }
        },
    }));
    disposables.add(atom.commands.add('atom-text-editor', {
        'ide-haskell-hasktags:show-file-tags': ({ currentTarget }) => {
            if (!active)
                return;
            const editor = currentTarget.getModel();
            const path = editor.getPath();
            if (!path)
                return;
            void showList(editor, exports.tagsInstance.listTags(path));
        },
    }));
    disposables.add(atom.contextMenu.add({
        'atom-text-editor[data-grammar~="haskell"]': [
            {
                label: 'Show File Tags',
                command: 'ide-haskell-hasktags:show-file-tags',
            },
        ],
    }));
    disposables.add(atom.menu.add([
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
    ]));
}
exports.activate = activate;
function consumeUPI(register) {
    const upi = register({
        name: 'ide-haskell-hasktags',
    });
    const disp = new atom_1.CompositeDisposable();
    disposables.add(disp);
    disp.add(upi);
    disp.add(atom.commands.add('atom-text-editor', {
        'ide-haskell-hasktags:go-to-declaration': ({ currentTarget, detail }) => {
            if (!active)
                return;
            const editor = currentTarget.getModel();
            const buffer = editor.getBuffer();
            const er = upi.getEventRange(editor, detail);
            if (!er)
                return;
            const { crange } = er;
            const { start, end } = buffer.rangeForRow(crange.start.row, false);
            const crange2 = { start: crange.start, end: crange.end };
            const left = buffer.getTextInRange([start, crange.start]);
            crange2.start.column = left.search(/[\w']*$/);
            const right = buffer.getTextInRange([crange.end, end]);
            crange2.end.column += right.search(/[^\w']|$/);
            const symbol = buffer.getTextInRange(crange2);
            const tags = exports.tagsInstance.findTag(symbol);
            switch (tags.length) {
                case 0:
                    return;
                case 1:
                    void open(editor, tags[0]);
                    break;
                default:
                    void showList(editor, tags);
            }
        },
    }));
    disp.add(atom.contextMenu.add({
        'atom-text-editor[data-grammar~="haskell"]': [
            {
                label: 'Go to Declaration',
                command: 'ide-haskell-hasktags:go-to-declaration',
            },
        ],
    }));
    return disp;
}
exports.consumeUPI = consumeUPI;
function deactivate() {
    disposables.dispose();
    exports.tagsInstance.destroy();
    active = false;
}
exports.deactivate = deactivate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlLWhhc2tlbGwtaGFza3RhZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaWRlLWhhc2tlbGwtaGFza3RhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBc0Q7QUFDdEQsaUNBQTZCO0FBQzdCLHFEQUFpRDtBQUdqRCxtQ0FBaUM7QUFBeEIsMEJBQUEsTUFBTSxDQUFBO0FBR2YsSUFBSSxLQUlGLENBQUE7QUFDRixJQUFJLFdBQWdDLENBQUE7QUFDcEMsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBRWxCLEtBQUssVUFBVSxRQUFRLENBQUMsTUFBa0IsRUFBRSxJQUFjO0lBQ3hELE1BQU0sR0FBRyxHQUFHLE1BQU0sK0JBQWMsQ0FBQyxJQUFJLEVBQUUsb0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUMvRCxJQUFJLEdBQUcsS0FBSyxTQUFTO1FBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUMxQyxDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsTUFBa0IsRUFBRSxHQUFXO0lBRTNDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUM1QixJQUFJLEdBQUcsRUFBRTtRQUNQLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDVCxHQUFHLEVBQUUsR0FBRztZQUNSLElBQUksRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsWUFBWSxFQUFFO1lBQzNDLE1BQU0sRUFBRSxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsZUFBZSxFQUFFO1NBQ2pELENBQUMsQ0FBQTtLQUNIO0lBQ0QsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ2hDLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSTtRQUNyQixjQUFjLEVBQUUsSUFBSTtLQUNyQixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsU0FBZ0IsUUFBUTtJQUN0QixN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QUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzdDLE1BQU0sSUFBSSxHQUFHLG9CQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3pDLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDbkIsS0FBSyxDQUFDO29CQUNKLE9BQU07Z0JBQ1IsS0FBSyxDQUFDO29CQUNKLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDMUIsTUFBSztnQkFDUDtvQkFDRSxLQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7YUFDOUI7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUNILENBQUE7SUFFRCxJQUFJLENBQUMsR0FBRyxDQUNOLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO1FBQ25CLDJDQUEyQyxFQUFFO1lBQzNDO2dCQUNFLEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLE9BQU8sRUFBRSx3Q0FBd0M7YUFDbEQ7U0FDRjtLQUNGLENBQUMsQ0FDSCxDQUFBO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDO0FBbERELGdDQWtEQztBQUVELFNBQWdCLFVBQVU7SUFDeEIsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ3JCLG9CQUFZLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDdEIsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNoQixDQUFDO0FBSkQsZ0NBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IFRhZ3MgfSBmcm9tICcuL3RhZ3MnXG5pbXBvcnQgeyBzZWxlY3RMaXN0VmlldyB9IGZyb20gJy4vdGFncy1saXN0LXZpZXcnXG5pbXBvcnQgeyBJVVBJUmVnaXN0cmF0aW9uIH0gZnJvbSAnYXRvbS1oYXNrZWxsLXVwaSdcblxuZXhwb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnXG5cbmV4cG9ydCBsZXQgdGFnc0luc3RhbmNlOiBUYWdzXG5sZXQgc3RhY2s6IEFycmF5PHtcbiAgdXJpOiBzdHJpbmdcbiAgbGluZTogbnVtYmVyXG4gIGNvbHVtbjogbnVtYmVyXG59PlxubGV0IGRpc3Bvc2FibGVzOiBDb21wb3NpdGVEaXNwb3NhYmxlXG5sZXQgYWN0aXZlID0gZmFsc2VcblxuYXN5bmMgZnVuY3Rpb24gc2hvd0xpc3QoZWRpdG9yOiBUZXh0RWRpdG9yLCB0YWdzOiBTeW1SZWNbXSkge1xuICBjb25zdCB0YWcgPSBhd2FpdCBzZWxlY3RMaXN0Vmlldyh0YWdzLCB0YWdzSW5zdGFuY2UuaW5Qcm9ncmVzcylcbiAgaWYgKHRhZyAhPT0gdW5kZWZpbmVkKSBvcGVuKGVkaXRvciwgdGFnKVxufVxuXG5mdW5jdGlvbiBvcGVuKGVkaXRvcjogVGV4dEVkaXRvciwgdGFnOiBTeW1SZWMpIHtcbiAgLy8gZWRpdG9yID89IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICBjb25zdCBlZHAgPSBlZGl0b3IuZ2V0UGF0aCgpXG4gIGlmIChlZHApIHtcbiAgICBzdGFjay5wdXNoKHtcbiAgICAgIHVyaTogZWRwLFxuICAgICAgbGluZTogZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRCdWZmZXJSb3coKSxcbiAgICAgIGNvbHVtbjogZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRCdWZmZXJDb2x1bW4oKSxcbiAgICB9KVxuICB9XG4gIHZvaWQgYXRvbS53b3Jrc3BhY2Uub3Blbih0YWcudXJpLCB7XG4gICAgaW5pdGlhbExpbmU6IHRhZy5saW5lLFxuICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIGFjdGl2ZSA9IHRydWVcbiAgc3RhY2sgPSBbXVxuICB0YWdzSW5zdGFuY2UgPSBuZXcgVGFncygpXG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBkaXNwb3NhYmxlcy5hZGQoXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2lkZS1oYXNrZWxsLWhhc2t0YWdzOnNob3ctdGFncyc6ICgpID0+IHtcbiAgICAgICAgaWYgKCFhY3RpdmUpIHJldHVyblxuICAgICAgICBjb25zdCBlZCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBpZiAoZWQpIHZvaWQgc2hvd0xpc3QoZWQsIHRhZ3NJbnN0YW5jZS5saXN0VGFncygpKVxuICAgICAgfSxcbiAgICAgICdpZGUtaGFza2VsbC1oYXNrdGFnczpnby1iYWNrJzogKCkgPT4ge1xuICAgICAgICBjb25zdCBwcmV2cG9zID0gc3RhY2sucG9wKClcbiAgICAgICAgaWYgKHByZXZwb3MpIHtcbiAgICAgICAgICB2b2lkIGF0b20ud29ya3NwYWNlLm9wZW4ocHJldnBvcy51cmksIHtcbiAgICAgICAgICAgIGluaXRpYWxMaW5lOiBwcmV2cG9zLmxpbmUsXG4gICAgICAgICAgICBpbml0aWFsQ29sdW1uOiBwcmV2cG9zLmNvbHVtbixcbiAgICAgICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSksXG4gIClcbiAgZGlzcG9zYWJsZXMuYWRkKFxuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywge1xuICAgICAgJ2lkZS1oYXNrZWxsLWhhc2t0YWdzOnNob3ctZmlsZS10YWdzJzogKHsgY3VycmVudFRhcmdldCB9KSA9PiB7XG4gICAgICAgIGlmICghYWN0aXZlKSByZXR1cm5cbiAgICAgICAgY29uc3QgZWRpdG9yOiBUZXh0RWRpdG9yID0gKGN1cnJlbnRUYXJnZXQgYXMgYW55KS5nZXRNb2RlbCgpXG4gICAgICAgIGNvbnN0IHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIGlmICghcGF0aCkgcmV0dXJuXG4gICAgICAgIHZvaWQgc2hvd0xpc3QoZWRpdG9yLCB0YWdzSW5zdGFuY2UubGlzdFRhZ3MocGF0aCkpXG4gICAgICB9LFxuICAgIH0pLFxuICApXG4gIGRpc3Bvc2FibGVzLmFkZChcbiAgICBhdG9tLmNvbnRleHRNZW51LmFkZCh7XG4gICAgICAnYXRvbS10ZXh0LWVkaXRvcltkYXRhLWdyYW1tYXJ+PVwiaGFza2VsbFwiXSc6IFtcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiAnU2hvdyBGaWxlIFRhZ3MnLFxuICAgICAgICAgIGNvbW1hbmQ6ICdpZGUtaGFza2VsbC1oYXNrdGFnczpzaG93LWZpbGUtdGFncycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICApXG4gIGRpc3Bvc2FibGVzLmFkZChcbiAgICBhdG9tLm1lbnUuYWRkKFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdIYXNrZWxsIElERScsXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0hhc2t0YWdzJyxcbiAgICAgICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnU2hvdyBUYWdzJyxcbiAgICAgICAgICAgICAgICBjb21tYW5kOiAnaWRlLWhhc2tlbGwtaGFza3RhZ3M6c2hvdy10YWdzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnU2hvdyBGaWxlIFRhZ3MnLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6ICdpZGUtaGFza2VsbC1oYXNrdGFnczpzaG93LWZpbGUtdGFncycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0pLFxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lVVBJKHJlZ2lzdGVyOiBJVVBJUmVnaXN0cmF0aW9uKSB7XG4gIGNvbnN0IHVwaSA9IHJlZ2lzdGVyKHtcbiAgICBuYW1lOiAnaWRlLWhhc2tlbGwtaGFza3RhZ3MnLFxuICB9KVxuICBjb25zdCBkaXNwID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBkaXNwb3NhYmxlcy5hZGQoZGlzcClcbiAgZGlzcC5hZGQodXBpKVxuXG4gIGRpc3AuYWRkKFxuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywge1xuICAgICAgJ2lkZS1oYXNrZWxsLWhhc2t0YWdzOmdvLXRvLWRlY2xhcmF0aW9uJzogKHsgY3VycmVudFRhcmdldCwgZGV0YWlsIH0pID0+IHtcbiAgICAgICAgaWYgKCFhY3RpdmUpIHJldHVyblxuICAgICAgICBjb25zdCBlZGl0b3I6IFRleHRFZGl0b3IgPSAoY3VycmVudFRhcmdldCBhcyBhbnkpLmdldE1vZGVsKClcbiAgICAgICAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICAgIGNvbnN0IGVyID0gdXBpLmdldEV2ZW50UmFuZ2UoZWRpdG9yLCBkZXRhaWwpXG4gICAgICAgIGlmICghZXIpIHJldHVyblxuICAgICAgICBjb25zdCB7IGNyYW5nZSB9ID0gZXJcbiAgICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBidWZmZXIucmFuZ2VGb3JSb3coY3JhbmdlLnN0YXJ0LnJvdywgZmFsc2UpXG4gICAgICAgIGNvbnN0IGNyYW5nZTIgPSB7IHN0YXJ0OiBjcmFuZ2Uuc3RhcnQsIGVuZDogY3JhbmdlLmVuZCB9XG4gICAgICAgIGNvbnN0IGxlZnQgPSBidWZmZXIuZ2V0VGV4dEluUmFuZ2UoW3N0YXJ0LCBjcmFuZ2Uuc3RhcnRdKVxuICAgICAgICBjcmFuZ2UyLnN0YXJ0LmNvbHVtbiA9IGxlZnQuc2VhcmNoKC9bXFx3J10qJC8pXG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gYnVmZmVyLmdldFRleHRJblJhbmdlKFtjcmFuZ2UuZW5kLCBlbmRdKVxuICAgICAgICBjcmFuZ2UyLmVuZC5jb2x1bW4gKz0gcmlnaHQuc2VhcmNoKC9bXlxcdyddfCQvKVxuICAgICAgICBjb25zdCBzeW1ib2wgPSBidWZmZXIuZ2V0VGV4dEluUmFuZ2UoY3JhbmdlMilcbiAgICAgICAgY29uc3QgdGFncyA9IHRhZ3NJbnN0YW5jZS5maW5kVGFnKHN5bWJvbClcbiAgICAgICAgc3dpdGNoICh0YWdzLmxlbmd0aCkge1xuICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHZvaWQgb3BlbihlZGl0b3IsIHRhZ3NbMF0pXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2b2lkIHNob3dMaXN0KGVkaXRvciwgdGFncylcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KSxcbiAgKVxuXG4gIGRpc3AuYWRkKFxuICAgIGF0b20uY29udGV4dE1lbnUuYWRkKHtcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcn49XCJoYXNrZWxsXCJdJzogW1xuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdHbyB0byBEZWNsYXJhdGlvbicsXG4gICAgICAgICAgY29tbWFuZDogJ2lkZS1oYXNrZWxsLWhhc2t0YWdzOmdvLXRvLWRlY2xhcmF0aW9uJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gIClcblxuICByZXR1cm4gZGlzcFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIHRhZ3NJbnN0YW5jZS5kZXN0cm95KClcbiAgYWN0aXZlID0gZmFsc2Vcbn1cbiJdfQ==