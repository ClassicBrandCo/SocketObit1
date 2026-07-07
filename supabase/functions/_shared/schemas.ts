export const memberPayloadSchema = {
  orgId: "string",
  email: "string",
  password: "string",
  displayName: "string",
  loginUsername: "string",
  roleId: "string",
  dataRole: "string",
  managerId: "string?",
  groupIds: "array",
  allocatedQuota: "number",
};
