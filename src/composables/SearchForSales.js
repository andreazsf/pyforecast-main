import { httpGet } from "boot/axios";
import { ref, readonly } from "vue";
let currentRows = ref([]);
let Search = ref([]);
let SearchList = readonly(Search);
let SearchedParams = ref(null);
let params = ref(null);

let GetSearchResult = (payload) => {
  params.value = payload.params;
  return new Promise((resolve, reject) => {
    httpGet(
      `sales/${payload.endpoint}`,
      {
        success(response) {
          response.status === 200 && (Search.value = response.data);
          currentRows.value = response.data;
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
  SearchList,
  Search,
  GetSearchResult,
  SearchedParams,
  currentRows,
  params,
};
