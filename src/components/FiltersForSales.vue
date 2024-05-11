<template>
  <div class="filters-component">
    <div
      :class="
        isLabelVisible && $q.screen.width <= 820
          ? 'flex row items-start'
          : 'flex row items-center'
      "
    >
      <!-- FILTER LABEL -->
      <div
        v-if="isLabelVisible"
        class="col-auto text-14 text-weight-medium q-mr-lg"
      >
        Filters:
      </div>
      <div
        class="col flex q-gutter-y-sm"
        :class="
          $q.screen.width <= 414
            ? 'justify-start q-gutter-sm q-mt-xs'
            : 'justify-start'
        "
      >
        <!-- SEARCH FILTER -->
        <q-input
          v-if="isSearchVisible"
          :class="`minmax-width my-input-field height-31 use-input q-px-md
          ${isLabelVisible && 'q-mr-md'}`"
          dense
          borderless
          v-model="keyword"
          placeholder="Search"
          @keydown.enter="searchKeyword()"
        >
          <template v-slot:append>
            <q-icon
              v-if="keyword"
              name="close"
              @click="fetchAll()"
              class="cursor-pointer text-black"
            />
            <q-icon
              @click="searchKeyword() && filter('category') && filter('time')"
              class="cursor-pointer text-black"
              :class="!keyword && 'disabled'"
              name="search"
            />
          </template>
        </q-input>

        <!-- SELECT TYPE FOR SALES NAMES FILTER -->
        <q-select
          v-if="isSelectForSalesPgVisible"
          class="minmax-width my-select-field height-31 q-mr-md"
          dense
          borderless
          v-model="type"
          :label="type !== null ? '' : 'Select name'"
          @update:model-value="filter('category')"
          emit-value
          map-options
          option-label="label"
          option-value="value"
          :options="optionsForSalesPg"
          hide-bottom-space
          :popup-content-class="
            DarkMode ? 'my-option-style-dark' : 'my-option-style-light'
          "
          transition-show="scale"
          transition-hide="scale"
          options-selected-class="selected-class"
        >
          <!-- <template v-slot:append>
            <q-icon
              v-if="type"
              name="close"
              @click="fetchAll()"
              class="cursor-pointer text-black"
            />
          </template> -->
        </q-select>

        <!-- DATE FILTER -->
        <q-select
          v-if="isFilterDateVisible"
          dense
          borderless
          v-model="date_session"
          @update:model-value="filter('time')"
          :options="dateOptions"
          emit-value
          map-options
          option-value="value"
          option-label="label"
          :class="`minmax-width my-select-field height-31 text-14 ${
            isLabelVisible && 'q-mr-md'
          }`"
          :label="date_session !== null ? '' : 'Select date'"
          :popup-content-class="
            DarkMode ? 'my-option-style-dark' : 'my-option-style-light'
          "
          transition-show="scale"
          transition-hide="scale"
          options-selected-class="selected-class"
        >
          <!-- <template v-slot:append>
            <q-icon
              v-if="date_session !== null"
              name="close"
              @click="fetchAll()"
              class="cursor-pointer text-black"
            />
          </template> -->
          <!-- <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" color="placeholder" />
          </template> -->
          <template v-slot:after-options>
            <q-separator class="my-text-accent-0" />
            <div v-if="isDateRangeVisible" class="q-px-sm">
              <!-- <q-item-section class="my-text-accent-2 q-my-sm"
                >Custom Range</q-item-section
              > -->
              <q-form ref="formDateRange" greedy>
                <div class="q-mt-sm">
                  <label>From</label>
                  <q-input
                    class="my-border-accent-0 my-border-radius-5 my-input-field filter-date-field q-px-sm label-accent-2"
                    v-model="fromDate"
                    borderless
                    dense
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                    @focus="$refs.startDate.show()"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="calendar_today"
                        class="cursor-pointer my-text-accent-2"
                      >
                        <q-popup-proxy
                          class="rounded-borders"
                          ref="startDate"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            @update:model-value="() => $refs.startDate.hide()"
                            v-model="fromDate"
                            mask="MM-YYYY"
                            :emit-value="true"
                            @input="formatDate"
                            minimal
                            flat
                            class="my-bg-accent-0 text-black"
                            color="white"
                            text-color="black"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="q-mt-xs">
                  <label>To</label>
                  <q-input
                    class="filter-date-field my-border-radius-5 my-input-field my-border-accent-0 label-accent-2 q-px-sm"
                    v-model="toDate"
                    borderless
                    dense
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                    @focus="$refs.endDate.show()"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="calendar_today"
                        class="cursor-pointer my-text-accent-2 margin-top-n13 my-text-accent-1 text-14"
                      >
                        <q-popup-proxy
                          ref="endDate"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            @update:model-value="() => $refs.endDate.hide()"
                            v-model="toDate"
                            mask="MM-YYYY"
                            :emit-value="true"
                            @input="formatDate"
                            minimal
                            flat
                            class="my-bg-accent-0 text-black"
                            color="white"
                            text-color="black"
                          >
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </q-form>
              <div class="q-mb-md q-mt-sm">
                <q-btn
                  @click="submitDateRange()"
                  class="rounded-borders-16 bg-primary q-mt-sm text-white full-width"
                  label="Apply"
                  :disable="btnLoadingState"
                  flat
                  no-caps
                  dense
                />
              </div>
            </div>
            <div v-else class="q-pa-sm">
              <label>Date</label>
              <q-input
                class="my-border-accent-0 my-border-radius-5 my-input-field filter-date-field q-px-sm label-accent-2"
                :model-value="dateSelected"
                borderless
                dense
                hide-bottom-space
                readonly
              >
                <template v-slot:append>
                  <q-icon
                    name="calendar_today"
                    class="cursor-pointer margin-top-n13 my-text-accent-2 text-14"
                  >
                    <q-popup-proxy
                      ref="selectDate"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        @update:model-value="() => $refs.selectDate.hide()"
                        v-model="dateSelected"
                        minimal
                        flat
                        class="my-bg-accent-0 text-white"
                        color="white"
                        text-color="black"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </template>
        </q-select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
// import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { GetSearchResult, SearchedParams } from "../composables/SearchForSales";
// import { DarkMode } from 'src/core/composables/Triggers';

export default {
  props: {
    labelVisible: {
      type: Boolean,
      default: true,
    },
    selectVisible: {
      type: Boolean,
      default: false,
    },
    searchVisible: {
      type: Boolean,
      default: false,
    },
    filterDateVisible: {
      type: Boolean,
      default: true,
    },
    dynamicOptionsForSalesPg: {
      type: Array,
      default: () => [
        {
          value: "ACEF",
          label: "ACEF",
        },
        {
          value: "Animal Production",
          label: "Animal Production",
        },
        {
          value: "Crop Production",
          label: "Crop Production",
        },
        {
          value: "Coffee Processing Center",
          label: "Coffee Processing Center",
        },
        {
          value: "International Convention Center",
          label: "International Convention Center",
        },
        {
          value: "International House I",
          label: "International House I",
        },
        {
          value: "International House II",
          label: "International House II",
        },
        {
          value: "Marketing Center",
          label: "Marketing Center",
        },
        {
          value: "Printing Services Unit",
          label: "Printing Services Unit",
        },
        {
          value: "Student Dormitory",
          label: "Student Dormitory",
        },
        {
          value: "Swimming Pool",
          label: "Swimming Pool",
        },
        {
          value: "Transport Service",
          label: "Transport Service",
        },
        {
          value: "University Entrep. Center",
          label: "University Entrep. Center",
        },
        {
          value: "Rentals and Concessions",
          label: "Rentals and Concessions",
        },
        {
          value: "Rolle Hall",
          label: "Rolle Hall",
        },
        {
          value: "Water Refilling Station",
          label: "Water Refilling Station",
        },
      ],
    },
    dynamicOptionsForBooksPg: {
      type: Array,
      default: () => [],
    },
    pathEndPoint: {
      type: String,
      default: "",
    },
    dateRangeVisible: {
      type: Boolean,
      default: true,
    },
    dynamicDateOptions: {
      type: Array,
      default: () => [
        {
          value: 0,
          label: "All Time",
        },
      ],
    },
    methods: {
      formatDate(value) {
        // Parse the input value as MM/YYYY
        const [month, year] = value.split("-");
        // Set the selectedDate to the first day of the month in YYYY-MM-DD format
        this.selectedDate = `${year}-${month.padStart(2, "0")}-01`;
      },
    },
    parameters: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const $q = useQuasar();
    // let store = useStore();

    // Filter references if visible
    let isLabelVisible = ref(props.labelVisible);
    let isSelectForSalesPgVisible = ref(props.selectVisible);
    let isSearchVisible = ref(props.searchVisible);
    let isFilterDateVisible = ref(props.filterDateVisible);
    let isDateRangeVisible = ref(props.dateRangeVisible);

    // Date references
    let dateSelected = ref(null);
    let fromDate = ref(null);
    let toDate = ref(null);
    let date_session = ref(null);

    // Dynamic options references
    let optionsForSalesPg = ref(props.dynamicOptionsForSalesPg);
    const dateOptions = ref(props.dynamicDateOptions);

    let params = ref(props.parameters);
    let endPoint = ref(props.pathEndPoint);

    let type = ref(null);
    let keyword = ref(null);

    let btnLoadingState = ref(false);
    let DarkMode = ref(false);

    const filter = (action) => {
      let payload;

      // Date session
      if (action === "time") {
        payload = {
          search: {
            date_session: date_session.value,
            keyword: keyword.value,
            date: dateSelected.value,
          },
          unit_name: type.value,
        };

        // Filters that do not need format checking/validation
      } else if (action === "date" || "category") {
        payload = {
          date_gte: fromDate.value,
          date_lte: toDate.value,
          unit_name: type.value,
          search: {
            keyword: keyword.value,
            date: dateSelected.value,
          },
        };
        // Date range
      } else if (action === "dates") {
        btnLoadingState.value = true;

        if (isValidDateRange(fromDate, toDate)) {
          payload = {
            date_gte: fromDate.value,
            date_lte: toDate.value,
            unit_name: type.value,
            search: {
              keyword: keyword.value,
              date: dateSelected.value,
            },
          };
        }
      } else {
        payload = {
          date_gte: fromDate.value,
          date_lte: toDate.value,
          unit_name: type.value,
          search: {
            keyword: keyword.value,
            date: dateSelected.value,
          },
        };
      }

      // Merge params available
      if (params.value) {
        payload = {
          ...params.value,
          ...payload,
        };
      }

      // Global access
      SearchedParams.value = payload;

      // Send request
      GetSearchResult({
        endpoint: endPoint.value, // Url endpoint
        params: payload, // Payload to send in api
      }).then((response) => {
        // Run when form is submitted
        let status = Boolean(response.status === 200);
        $q.notify({
          position: $q.screen.width < 767 ? "top" : "bottom-right",
          classes: `${
            status ? "my-success-notif" : "my-error-notif"
          } q-px-lg q-pt-none q-pb-none`,
          html: true,
          message: status
            ? `<div class="text-bold">Search results - ${
                response.data.results
                  ? response.data.results.length
                  : response.data.length
              }</div>`
            : `<div class="text-bold">Failed!</div> ${response.message}.`,
        });
        btnLoadingState.value = false;
      });
    };

    // Filter using date range
    const formDateRange = ref(null);

    const submitDateRange = () => {
      formDateRange.value.validate().then((success) => {
        if (success) {
          filter("dates");
        }
      });
    };

    // Filter using single date
    watch(dateSelected, () => {
      dateSelected.value && filter("date");
    });

    // Filter using keyword
    const searchKeyword = () => {
      keyword.value && filter("search");
    };

    // When close icon is clicked, this removes user input
    const fetchAll = () => {
      keyword.value = null;
      // type.value = null;
      // date_session.value = null;
      // filter("time");
    };

    // Check date range filter if valid
    /* This defensive programming will limit the error obtained when:
    - fromDate or toDate is null; and
    - fromDate is much later than toDate */
    const isValidDateRange = (fromDate, toDate) => {
      if (fromDate.value > toDate.value) {
        $q.notify({
          position: $q.screen.width < 767 ? "top" : "bottom-right",
          classes: "my-error-notif q-px-lg q-pt-none q-pb-none",
          html: true,
          message: '<div class="text-bold">Invalid Date Range!</div>',
        });
        return false;
      }
      return true;
    };

    return {
      DarkMode,
      fromDate,
      toDate,
      date_session,
      filter,
      btnLoadingState,
      type,
      keyword,
      isSelectForSalesPgVisible,
      isSearchVisible,
      isFilterDateVisible,
      optionsForSalesPg,
      dateOptions,
      isLabelVisible,
      isDateRangeVisible,
      formDateRange,
      submitDateRange,
      dateSelected,
      searchKeyword,
      fetchAll,
    };
  },
};
</script>

<style lang="scss">
.filters-component {
  .minmax-width {
    min-width: 144px;
    max-width: 144px;
    @media screen and (min-width: $breakpoint-sm-max) {
      // min-width: 190px;
      // max-width: 190px;
      min-width: 144px;
      max-width: 144px;
    }
  }

  .minmax-width-190 {
    min-width: 190px;
    max-width: 190px;
  }
}

.filter-date-field {
  height: 30px;
  .q-field__control,
  .q-field__marginal {
    height: 30px;
  }
}
</style>
