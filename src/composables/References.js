import { ref } from "vue";

// Current inventory type selector reference
let selectedInventoryType = ref("Books");

// Current user information
const currentUserInfo = ref({});
const currentUserType = ref("");
const currentToken = ref("");

let linkActive = ref("");

export {
  selectedInventoryType,
  currentUserInfo,
  currentUserType,
  currentToken,
  linkActive,
};
