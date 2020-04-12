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
        default: 'false',
        description: `Ignore symbols with the same name that are close together
in terms of lines. May require restart.`,
    },
    ignoreVCSIgnoredPaths: {
        type: 'boolean',
        default: 'true',
        description: 'Ignore paths in `.gitignore` (if any).',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsTUFBTSxHQUFHO0lBQ3BCLFlBQVksRUFBRTtRQUNaLElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLGFBQWE7UUFDdEIsV0FBVyxFQUFFO3dEQUN1QztLQUNyRDtJQUNELHlCQUF5QixFQUFFO1FBQ3pCLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLE9BQU87UUFDaEIsV0FBVyxFQUFFO3dDQUN1QjtLQUNyQztJQUNELHFCQUFxQixFQUFFO1FBQ3JCLElBQUksRUFBRSxTQUFTO1FBQ2YsT0FBTyxFQUFFLE1BQU07UUFDZixXQUFXLEVBQUUsd0NBQXdDO0tBQ3REO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGhhc2t0YWdzUGF0aDoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdoYXNrdGFncy5qcycsXG4gICAgZGVzY3JpcHRpb246IGBQYXRoIHRvIGhhc2t0YWdzIGV4ZWN1dGFibGU7IGlmIHNldCB0byAnaGFza3RhZ3MuanMnXG4oZGVmYXVsdCkgd2lsbCB1c2UgYnVuZGxlZCBnaGNqcy1wb3dlcmVkIGltcGxlbWVudGF0aW9uYCxcbiAgfSxcbiAgaWdub3JlQ2xvc2VJbXBsZW1lbnRhdGlvbjoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiAnZmFsc2UnLFxuICAgIGRlc2NyaXB0aW9uOiBgSWdub3JlIHN5bWJvbHMgd2l0aCB0aGUgc2FtZSBuYW1lIHRoYXQgYXJlIGNsb3NlIHRvZ2V0aGVyXG5pbiB0ZXJtcyBvZiBsaW5lcy4gTWF5IHJlcXVpcmUgcmVzdGFydC5gLFxuICB9LFxuICBpZ25vcmVWQ1NJZ25vcmVkUGF0aHM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogJ3RydWUnLFxuICAgIGRlc2NyaXB0aW9uOiAnSWdub3JlIHBhdGhzIGluIGAuZ2l0aWdub3JlYCAoaWYgYW55KS4nLFxuICB9LFxufVxuXG4vLyBnZW5lcmF0ZWQgYnkgdHlwZWQtY29uZmlnLmpzXG5kZWNsYXJlIG1vZHVsZSAnYXRvbScge1xuICBpbnRlcmZhY2UgQ29uZmlnVmFsdWVzIHtcbiAgICAnaWRlLWhhc2tlbGwtaGFza3RhZ3MuaGFza3RhZ3NQYXRoJzogc3RyaW5nXG4gICAgJ2lkZS1oYXNrZWxsLWhhc2t0YWdzLmlnbm9yZUNsb3NlSW1wbGVtZW50YXRpb24nOiBib29sZWFuXG4gICAgJ2lkZS1oYXNrZWxsLWhhc2t0YWdzLmlnbm9yZVZDU0lnbm9yZWRQYXRocyc6IGJvb2xlYW5cbiAgICAnaWRlLWhhc2tlbGwtaGFza3RhZ3MnOiB7XG4gICAgICBoYXNrdGFnc1BhdGg6IHN0cmluZ1xuICAgICAgaWdub3JlQ2xvc2VJbXBsZW1lbnRhdGlvbjogYm9vbGVhblxuICAgICAgaWdub3JlVkNTSWdub3JlZFBhdGhzOiBib29sZWFuXG4gICAgfVxuICB9XG59XG4iXX0=