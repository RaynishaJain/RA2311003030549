const axios = require('axios');
const { logToTestServer } = require('../logging_middleware/index.js');

const recordedNotifications = [
    { "ID": "d146095a-0d86-4a34-9e69-3900a14576bc", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30" },
    { "ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18" },
    { "ID": "81589ada-0ad3-4f77-9554-f52fb558e09d", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06" },
    { "ID": "0005513a-142b-4bbc-8678-eefec65e1ede", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:50:54" },
    { "ID": "ea836726-c25e-4f21-a72f-544a6af8a37f", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42" },
    { "ID": "003cb427-8fc6-47f7-bb00-be228f6b0d2c", "Type": "Result", "Message": "external", "Timestamp": "2026-04-22 17:50:30" },
    { "ID": "e5c4ff20-31bf-4d40-8f02-72fda59e8918", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:18" },
    { "ID": "1cfce5ee-ad37-4894-8946-d707627176a5", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-04-22 17:50:06" },
    { "ID": "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:49:54" },
    { "ID": "8a7412bd-6065-4d09-8501-a37f11cc848b", "Type": "Placement", "Message": "Advanced Micro Devices Inc. hiring", "Timestamp": "2026-04-22 17:49:42" }
];

const CATEGORY_IMPORTANCE = { "Placement": 3, "Result": 2, "Event": 1 };

// Renamed sorting helper
function sortByImportance(firstItem, secondItem) {
    const firstScore = CATEGORY_IMPORTANCE[firstItem.Type] || 0;
    const secondScore = CATEGORY_IMPORTANCE[secondItem.Type] || 0;

    if (firstScore !== secondScore) return firstScore - secondScore;

    const firstTime = new Date(firstItem.Timestamp).getTime();
    const secondTime = new Date(secondItem.Timestamp).getTime();
    return firstTime - secondTime;
}

// Renamed array extraction logic
function fetchPrioritySubset(dataCollection, limit = 10) {
    const PriorityStack = [];
    for (const record of dataCollection) {
        if (PriorityStack.length < limit) {
            PriorityStack.push(record);
            PriorityStack.sort(sortByImportance);
        } else {
            if (sortByImportance(record, PriorityStack[0]) > 0) {
                PriorityStack[0] = record;
                PriorityStack.sort(sortByImportance);
            }
        }
    }
    return PriorityStack.reverse();
}

async function synchronizeNotificationsFeed() {
    const NOTIFICATION_URL = "http://20.207.122.201/evaluation-service/notifications";
    
    await logToTestServer('info', 'handler', 'Opening dynamic pipeline request.');

    let availableNotifications = recordedNotifications;

    try {
        const networkResponse = await axios.get(NOTIFICATION_URL, { timeout: 2000 });
        availableNotifications = networkResponse.data.notifications;
        await logToTestServer('info', 'handler', 'Sync complete for server alerts.');
    } catch (networkError) {
        await logToTestServer('warn', 'handler', 'Local offline data was pulled as fallback.');
    }

    const filteredTop10 = fetchPrioritySubset(availableNotifications, 10);

    console.log("\n--------- DISPLAYING PRIORITY FEED CONTENT ---------");
    filteredTop10.forEach((alertItem, position) => {
        console.log(`${position + 1}. [${alertItem.Type}] ${alertItem.Message} (${alertItem.Timestamp})`);
    });
    console.log("----------------------------------------------------\n");
}

synchronizeNotificationsFeed();
