import { httpDel, httpGet, httpPost, httpPut } from "../boot/axios";
import { ref, readonly } from "vue";
import { date } from "quasar";

// Fetch Accounts
const FetchAccounts = () => {
  return new Promise((resolve, reject) => {
    httpGet("accounts", {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Fetch All Data From a Category using ID
const FetchAccountsData = (path, payload) => {
  return new Promise((resolve, reject) => {
    httpGet(
      `accounts/?${payload.endpoint}`,
      {
        success(response) {
          resolve(response.data);
        },
        catch(response) {
          reject(response);
        },
      },
      payload.params
    );
  });
};

// Fetch Single Account
const FetchAccount = (payload) => {
  return new Promise((resolve, reject) => {
    httpGet(`accounts/?${payload._id}`, {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Fetch Sales
const FetchSales = () => {
  return new Promise((resolve, reject) => {
    httpGet("sales", {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Fetch All Data From a Category using ID
const FetchSalesData = (path, payload) => {
  return new Promise((resolve, reject) => {
    httpGet(
      `sales/?${payload.endpoint}`,
      {
        success(response) {
          resolve(response.data);
        },
        catch(response) {
          reject(response);
        },
      },
      payload.params
    );
  });
};

// Fetch Inventory
const FetchInventory = () => {
  return new Promise((resolve, reject) => {
    httpGet("inventories", {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Fetch All Data From a Category using ID
const FetchInventoryData = (path, payload) => {
  return new Promise((resolve, reject) => {
    httpGet(
      `inventories/?${payload.endpoint}`,
      {
        success(response) {
          resolve(response.data);
        },
        catch(response) {
          reject(response);
        },
      },
      payload.params
    );
  });
};

// Fetch ForecastData
const FetchForecastData = (path, payload) => {
  return new Promise((resolve, reject) => {
    httpGet(
      `forecasts/?${payload.endpoint}`,
      {
        success(response) {
          resolve(response.data);
        },
        catch(response) {
          reject(response);
        },
      },
      payload.params
    );
  });
};

// Adding Account to DB
const AddAccount = (payload) => {
  return new Promise((resolve, reject) => {
    httpPost("accounts", payload, {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Adding Sales Data to DB
const AddSalesData = (payload) => {
  return new Promise((resolve, reject) => {
    httpPost("sales", payload, {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Adding Sales Data to DB
const AddInventoryData = (payload) => {
  return new Promise((resolve, reject) => {
    httpPost("inventories", payload, {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Adding Forecast Data to DB
const AddForecastData = (payload) => {
  return new Promise((resolve, reject) => {
    httpPost("forecasts", payload, {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Editing Account on DB
const EditAccount = (payload) => {
  return new Promise((resolve, reject) => {
    httpPut(`accounts/${payload._id}`, payload, {
      success(response) {
        resolve(response);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Editing Sales Data on DB
const EditSalesData = (payload) => {
  return new Promise((resolve, reject) => {
    httpPut(`sales/${payload._id}`, payload, {
      success(response) {
        resolve(response);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Editing Inventory Data on DB
const EditInventoryData = (payload) => {
  return new Promise((resolve, reject) => {
    httpPut(`inventories/${payload._id}`, payload, {
      success(response) {
        resolve(response);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Deleting Account on DB
const DeleteAccount = (payload) => {
  return new Promise((resolve, reject) => {
    httpDel(`accounts/${payload._id}`, {
      success(response) {
        resolve(response);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Deleting Sales Data on DB
const DeleteSalesData = (payload) => {
  return new Promise((resolve, reject) => {
    httpDel(`sales/${payload._id}`, {
      success(response) {
        resolve(response);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Deleting Inventory Data on DB
const DeleteInventoryData = (payload) => {
  return new Promise((resolve, reject) => {
    httpDel(`inventories/${payload._id}`, {
      success(response) {
        resolve(response);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Deleting Forecast Data on DB
const ResetForecastData = (payload) => {
  return new Promise((resolve, reject) => {
    httpDel(`forecasts/${payload._id}`, {
      success(response) {
        resolve(response);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Posting forecasting initiative for sales
const ForecastSales = (payload) => {
  return new Promise((resolve, reject) => {
    httpPost("sales/forecasting", payload, {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Posting forecasting initiative for inventory
const ForecastInventory = (payload) => {
  return new Promise((resolve, reject) => {
    httpPost("inventories/forecasting", payload, {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// Posting login initiative
const UserLogin = (payload) => {
  return new Promise((resolve, reject) => {
    httpPost("logins", payload, {
      success(response) {
        resolve(response.data);
      },
      catch(response) {
        reject(response);
      },
    });
  });
};

// SEARCH FUNCTIONS

let CurrentRows = ref([]);
let Search = ref([]);
let SearchedParams = ref(null);
let params = ref(null);

// queries for mobile date and time filters
let TypeValue = ref(null);
let PrevDate = ref(null);
let Keyword = ref(null);
let DateRange = ref({ from: null, to: null });

let GetSearchResult = (payload) => {
  params.value = payload.params;
  return new Promise((resolve, reject) => {
    httpGet(
      `${payload.path}/${payload.endpoint}`,
      {
        success(response) {
          response.status === 200 && (Search.value = response.data);
          CurrentRows.value = response.data;
          resolve(response);
        },
        catch(response) {
          console.log(response);
          reject(response);
        },
      },
      payload.params
    );
  });
};

export {
  Search,
  FetchAccounts,
  FetchAccountsData,
  FetchAccount,
  FetchSalesData,
  FetchSales,
  FetchInventory,
  FetchInventoryData,
  FetchForecastData,
  AddAccount,
  AddSalesData,
  AddInventoryData,
  AddForecastData,
  EditAccount,
  EditSalesData,
  EditInventoryData,
  DeleteAccount,
  DeleteSalesData,
  DeleteInventoryData,
  ResetForecastData,
  ForecastSales,
  ForecastInventory,
  UserLogin,

  //Other methods
  GetSearchResult,
  CurrentRows as currentRows,
  SearchedParams,
  TypeValue as typeValue,
  PrevDate as prevDate,
  Keyword as keyword,
  DateRange as dateRange,
};
