const axios = require('axios');
const { logToTestServer } = require('../logging_middleware/index.js');

const fallbackNotifications = [
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

const TYPE_WEIGHTS = { "Placement": 3, "Result": 2, "Event": 1 };

function compareNotifications(a, b) {
    const weightA = TYPE_WEIGHTS[a.Type] || 0;
    const weightB = TYPE_WEIGHTS[b.Type] || 0;

    if (weightA !== weightB) return weightA - weightB;

    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    return timeA - timeB;
}

function getTopN(notifications, n = 10) {
    const heap = [];
    for (const item of notifications) {
        if (heap.length < n) {
            heap.push(item);
            heap.sort(compareNotifications);
        } else {
            if (compareNotifications(item, heap[0]) > 0) {
                heap[0] = item;
                heap.sort(compareNotifications);
            }
        }
    }
    return heap.reverse();
}

async function fetchNotifications() {
    const url = "http://20.207.122.201/evaluation-service/notifications";
    
    // Using middleware for startup log
    await logToTestServer('info', 'handler', 'Attempting to fetch data from Notification API.');

    let notifications = fallbackNotifications;

    try {
        const res = await axios.get(url, { timeout: 2000 });
        notifications = res.data.notifications;
        await logToTestServer('info', 'handler', 'Successfully downloaded live notifications.');
    } catch (err) {
        await logToTestServer('warn', 'handler', 'Using local fallback notifications dataset.');
    }

    const top10 = getTopN(notifications, 10);

    console.log("\n================ TOP 10 PRIORITY INBOX ================");
    top10.forEach((notif, index) => {
        console.log(`${index + 1}. [${notif.Type}] ${notif.Message} (${notif.Timestamp})`);
    });
    console.log("======================================================");
}

fetchNotifications();