export const ADMIN_STATS = [
  { label: "Total Species", value: "512", change: "+12 this month", icon: "species" },
  { label: "Registered Users", value: "248", change: "+18 this month", icon: "users" },
  { label: "Pending Approvals", value: "23", change: "7 urgent", icon: "pending" },
  { label: "Monthly Visitors", value: "4,820", change: "+14% vs last month", icon: "visitors" },
];

export const ADMIN_PENDING = [
  { id: "SUB-1042", species: "Delonix regia", submitter: "M. Zahra", type: "Photo", date: "28 Jun 2026", status: "Pending" },
  { id: "SUB-1038", species: "Ocimum tenuiflorum", submitter: "A. Khan", type: "Observation", date: "27 Jun 2026", status: "Pending" },
  { id: "SUB-1031", species: "Terminalia arjuna", submitter: "S. Iqbal", type: "Specimen", date: "25 Jun 2026", status: "Review" },
  { id: "SUB-1024", species: "Bougainvillea glabra", submitter: "R. Ali", type: "GPS Pin", date: "24 Jun 2026", status: "Pending" },
];

export const ADMIN_ACTIVITY = [
  { action: "Species updated", detail: "Azadirachta indica — phenology data", user: "S. Iqbal", time: "2h ago" },
  { action: "User approved", detail: "Contributor access granted", user: "Dr. A. Rehman", time: "5h ago" },
  { action: "QR generated", detail: "14 labels for Zone A trees", user: "System", time: "Yesterday" },
  { action: "Export completed", detail: "Campus flora checklist CSV", user: "Dr. A. Rehman", time: "Yesterday" },
];

export const CONTRIBUTOR_STATS = [
  { label: "Pending Reviews", value: "9", change: "3 due today", icon: "pending" },
  { label: "Verified This Month", value: "34", change: "+8 vs last month", icon: "verified" },
  { label: "Specimens Curated", value: "127", change: "12 families", icon: "specimen" },
  { label: "Identification Keys", value: "6", change: "2 in draft", icon: "keys" },
];

export const CONTRIBUTOR_QUEUE = [
  { id: "REV-882", species: "Cassia fistula", student: "M. Zahra", confidence: "High", submitted: "29 Jun 2026" },
  { id: "REV-879", species: "Ficus religiosa", student: "A. Khan", confidence: "Medium", submitted: "28 Jun 2026" },
  { id: "REV-875", species: "Nerium oleander", student: "R. Ali", confidence: "Low", submitted: "27 Jun 2026" },
  { id: "REV-871", species: "Pongamia pinnata", student: "H. Noor", confidence: "High", submitted: "26 Jun 2026" },
];

export const CONTRIBUTOR_RECENT = [
  { species: "Calliandra haematocephala", action: "Approved observation", date: "30 Jun 2026" },
  { species: "Jasminum sambac", action: "Updated diagnostic chars", date: "29 Jun 2026" },
  { species: "Acacia nilotica", action: "Linked herbarium voucher", date: "28 Jun 2026" },
];

export const STUDENT_STATS = [
  { label: "My Submissions", value: "14", change: "4 pending review", icon: "submissions" },
  { label: "Approved", value: "9", change: "+2 this month", icon: "approved" },
  { label: "Photos Uploaded", value: "38", change: "12 species", icon: "photos" },
  { label: "Quiz Score", value: "86%", change: "Families module", icon: "quiz" },
];

export const STUDENT_SUBMISSIONS = [
  { id: "MY-014", species: "Delonix regia", type: "Photo + GPS", status: "Pending", date: "28 Jun 2026" },
  { id: "MY-013", species: "Azadirachta indica", type: "Observation", status: "Approved", date: "22 Jun 2026" },
  { id: "MY-012", species: "Ocimum tenuiflorum", type: "Photo", status: "Approved", date: "18 Jun 2026" },
  { id: "MY-011", species: "Bougainvillea glabra", type: "Draft", status: "Draft", date: "15 Jun 2026" },
];

export const STUDENT_LEARNING = [
  { title: "Plant Identification Key", progress: 72, label: "Trees module" },
  { title: "Botanical Glossary", progress: 45, label: "180 / 400 terms" },
  { title: "Families Quiz", progress: 86, label: "Last score" },
];
