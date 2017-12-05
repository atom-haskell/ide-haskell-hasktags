"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    hasktagsPath: {
        type: 'string',
        default: 'hasktags.js',
        description: `Path to hasktags executable; if set to 'hasktags.js'
(default) will use bundled ghcjs-powered implementation`,
    },
    ignoreCloseImplementation: {
        type: 'boolean',
        default: 'true',
        description: `Ignore symbols with the same name that are close together
in terms of lines. May require restart.`,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsTUFBTSxHQUFHO0lBQ3BCLFlBQVksRUFBRTtRQUNaLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLGFBQWE7UUFDdEIsV0FBVyxFQUFFO3dEQUN1QztLQUNyRDtJQUNELHlCQUF5QixFQUFFO1FBQ3pCLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLE1BQU07UUFDZixXQUFXLEVBQUU7d0NBQ3VCO0tBQ3JDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGhhc2t0YWdzUGF0aDoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdoYXNrdGFncy5qcycsXG4gICAgZGVzY3JpcHRpb246IGBQYXRoIHRvIGhhc2t0YWdzIGV4ZWN1dGFibGU7IGlmIHNldCB0byAnaGFza3RhZ3MuanMnXG4oZGVmYXVsdCkgd2lsbCB1c2UgYnVuZGxlZCBnaGNqcy1wb3dlcmVkIGltcGxlbWVudGF0aW9uYCxcbiAgfSxcbiAgaWdub3JlQ2xvc2VJbXBsZW1lbnRhdGlvbjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiAndHJ1ZScsXG4gICAgZGVzY3JpcHRpb246IGBJZ25vcmUgc3ltYm9scyB3aXRoIHRoZSBzYW1lIG5hbWUgdGhhdCBhcmUgY2xvc2UgdG9nZXRoZXJcbmluIHRlcm1zIG9mIGxpbmVzLiBNYXkgcmVxdWlyZSByZXN0YXJ0LmAsXG4gIH0sXG59XG4iXX0=