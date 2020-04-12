"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch_1 = require("minimatch");
function isNotUndefined(x) {
    return x !== undefined;
}
class IgnoredNames {
    constructor() {
        this.ignoredPatterns = atom.config
            .get('core.ignoredNames')
            .map((x) => {
            try {
                return new minimatch_1.Minimatch(x, { matchBase: true, dot: true });
            }
            catch (error) {
                atom.notifications.addWarning('Error parsing ignore pattern (#{ignoredName})', { detail: error.message });
                return undefined;
            }
        })
            .filter(isNotUndefined);
    }
    matches(filePath) {
        for (const ignoredPattern of this.ignoredPatterns) {
            if (ignoredPattern.match(filePath))
                return true;
        }
        return false;
    }
}
exports.IgnoredNames = IgnoredNames;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdub3JlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pZ25vcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQWlEO0FBRWpELFNBQVMsY0FBYyxDQUFJLENBQWdCO0lBQ3pDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsQ0FBQTtBQUN4QixDQUFDO0FBRUQsTUFBYSxZQUFZO0lBR3ZCO1FBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTTthQUMvQixHQUFHLENBQUMsbUJBQW1CLENBQUM7YUFDeEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDVCxJQUFJO2dCQUNGLE9BQU8sSUFBSSxxQkFBUyxDQUFDLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7YUFDeEQ7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDM0IsK0NBQStDLEVBQy9DLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FDMUIsQ0FBQTtnQkFDRCxPQUFPLFNBQVMsQ0FBQTthQUNqQjtRQUNILENBQUMsQ0FBQzthQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBRU0sT0FBTyxDQUFDLFFBQWdCO1FBQzdCLEtBQUssTUFBTSxjQUFjLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNqRCxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFBO1NBQ2hEO1FBQ0QsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0NBQ0Y7QUExQkQsb0NBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWluaW1hdGNoLCBJTWluaW1hdGNoIH0gZnJvbSAnbWluaW1hdGNoJ1xuXG5mdW5jdGlvbiBpc05vdFVuZGVmaW5lZDxUPih4OiBUIHwgdW5kZWZpbmVkKTogeCBpcyBUIHtcbiAgcmV0dXJuIHggIT09IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgY2xhc3MgSWdub3JlZE5hbWVzIHtcbiAgcHJpdmF0ZSBpZ25vcmVkUGF0dGVybnM6IElNaW5pbWF0Y2hbXVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWdub3JlZFBhdHRlcm5zID0gYXRvbS5jb25maWdcbiAgICAgIC5nZXQoJ2NvcmUuaWdub3JlZE5hbWVzJylcbiAgICAgIC5tYXAoKHgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gbmV3IE1pbmltYXRjaCh4LCB7IG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgICAgICAnRXJyb3IgcGFyc2luZyBpZ25vcmUgcGF0dGVybiAoI3tpZ25vcmVkTmFtZX0pJyxcbiAgICAgICAgICAgIHsgZGV0YWlsOiBlcnJvci5tZXNzYWdlIH0sXG4gICAgICAgICAgKVxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoaXNOb3RVbmRlZmluZWQpXG4gIH1cblxuICBwdWJsaWMgbWF0Y2hlcyhmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCBpZ25vcmVkUGF0dGVybiBvZiB0aGlzLmlnbm9yZWRQYXR0ZXJucykge1xuICAgICAgaWYgKGlnbm9yZWRQYXR0ZXJuLm1hdGNoKGZpbGVQYXRoKSkgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==