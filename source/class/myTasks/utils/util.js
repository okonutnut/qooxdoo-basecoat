export function formatStatus(status) {
    switch (status) {
        case 0:
            return "Not Started";
        case 1:
            return "In Progress";
        case 2:
            return "Done";
        default:
            return "Unknown";
    }
}