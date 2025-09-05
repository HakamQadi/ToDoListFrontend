export const STATUS_MAP = {
  0: "Todo",
  1: "Pending",
  2: "Done",
}

export const STATUS_OPTIONS = [
  { value: 0, label: "Todo" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Done" },
]

export const getStatusString = (status) => {
  return STATUS_MAP[status] || "Unknown"
}

export const getStatusValue = (statusString) => {
  const entry = Object.entries(STATUS_MAP).find(([, value]) => value === statusString)
  return entry ? Number.parseInt(entry[0]) : 0
}
