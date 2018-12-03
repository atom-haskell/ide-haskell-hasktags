"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SelectListView = require("atom-select-list");
const etch = require("etch");
async function selectListView(items, inProgress) {
    let panel;
    let res;
    try {
        res = await new Promise((resolve) => {
            const select = new SelectListView({
                items,
                infoMessage: inProgress ? 'Update is in progress' : undefined,
                elementForItem: (item) => etch.render(etch.dom("li", { class: "two-lines" },
                    etch.dom("div", { class: "primary-line", style: { float: 'right' } }, item.context),
                    etch.dom("div", { class: "primary-line" }, item.tag),
                    etch.dom("div", { class: "secondary-line" },
                        item.uri,
                        ": ",
                        item.line))),
                filterKeyForItem: item => item.tag,
                didCancelSelection: () => {
                    resolve();
                },
                didConfirmSelection: (item) => {
                    resolve(item);
                },
            });
            select.element.classList.add('ide-haskell');
            panel = atom.workspace.addModalPanel({
                item: select,
                visible: true,
            });
            select.focus();
        });
    }
    finally {
        panel && panel.destroy();
    }
    return res;
}
exports.selectListView = selectListView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFncy1saXN0LXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdGFncy1saXN0LXZpZXcudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQW1EO0FBRW5ELDZCQUE0QjtBQUVyQixLQUFLLFVBQVUsY0FBYyxDQUNsQyxLQUFlLEVBQ2YsVUFBbUI7SUFFbkIsSUFBSSxLQUFnRCxDQUFBO0lBQ3BELElBQUksR0FBdUIsQ0FBQTtJQUMzQixJQUFJO1FBQ0YsR0FBRyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQXFCLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDdEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQUM7Z0JBQ2hDLEtBQUs7Z0JBQ0wsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLFNBQVM7Z0JBQzdELGNBQWMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDbkMsaUJBQUksS0FBSyxFQUFDLFdBQVc7b0JBQ25CLGtCQUFLLEtBQUssRUFBQyxjQUFjLEVBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQU87b0JBQ3pFLGtCQUFLLEtBQUssRUFBQyxjQUFjLElBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBTztvQkFDMUMsa0JBQUssS0FBSyxFQUFDLGdCQUFnQjt3QkFBRSxJQUFJLENBQUMsR0FBRzs7d0JBQUksSUFBSSxDQUFDLElBQUksQ0FBTyxDQUN0RCxDQUNTO2dCQUNoQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHO2dCQUNsQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFBO2dCQUNYLENBQUM7Z0JBQ0QsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUNmLENBQUM7YUFDRixDQUFDLENBQUE7WUFDRixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDM0MsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO2dCQUNuQyxJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFPLEVBQUUsSUFBSTthQUNkLENBQUMsQ0FBQTtZQUNGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNoQixDQUFDLENBQUMsQ0FBQTtLQUNIO1lBQVM7UUFDUixLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3pCO0lBQ0QsT0FBTyxHQUFHLENBQUE7QUFDWixDQUFDO0FBckNELHdDQXFDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZWxlY3RMaXN0VmlldyA9IHJlcXVpcmUoJ2F0b20tc2VsZWN0LWxpc3QnKVxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgZXRjaCBmcm9tICdldGNoJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VsZWN0TGlzdFZpZXcoXG4gIGl0ZW1zOiBTeW1SZWNbXSxcbiAgaW5Qcm9ncmVzczogYm9vbGVhbixcbik6IFByb21pc2U8U3ltUmVjIHwgdW5kZWZpbmVkPiB7XG4gIGxldCBwYW5lbDogUGFuZWw8U2VsZWN0TGlzdFZpZXc8U3ltUmVjPj4gfCB1bmRlZmluZWRcbiAgbGV0IHJlczogU3ltUmVjIHwgdW5kZWZpbmVkXG4gIHRyeSB7XG4gICAgcmVzID0gYXdhaXQgbmV3IFByb21pc2U8U3ltUmVjIHwgdW5kZWZpbmVkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgICAgaXRlbXMsXG4gICAgICAgIGluZm9NZXNzYWdlOiBpblByb2dyZXNzID8gJ1VwZGF0ZSBpcyBpbiBwcm9ncmVzcycgOiB1bmRlZmluZWQsXG4gICAgICAgIGVsZW1lbnRGb3JJdGVtOiAoaXRlbSkgPT4gZXRjaC5yZW5kZXIoXG4gICAgICAgICAgPGxpIGNsYXNzPVwidHdvLWxpbmVzXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJpbWFyeS1saW5lXCIgc3R5bGU9e3sgZmxvYXQ6ICdyaWdodCcgfX0+e2l0ZW0uY29udGV4dH08L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmltYXJ5LWxpbmVcIj57aXRlbS50YWd9PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2Vjb25kYXJ5LWxpbmVcIj57aXRlbS51cml9OiB7aXRlbS5saW5lfTwvZGl2PlxuICAgICAgICAgIDwvbGk+LFxuICAgICAgICApIGFzIEhUTUxFbGVtZW50LFxuICAgICAgICBmaWx0ZXJLZXlGb3JJdGVtOiBpdGVtID0+IGl0ZW0udGFnLFxuICAgICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgfSxcbiAgICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+IHtcbiAgICAgICAgICByZXNvbHZlKGl0ZW0pXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgc2VsZWN0LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaWRlLWhhc2tlbGwnKVxuICAgICAgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtcbiAgICAgICAgaXRlbTogc2VsZWN0LFxuICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIHNlbGVjdC5mb2N1cygpXG4gICAgfSlcbiAgfSBmaW5hbGx5IHtcbiAgICBwYW5lbCAmJiBwYW5lbC5kZXN0cm95KClcbiAgfVxuICByZXR1cm4gcmVzXG59XG4iXX0=